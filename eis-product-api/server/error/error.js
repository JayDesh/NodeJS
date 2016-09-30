/**
 * Module for creating and handling server errors.
 */

var logger = require('../utility/utility.js');

var code = module.exports.code = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  FORBIDDEN: 'FORBIDDEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR'
};

/**
 * Wrap a javascript error as a ServerError.
 * @param  {Error} err        [required] the error to wrap
 * @param  {string} name      [optional] the error name. default: 'ServerError'
 * @param  {integer} status   [optional] the response status to send. default: 500
 * @param  {string} errorCode [optional] the errorCode default: code.SERVER_ERROR
 * @return {Error}            the wrapped error
 */
var wrap = module.exports.wrap = function (err, name, status, errorCode) {
  err.name = name || 'ServerError';
  err.status = status || 500;
  err.errorCode = errorCode || code.SERVER_ERROR;
  return err;
};

module.exports.handle = function(err, callback) {
  if (! err.errorCode)
    err = wrap(err, 'ServerError', 500, code.SERVER_ERROR);
  logger.logsAsync(err);
  callback(err);
};


var ServerError = module.exports.ServerError = function ServerError (message, status) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.status = status || 500;
  this.errorCode = code.SERVER_ERROR;
  this.message = message;
};

var NotFound = module.exports.NotFound = function NotFound (message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.status = 404;
  this.errorCode = code.NOT_FOUND;
  this.message = message;
};

var BadRequest = module.exports.BadRequest = function BadRequest (message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.status = 400;
  this.errorCode = code.BAD_REQUEST;
  this.message = message;
};

var Unauthorized = module.exports.Unauthorized = function Unauthorized (message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.status = 401;
  this.errorCode = code.UNAUTHORIZED;
  this.message = message;
};

var Forbidden = module.exports.Forbidden = function Forbidden (message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.status = 403;
  this.errorCode = code.FORBIDDEN;
  this.message = message;
};

var ExpiredToken = module.exports.ExpiredToken = function ExpiredToken (message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.status = 403;
  this.errorCode = code.EXPIRED_TOKEN;
  this.message = message;
};
