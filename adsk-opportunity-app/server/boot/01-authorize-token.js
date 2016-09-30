var _ = require('underscore');
var request = require('request');
var NodeCache = require('node-cache');
var debug = require('debug')('adsk:boot:authorize-token');
var error = require('../error/error.js');
var utility = require('../utility/utility.js');

debug('init');

/**
 * Set this to false to disable this module.
 * @type {Boolean}
 */

var ENABLED = true;
if(process.env.ENABLE_OAUTH==="false"){
	ENABLED=false;
}

/**
 * Update your AuthorizeOptions here
 * @type {Object}
 */
var authorizeOptions = {

  // ClientApplication.id for THIS application.
  clientId: process.env.OAUTH2_CLIENT_ID || 'REPLACE WITH YOUR CLIENT ID',

  // ClientApplication.restApiKey for THIS application.
  clientSecret: process.env.OAUTH2_CLIENT_SECRET || 'REPLACE WITH YOUR CLIENT SECRET',

  // Permissions required to use THIS application.
  permissions: [ process.env.APP_NAME ],

  // Information about the OAUTH2 server.
  oauth2: {
    host: process.env.AUTH_APP_NAME + '.herokuapp.com',
    getToken: '/oauth2/token?grant_type=client_credentials&client_id={id}&client_secret={secret}',
    validate: '/oauth2/validate/token/{id}/permissions/{a}'
  },

  cacheTTL : 3600 // 1 hour
};

/**
 * Update your SslOptions here
 */
var enforceSslOptions = {
  disableInEnvironment: ['local']
};

module.exports = function mountAuthorizeToken (app) {

  if (!ENABLED) return;

  // Initialize 'enforceSsl' middleware
  app.use('/', enforceSsl(enforceSslOptions));
  debug('installed enforceSsl middleware.');

  // Initialize 'authorize' middleware
  app.use('/api', authorize(authorizeOptions));
  debug('installed authorize middleware.');

};


/**
 * Authorize the Bearer token for the given permission.
 * @param {object} options configuration options
 * @param {[string]} options.permissions the list of permissions that grant permission to your app.
 *   If the authorization token contains at least one of these permissions, authorization is granted.
 * @param {string} options.oauth2.host the oauth2 server containing a rest endpoint
 *   at '/api/ClientTokens/{id}' for retrieving access permissions for the bearer of the token.
 * @param {number} options.cacheTTL the time-to-live (in seconds) for cached tokens.
 * @return {function} the middleware function to use in your express app.
 */
function authorize (options) {

  debug('authorize:init:', options);

  var defaultOptions = {
    clientId: '',
    clientSecret: '',
    permissions: [],
    oauth2: {
      host: process.env.AUTH_APP_NAME + '.herokuapp.com',
      getToken: '/oauth2/token?grant_type=client_credentials&client_id={id}&client_secret={secret}',
      validate: '/oauth2/validate/token/{id}/permissions/{a}'
    },
    cacheTTL : 3600 // 1 hour
  };
  options = _.extend(defaultOptions, options);

  var cache = new NodeCache({ stdTTL: options.cacheTTL });

  var myToken = null;

  // Fetch an OAuth token for using the VALIDATE endpoint.
  var getOauthToken = function (id, secret, callback) {
    debug('getOauthToken:', id, secret);

    var uri = options.oauth2.getToken
      .replace('{id}', id)
      .replace('{secret}', secret);

    var url = 'https://' + options.oauth2.host + uri;

    debug('getOauthToken:request:', url);
    request(url, function (err, res, body) {
      if (err) return callback(error.wrap(err));
      debug('getOauthToken:response:', body);
      if (res.statusCode === 200) {
        try {
          var result = JSON.parse(body);
          return callback(null, result);
        }
        catch (e) {
          return callback(e);
        }
      }
      else {
        return callback(new error.ServerError(body, res.statusCode));
      }
    });
  }; // var getOauthToken = function (callback) {


  // Validate a token using the VALIDATE endpoint.
  var validateToken = function (myToken, tokenToValidate, permissions, cache, callback) {
    debug('validateToken:%s:using:%s', tokenToValidate, myToken);

    var uri = options.oauth2.validate
      .replace('{id}', tokenToValidate)
      .replace('{a}', permissions.join(','));
    var url = 'https://' + options.oauth2.host + uri;
    debug('validateToken:request:', url);

    request(
      {
        url: url,
        headers: { 'Authorization': 'Bearer ' + myToken}
      },
      function (err, res, body) {
        if (err) return (error.wrap(err));
        debug('validateToken:response:', body);
        if (res.statusCode === 200) {
          try {
            var result = JSON.parse(body);
            if (result.token) {
              cache.set(result.token.id, result.token);
            }
            return callback(null, result);
          }
          catch (e) {
            return callback(e);
          }
        }
        else {
          err = new error.ServerError(res.body, res.statusCode);
          // If local token is invalid, remove from cache
          if (res.statusCode === 401 || res.statusCode === 403) {
            cache.del('MY_TOKEN');
          }

          return callback(err);
        }
      }
    ); // request(
  }; // var validateToken = function (myToken, tokenToValidate, permissions, callback) {


  return function (req, res, next) {
    debug('authorize:headers.authorization:', req.headers['authorization']);

    var sendError = function (err) {
      if (!err.status || err.status === 500)
        utility.logsAsync(err);
      res.status(err.status).send({
        error: {
          name: err.name,
          status: err.status,
          errorCode: err.errorCode,
          message: err.message
        }
      });
    };

    var isValid = function (clientToken) {
      if (_.intersection(clientToken.permissions, options.permissions)
          .length === options.permissions.length
      ) {
        debug('authorize:isValid():true');
        return true;
      }
      else {
        debug('authorize:isValid():false');
        return false;
      }
    };

    var isExpired = function (clientToken) {
      // Check time to live (TTL)
      var expires = new Date(clientToken.created);
      expires.setSeconds(expires.getSeconds() + clientToken.ttl);
      if (expires > new Date()) {
        debug('authorize:isExpired():false');
        return false;
      }
      else {
        debug('authorize:isExpired():true');
        return true;
      }
    };

    if (! req.headers.authorization) {
      return sendError(new error.Unauthorized('Missing Authorization Header.'));
    }

    var parts = req.headers.authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return sendError(new error.Unauthorized('Missing Authorization Bearer Header.'));
    }

    var token = parts[1];

    // Fetch token from cache.
    var clientToken = cache.get(token);

    // Validate cached token.
    if(clientToken) {
      debug('found cached:', clientToken.id);

      if (isExpired(clientToken))
        return sendError(new error.ExpiredToken('Authorization Token is expired'));

      if (!isValid(clientToken))
        return sendError(new error.Forbidden('Not authorized for permissions: ' + options.permissions));

      // Token is valid!
      debug('NEXT:token is valid:', token);
      return next();
    }

    // Now, validate the token against the oauth server.

    // Callback for validateToken.
    var onValidateToken = function (err, result) {
      debug('onValidateToken:', result);
      if (err) return sendError(error.wrap(err, 500));

      if (result.success) {
        // Token is valid!
        clientToken = result.token;
        cache.set(clientToken.id, clientToken);
        debug('NEXT:token is valid (saved to cache):', token);
        return next();
      }
      else {
        if (result.failureCode === error.code.NOT_FOUND) {
          return sendError(new error.Unauthorized('Could not validate token: ' + token));
        }
        else if (result.failureCode === error.code.EXPIRED_TOKEN) {
          return sendError(new error.ExpiredToken('Token is expired: ' + token));
        }
        else if (result.failureCode === error.code.FORBIDDEN) {
          // Unauthorized
          var message = 'Token ' + token + ' is not authorized for permissions: ' + options.permissions;
          return sendError(new error.Forbidden(message));
        }
        else {
          return sendError(new error.ServerError('Unexpected error: ' + result.failureCode));
        }
      }
    }; // var onValidateToken = function (err, result) {

    var myToken = cache.get('MY_TOKEN');

    if (! myToken) {
      // Fetch oauth token and save in cache
      return getOauthToken(options.clientId, options.clientSecret, function (err, result) {
        if (err) return sendError(error.wrap(err, 500));
        myToken = result;
        cache.set('MY_TOKEN', result, result.ttl);

        // Validate token
        return validateToken(myToken.id, token, options.permissions, cache, onValidateToken);
      });
    }
    return validateToken(myToken.id, token, options.permissions, cache, onValidateToken);

  }; // return function authorize (req, res, next) {
} // function authorize (options) {

/**
 * Enforce HTTPS for all requests. This middleware will cause the server to throw an error if
 * requests are made over normal HTTP. NOTE: the architecture of Heroku intercepts all HTTPS requests
 * at the load balancer, which decrypts the request and dispatches it as HTTP to the requested
 * endpoint, with the 'x-forwarded-proto' header set to 'https'.
 *
 * Because of this, it is not practical to run this module on a local DEV server, so it is recommended
 * to set a local NODE_ENV environment variable, and use the #disableInEnvironment option to disable
 * this module in your local environment.
 *
 * @param {object} options configuration options
 * @param {[string]} options.disableInEnvironment this middleware will not be enabled if your NODE_ENV
 *   is set to one of these values.
 * @return {function} the middleware function to use in your express app.
 */
function enforceSsl (options) {
  debug('enforceSsl:init:', options);

  var defaultOptions = {
    disableInEnvironment: ['local']
  };
  if (typeof options === 'undefined')
    options = defaultOptions;

  return function (req, res, next) {
    debug('**enforceSsl** Runtime environment is: ', process.env.NODE_ENV);

    // If NODE_ENV is in the disable list, skip this filter.
    if (_.contains(options.disableInEnvironment, process.env.NODE_ENV)) {
      return next();
    }

    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.status(400).send({
        error: {
          name: 'BadRequest',
          status: 400,
          errorCode: error.code.BAD_REQUEST,
          message: 'Use HTTPS for all requests'
        }
      });
    }
    return next();
  };
} // function enforceSsl (options) {
