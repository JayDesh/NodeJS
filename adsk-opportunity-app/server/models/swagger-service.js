
var utility = require('../utility/utility.js'),
debug = require('debug')('adsk:swagger-service:api'),
app = require('../../server/server.js').getapp,
errorCodes = require('../error/error.js'),
responseutility = require('../utility/response-utility.js'),
logger = require('../utility/logger.js').async;
var opportunityservice;
if(process.env.USE_PROMISE === 'true'){
 	opportunityservice=require("../service/opportunity-service-promise.js"); 	
 	logger.info('Using Promise');
 }
else{
 	opportunityservice=require("../service/opportunity-service.js");
 }


module.exports = function(SwaggerApi) {
/**
 * Endpoint lets user search for opportunity based on opportunity number example A-123451
 * @param {string} OpportunityNumber Let users get opportunity details by Opportunity Number
 * @callback {Function} callback Callback function
 * @param {Error|string} err Error object
 * @param {Error} result Result object
 */
SwaggerApi.findByOpportunityNumber = function(opportunitynumber, callback) {
  // Replace the code below with your implementation.
  // Please make sure the callback is invoked.
  process.nextTick(function() { 
      var startTime = new Date().getTime(); 		
      logger.info('Found opportunity number :' + opportunitynumber + ' in request executing getOpportunityDetails',{"Opportunity":opportunitynumber} );
  	  opportunityservice.getOpportunityDetails(opportunitynumber, callback);
      var endTime = new Date().getTime();
      logger.info('EXECUTION TIME - findByOpportunityNumber() - ' + (endTime - startTime) + ' ms.',{"Opportunity":opportunitynumber});
        
      
  	
  	/*         
            validateRequest(opportunitynumber,function(){
          	        //On Blank or Invalid format Request
          	        var err = new Error('Invalid Request please check default request format');
					err.name = 'Invalid Request';
					//err.status = 500;
					err.errorCode = errorCodes.code.BAD_REQUEST;
					err.description='Invalid Request please check default request format';					
					callback(null,responseutility.outputwrapper(false,'',err));
					//utility.logsAsync("Invalid  Request", null);
					logger.info('Invalid  Request :',op );
          	
          },function(opportunitynumber){
          	//Opportunity Request
          	//utility.logsAsync('Found opportunity number :' + opportunitynumber + 'in request executing getOpportunityDetails',null); 
          	getOpportunityDetails(opportunitynumber, callback);	
          	logger.info("Opportunity format valid",opportunitynumber);
          	logger.info('Found opportunity number :' + opportunitynumber + 'in request executing getOpportunityDetails',opportunitynumber );								
			
          },function(agreementnumber){
          	/* Un Comment this portion to enable agreement response
          	//Agreement Request
          	if(!agreementnumber){
          		    var err = new Error('Invalid Agreement Request please check default request format');
					err.name = 'Invalid Agreement Request';
					//err.status = 500;
					err.errorCode = errorCodes.code.BAD_REQUEST;
					err.description='Invalid Request please check default request format';
					callback(null,responseutility.outputwrapper(false,'',err));
					//utility.logsAsync("Invalid Agreement Request", null);
					logger.info('Invalid Agreement Request :',requestData );
          	}else{
          	//utility.logsAsync('Found agremeent number :' + agreementnumber + ' in request executing getOpportunityDetailsByAgreement',null);
          		  logger.info('Found agremeent number :' + agreementnumber + ' in request executing getOpportunityDetailsByAgreement',requestData );
			      getOpportunityDetailsByAgreement(agreementnumber, callback);
			      
			}
          });*/            

     });
  
};

/**
 * Returns List of opportunity based on agreement
 * @param {string} AgreementNumber Returns list of opportunity details based on agreement number given
 * @callback {Function} callback Callback function
 * @param {Error|string} err Error object
 * @param {Error} result Result object
 */
/*
SwaggerApi.findByAgreementNumber = function(requestData, callback) {
  // Replace the code below with your implementation.
  // Please make sure the callback is invoked.
  process.nextTick(function() {
    //var err = new Error('Not implemented');
    //callback(err); 
    validateRequest(requestData,function(){
          	//On Blank or Invalid format Request
          	        var err = new Error('Invalid Request please check default request format');
					err.name = 'Invalid Request';
					//err.status = 500;
					err.errorCode = errorCodes.code.BAD_REQUEST;
					err.description='Invalid Request please check default request format';
					callback(null,responseutility.outputwrapper(false,'',err));
					utility.logsAsync("Invalid  Request", null);
          	
          },function(opportunitynumber){
          	var err = new Error('Invalid Request please check default request format');
					err.name = 'Invalid Request';
					//err.status = 500;
					err.errorCode = errorCodes.code.BAD_REQUEST;
					err.description='Invalid Request please check default request format';
					callback(null,responseutility.outputwrapper(false,'',err));
					//utility.logsAsync("Invalid  Request", null);
					logger.info('Invalid request',opportunitynumber);
          },function(agreementnumber){
          	
          	
          	//Agreement Request
          	if(!agreementnumber){
          		    var err = new Error('Invalid Agreement Request please check default request format');
					err.name = 'Invalid Agreement Request';
					//err.status = 500;
					err.errorCode = errorCodes.code.BAD_REQUEST;
					err.description='Invalid Request please check default request format';
					callback(null,responseutility.outputwrapper(false,'',err));
					utility.logsAsync("Invalid Agreement Request", null);
          	}else{
          	//utility.logsAsync('Found agremeent number :' + agreementnumber + ' in request executing getOpportunityDetailsByAgreement',null);
          	logger.info('Found agremeent number :' + agreementnumber + ' in request executing getOpportunityDetailsByAgreement',requestData );
			getOpportunityDetailsByAgreement(agreementnumber, callback);
			}
			
          });
    
  });
  
};
*/
SwaggerApi.remoteMethod('findByOpportunityNumber',
  { isStatic: true,
  accepts: 
   [ { arg: 'opportunitynumber',
       type: 'any',
       description: 'Let users get opportunity details by Opportunity Number A-4732983',
       required: true,
       http: { source: 'path' } } ],
  returns: 
   [ { description: 'Returns Opportunity Details.',
       type: 'any',
       arg: 'data',
       root: true },
     { description: 'error response',
       type: 'Error',
       arg: 'data',
       root: true } ],
  http: {verb:"get", path: '/v1/opportunity/:opportunitynumber' },
  description: 'Endpoint lets user search for opportunity based on opportunity number for example A-123451' }
);

/*Un Comment this to enable agreement rest api
SwaggerApi.remoteMethod('findByAgreementNumber',
  { isStatic: true,
  accepts: 
   [ { arg: 'requestData',
       type: 'data',
       description: 'Returns list of opportunity details based on agreement number given,110000810265\n{"agreement":"110000330137"}',
       required: true,
       http: { source: 'body' } } ],
  returns: 
   [ { description: 'An List of Opportunities based on agreement.',
       type: 'any',
       arg: 'data',
       root: true },
     { description: 'error response',
       type: 'Error',
       arg: 'data',
       root: true } ],
  http: { verb: 'post', path: '/v1/agreement' },
  description: 'Endpoint lets user search for opportunity based on agreement number example 110000330137' }
);*/

};
