var utility = require('../utility/utility.js');
var uuid = require('node-uuid'),
_ = require('underscore'),
util = require('util'),
logger = require('../utility/logger.js').async;

module.exports = function(app) {
	
  var remotes = app.remotes();
  
  remotes.after('**', function (ctx, next) {
    var startTime = new Date().getTime();  	 
    if(process.env.logRequestResponseHeaders==="true") {
      //utility.logsAsync(null, 'Outgoing response: ' + JSON.stringify(ctx.result));
      logger.info('Outgoing response: ', JSON.stringify(ctx.result));
      
    }
    next();
    var endTime = new Date().getTime();
    logger.info('EXECUTION TIME - outgoingresponse - ' + (endTime - startTime) + ' ms.',{"Opportunity":"opportunitynumber"});
  });
  
};
