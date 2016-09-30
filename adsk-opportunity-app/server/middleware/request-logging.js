var utility = require('../utility/utility.js'),
logger = require('../utility/logger.js').async;

module.exports.requestLogging = function() {

  return function (req, res, next) {
  	var startTime = new Date().getTime();
    if(req!==null && process.env.logRequestResponseHeaders==="true") {
     // utility.logsAsync(null, 'Incoming request: ' + req.body + '\nRequest headers: ' + JSON.stringify(req.headers));
      logger.info('Incoming request: ',req.body);
      logger.info('Request headers: ' , JSON.stringify(req.headers));
    }
    res.on('finish',function(){
    	var endTime = new Date().getTime();
      	logger.info('EXECUTION TIME - requestlogging response complete - ' + (endTime - startTime) + ' ms.',{"Opportunity":"Opportunity"});
    });
    next();
  };

};
