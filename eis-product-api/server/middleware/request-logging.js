var utility = require('../utility/utility.js');

module.exports.requestLogging = function() {

  return function (req, res, next) {

    if(req!==null && process.env.logRequestResponseHeaders==="true") {
      utility.logsAsync(null, 'IncomingRequest="' + req.body  + '"' + '\nRequestHeaders=' + JSON.stringify(req.headers));
    }
    next();
  };

};
