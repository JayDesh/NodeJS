var _ = require('underscore');
var colors = require('colors/safe');
var util = require('util');
var winston = require('winston');
var moment = require('moment');
/**
 * A winston-provided logger.
 * @type {winston.Logger}
 * usage:
 *   var logger = require('logger');
 *   logger.info('this took %s time at all', 'no');
 */
var logger = module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      name:'info',
      colorize: process.env.NODE_ENV === 'local' ? true : false,
      level: process.env.LOG_LEVEL || 'info',
      timestamp: false,
      showLevel: true,
      /**
       * The log formatter. Update this function to alter the log format.
       * @param  {object} e - the logging event. https://github.com/winstonjs/winston#custom-log-format
       */
      formatter: function (e) {
        // console.log('logger.formatter:', e);
        //console.log("Logger :"+JSON.stringify(e));
        var message = '';
        if (e.timestamp)
          message += util.format('time="%s" ', moment().format());
        if (e.showLevel)
          message += util.format('at="%s" ', e.colorize ? winston.config.colorize(e.level) : e.level);
          message += util.format('message="%s"', e.colorize ? colors.green(e.message) : e.message);
          //message += util.format('oppty="%s"', e.colorize ? colors.green(e.message) : e.message);
          message += util.format(' app="%s"', process.env.APP_NAME || 'Autodesk');
        _.each(Object.keys(e.meta), function (key) {
          var prop = e.meta[key];
          message += ' ' + colors.green(key) + '=';
          if (typeof prop === 'object' || typeof prop === 'number' || typeof prop === 'string')
            message += colors.green(JSON.stringify(prop));
          else
            message += '"' + colors.green(JSON.stringify(prop)) + '"';
        });        
        return message;
      }
      
    }),       
  ]
});

logger.info('logger.js: Created logger at log level:', logger.transports.console);

/**
 * An asynchronous logger.
 * @type {Object}
 * usage:
 *   var logger = require('logger').async;
 *   logger.info('this took %s time at all', 'no');
 */
var async = module.exports.async  = {
  log: function () {
    var args = arguments;
    setImmediate(function () {
      logger.log.apply(logger, args);
    });
  },
  debug: function () {
    var args = arguments;
    setImmediate(function () {
      logger.debug.apply(logger, args);
    });
  },
  verbose: function () {
    var args = arguments;
    setImmediate(function () {
      logger.verbose.apply(logger, args);
    });
  },
  info: function () {
    var args = arguments;
    setImmediate(function () {
      logger.info.apply(logger, args);
    });
  },
  warn: function () {
    var args = arguments;
    setImmediate(function () {
      logger.warn.apply(logger, args);
    });
  },
  error: function () {
    var args = arguments;
    setImmediate(function () {
      logger.error.apply(logger, args);
    });
  },
  transports: logger.transports,
  add: logger.add,
  remove: logger.remove
};

/**
 * Log categories.
 * @type {Object}
 */
var category = module.exports.category = {
  REQ_RCVD: 'REQ_RCVD', // Request received.
  REQ_HEAD: 'REQ_HEAD', // Request headers.
  RES_SENT: 'RES_SENT', // Response sent.
  RES_PYLD: 'RES_PYLD', // Response payload.
  API_CALL: 'API_CALL', // External API call.
  API_RESP: 'API_RESP', // External API response.
  ERROR: 'ERROR' // An error occurred.
};
