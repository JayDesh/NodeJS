var badRequest = require('../error/error.js');
var app = require('../../server/server.js').getapp;
var responseutility = require('../utility/response-utility.js');
var errorCodes = require('../error/error.js'),
logger = require('../utility/logger.js').async;


/**
 * This middleware module is used to validate incoming url and request params.
 * @returns {Function}
 */
var body='';
var utility = require('../utility/utility.js');
module.exports = function() {
	
  return function requestValidator(req, res, next) { 	
	  	var startTime = new Date().getTime();
	  	var oppty=req.path.split('/')[1];	  	 
	  	if(!utility.validateOpportunityNumber(oppty)){	  		
	  		        var err = new Error('Invalid Request please check default request format');
					err.name = 'Invalid Request';					
					err.errorCode = errorCodes.code.BAD_REQUEST;
					err.description='Invalid Request please check default request format';					
					res.send(responseutility.outputwrapper(false,'',err));					
					logger.info('Opportunity format invalid',{"Opportunity":oppty} );
					var endTime = new Date().getTime();
      				logger.info('EXECUTION TIME - requestvalidator - ' + (endTime - startTime) + ' ms.',{"Opportunity":oppty});
	  		
	  	}else{
	  		next();
	  		logger.info("Opportunity format valid",{"Opportunity":oppty});
	  		var endTime = new Date().getTime();
      		logger.info('EXECUTION TIME - requestvalidator - ' + (endTime - startTime) + ' ms.',{"Opportunity":oppty});
	  	}   
    
  };

};
