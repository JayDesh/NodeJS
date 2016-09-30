"use strict";
var opportunitydao = require('../dao/opportunitydao.js'),
    app = require('../../server/server.js').getapp,
    utility = require('../utility/utility.js'),
    responseutility = require('../utility/response-utility.js'),
    fs = require('fs'),
    path = require('path'),
    error = require('../error/error.js'),
    _ = require('underscore'),
    logger = require('../utility/logger.js').async,
    Promise=require('promise');
    

/**
 * This method validates renewal status of the opportunity
 * @param {array} Result data fetched from backend  
 * @returns true on renewal_status__c is Ready for Order or Open
 * @returns false on renewal_status__c is no Ready for Order or Open
 * 
 */
var isValidateStatus=function(data){
	 if ((data.rows[0].renewal_status__c!==undefined)&&(data.rows[0].renewal_status__c === "Ready for Order" || data.rows[0].renewal_status__c === "Open"))
	     {
	      return true;
	     }
};
/**
 * This method validate if opportunity is available in backend and has valid status.
 * @param {array} Result data fetched from backend .
 * @returns true if is data is present and status is valid in backend.
 * @return false if data is not present or data is present but status is not valid 
 */
var isValidInBackendAndStatus = function(data) {
	if(data!=undefined){
		if (data.rows.length > 0 )
		{  	var opptyStatus=isValidateStatus(data);		
			if(opptyStatus==true){			
				return true;		   
			   }
		}
	}	
};
/**
 * This method validate if data is available from backend or not
 * @param {array} result data fetched from backend
 * @returns true if data is available from backend
 * @returns false is data is not available from backend
 */
var isValidInBackend = function(data) {
	if(data!=undefined){
		if (data.rows.length > 0 )
		{
			return true;
		}
	}
};
/**
 * This method process opportunity request
 * @param {string} OpportunityNumber Let users get opportunity details by Opportunity Number
 * @callback {Function} callback Callback function
 * 
 */
var getOpportunityDetails = function(OpportunityNumber, callback) {
var clikeys=[];
var stampedPd=undefined;
		var processPDNew=function(data){	
			var startTime = new Date().getTime();			
				var oppLineItemPData={};
				var dataArray = data!==null ? data.rowCount !== 0 ? data.rows:undefined : undefined ;				
				if(undefined!==dataArray){				
				for (var j = 0; j < dataArray.length; j++) {										
						var lineItemPD = {
							'id':'',
							'PartNumber':'',
							'Description':''
						};								
						lineItemPD.PartNumber=dataArray[j].renewal_sku;
						lineItemPD.Description=	dataArray[j].description;		
						var lineItemID = dataArray[j].key;//Using key retrieved from backend as unique identity
						var oppIndex = Object.keys(oppLineItemPData).indexOf(lineItemID);
						if (oppIndex === -1) {
							lineItemPD.id=1;
							oppLineItemPData[lineItemID] = [lineItemPD];
						} else {
							lineItemPD.id=oppLineItemPData[lineItemID][Object.keys(oppLineItemPData[lineItemID]).length-1]['id']+1;
							oppLineItemPData[lineItemID][Object.keys(oppLineItemPData[lineItemID]).length] = lineItemPD;
						}
						lineItemPD = {};
					
				}
				}
				dataArray = null;
				var endTime = new Date().getTime();
				logger.info('EXECUTION TIME - processPDNew() - ' + (endTime - startTime) + ' ms.',{"Opportunity":OpportunityNumber});
				//console.log("lineItemData >>>> "+JSON.stringify(oppLineItemPData));						
				return oppLineItemPData;
			
		};
		var getProductDescripton=function(partnumbers,callback){
			opportunitydao.getOpportunityProductByPart(partnumbers,callback);
		};
		var buildMTSKeyAndReturnType1=function(data){
			var key=(data.productcode)
		             +(data.usage_type__c)
		             +(data.program_type__c)            
		             +(data.support_level__c=== 'Enterprise Priority' ? 'PLAT E' 
		             	: data.support_level__c === 'Advanced Support' ? 'GOLDA' 
		             	: data.support_level__c === 'Basic Support' ? 'SILVER'
		             	: data.support_level__c === null ? '' : data.subscription_level__c )
		             +(data.end_user_type__c === null ? '' : data.end_user_type__c) 
		             +(data.nfr_use__c);		             
		             return key;
		};
		var buildMTSKeyAndReturnType2=function(data){
			var key=(data.productcode)
		             +(data.usage_type__c)
		             +(data.program_type__c)            
		             +(data.support_level__c=== 'Enterprise Priority' ? 'PLAT E' 
		             	: data.support_level__c === 'Advanced Support' ? 'GOLDA' 
		             	: data.support_level__c === 'Basic Support' ? 'SILVER'
		             	: data.support_level__c === null ? '' : data.subscription_level__c )
		             +(data.end_user_type__c === null ? 'NONE' : data.end_user_type__c === 'NONE' ? '':data.end_user_type__c) 
		             +(data.nfr_use__c);
		             //console.log("Key Type 2 >>" + key);
		             return key;
		};
		
		var generateMTSRenewalKey=function(olidata,callback){
			var dataArray = olidata.rows;
			var result=null;
			var keys=[];
			var partnumbers=[];
					for (var j = 0; j < dataArray.length; j++) {		                         
		             var key1=buildMTSKeyAndReturnType1(dataArray[j]);  
		             var key2=buildMTSKeyAndReturnType2(dataArray[j]);           
		             keys.push(key1);
		             clikeys.push({'cliid':dataArray[j].cliid,'key':key1});		             
		             //keys.push(key1+'05');
		             //clikeys.push({'cliid':dataArray[j].cliid+'05','key':key1+'05'});
		             keys.push(key2);
		             clikeys.push({'cliid':dataArray[j].cliid,'key':key2});
		             //keys.push(key2+'05');
		             //clikeys.push({'cliid':dataArray[j].cliid+'05','key':key2+'05'});
		             //console.log("dataArray[j].part_number__c >>>> "+dataArray[j].part_number__c);
		                 if(dataArray[j].part_number__c!=null && dataArray[j].part_number__c.length > 0){
		                 	logger.info("Part Number Stamped in line item generateMTSRenewalKey()",{"Opportunity":OpportunityNumber});
			             	partnumbers.push(dataArray[j].part_number__c);
			             }
		             }		    
			    if(partnumbers.length>0)
			    {
			     	getProductDescripton(partnumbers,function(err,data){			     		
			     		if(!err){
			     		this.doneFunc();
			    		stampedPd= data!=null ? processPDNew(data):undefined;			    		
			    		}else{			    			
			    			logger.info("got server err getProductDescripton()",{"Opportunity":OpportunityNumber});
			    		}
			    		/*for (var j = 0; j < dataArray.length; j++) {
			    			 keys.push(dataArray[j].key);
			    		}*/
			    		opportunitydao.getOpportunityProductMTSPDNew(keys,callback);
			    	});
			    } else{        	    
			    opportunitydao.getOpportunityProductMTSPDNew(keys,callback);
				};
		};
		var buildDTSKeyAndReturnType1=function(data){
			var key=(data.billing_behavior__c)
		             +(data.contract_term__c)
		             +(data.productcode)
		             +(data.end_user_type__c === null ? '':data.end_user_type__c)
		             +(data.license_model)
		             +(data.nfr_use__c)
		             +(data.deployment)             
		             +(data.program_type__c)            
		             +(data.support_level__c=== 'Enterprise Priority' ? 'PLAT E' 
		             	: data.support_level__c === 'Advanced Support' ? 'GOLDA' 
		             	: data.support_level__c === 'Basic Support' ? 'SILVER'
		             	: data.support_level__c === null ? '' : data.licensesku_subs_level ) 
		             +(data.usage_type__c);			                          
		             return key;
		};
		var buildDTSKeyAndReturnType2=function(data){
			var key=(data.billing_behavior__c)
		             +(data.contract_term__c)
		             +(data.productcode)
		             +(data.end_user_type__c === null ? 'NONE' : data.end_user_type__c === 'NONE' ? '':data.end_user_type__c)
		             +(data.license_model)
		             +(data.nfr_use__c)
		             +(data.deployment)             
		             +(data.program_type__c)            
		             +(data.support_level__c=== 'Enterprise Priority' ? 'PLAT E' 
		             	: data.support_level__c === 'Advanced Support' ? 'GOLDA' 
		             	: data.support_level__c === 'Basic Support' ? 'SILVER'
		             	: data.support_level__c === null ? '' : data.licensesku_subs_level ) 
		             +(data.usage_type__c === null ? '':data.usage_type__c);
		             //console.log("Key Type 2 >>" + key);		             
		             return key;
		};
		
			
		var generateDTSRenewalKey=function(olidata,callback){
			var dataArray = olidata.rows;
			var keys=[];
			var partnumbers=[];	
					for (var j = 0; j < dataArray.length; j++) {			 
		             var key1=buildDTSKeyAndReturnType1(dataArray[j]);  
		             var key2=buildDTSKeyAndReturnType2(dataArray[j]);           
		             keys.push(key1);
		             clikeys.push({'cliid':dataArray[j].cliid,'key':key1});		             
		             //keys.push(key1+'05');
		             //clikeys.push({'cliid':dataArray[j].cliid+'05','key':key1+'05'});
		             keys.push(key2);
		             clikeys.push({'cliid':dataArray[j].cliid,'key':key2});
		             //keys.push(key2+'05');
		             //clikeys.push({'cliid':dataArray[j].cliid+'05','key':key2+'05'});
		             //console.log("dataArray[j].part_number__c >>>> "+dataArray[j].part_number__c);
		                 if(dataArray[j].part_number__c!=null && dataArray[j].part_number__c.length > 0){
		                 	logger.info("Part Number Stamped in line item generateDTSRenewalKey() "+ dataArray[j].cliid,{"Opportunity":OpportunityNumber});
			             	partnumbers.push(dataArray[j].part_number__c);
			             }
					}				
			//console.log("DTS KEYS "+ JSON.stringify(keys));
			if(partnumbers.length>0)
			    {
			    	getProductDescripton(partnumbers,function(err,data){			    					    		
			    		if(!err){
			    		this.doneFunc();
			    		stampedPd= data!=null ? processPDNew(data):undefined;			    		
			    		}else{			    			
			    			logger.info("got server err getProductDescripton()",{"Opportunity":OpportunityNumber});
			    		}
			    		//console.log("DTS stampedPd  "+ JSON.stringify(stampedPd));
			    		/*for (var j = 0; j < dataArray.length; j++) {
			    			 keys.push(dataArray[j].key);
			    		}*/
			    		opportunitydao.getOpportunityProductDTSPDNew(keys,callback);
			    	});

			    } else{        	    
			    opportunitydao.getOpportunityProductDTSPDNew(keys,callback);
				};
			
		};

	var oerr=error.OpportunityError();		
	//Here we are getting the opportunity data from backend		
	var getOpportunity=function(resolve,reject){
		var startTime = new Date().getTime();
		var getoppotunityTime=new Date().getTime();		
		opportunitydao.getOpportunityData(OpportunityNumber,function(err,data){						
			if(err){				
				reject(oerr=error.ServerErrorM());	
				logger.info("Got server error in getOpportunity() :"+error.ServerErrorM(),{"Opportunity":OpportunityNumber});
				}else{
					this.doneFunc();		
				if(isValidInBackendAndStatus(data)){				
					logger.info("Found "+data.rows.length+" Rows in getOpportunity()",{"Opportunity":OpportunityNumber});
					logger.info("Valid in backend getOpportunity()",{"Opportunity":OpportunityNumber});
					resolve(data);				
				}else{				
					reject(err);				
					logger.info("Got backend error in getOpportunity()",{"Opportunity":OpportunityNumber});
				}
			}
			var endTime = new Date().getTime();
			logger.info('EXECUTION TIME - getOpportunity() - ' + (endTime - getoppotunityTime) + ' ms.',{"Opportunity":OpportunityNumber});						
		});	
	};
	//Here we are getting the oli data from backend 			
	var getOLI=function(resolve,reject){		
		var getoliTime=new Date().getTime();
		opportunitydao.getOpportunityLineItemData(OpportunityNumber,function(err,data){						
			if(err)	{							
				reject(oerr=error.ServerErrorM());
				logger.info("Got server error in getOLI() :"+error.ServerErrorM(),{"Opportunity":OpportunityNumber});
			}else{
				this.doneFunc();
			if(isValidInBackend(data)){
				logger.info("Found "+data.rows.length+" Rows in getOLI()",{"Opportunity":OpportunityNumber});	
				logger.info("Valid in backend getOLI()",{"Opportunity":OpportunityNumber});			
				resolve(data);								
			 }else{			 	
			 	//reject("Line item Data Missing for the Opportunity");
			 	resolve(data);
			 	logger.info("Got backend error in getOLI()",{"Opportunity":OpportunityNumber});
			 }
			}
			var endTime = new Date().getTime();
			logger.info('EXECUTION TIME - getOLI() - ' + (endTime - getoliTime) + ' ms.',{"Opportunity":OpportunityNumber});
		});
		
	};	
	//Here we are building response with data pulled from backend		
	var buildResponse=function(pddata,olidata,oppdata){	
		var startTime = new Date().getTime();
		var buildresponseTime=new Date().getTime();	
		     var PD = undefined;		     
		    if(undefined!==pddata)
			    {
			    PD=pddata.rowCount !==0 ? processPDNew(pddata):undefined;	
			    }
			var oppLineItemData={};

			var dataArray = olidata.rows!== null ? olidata.rows : undefined  ;
			if(undefined!==dataArray){//oli starts
			for (var j = 0; j < dataArray.length; j++) {				
				if(dataArray[j].renew_flag__c!==null&&dataArray[j].renew_flag__c===true){//If Request Renewal Flag of line items is true
				var oli = null;
				oli = responseutility.populateAndReturnOpportunityLineItem(responseutility.listOfLineItemFields, dataArray[j]);				
				var _validKeys=_.where(clikeys,{'cliid':dataArray[j].cliid});				
				var partNumberInOLI=dataArray[j].part_number__c != null ? dataArray[j].part_number__c.length == 0 ? null:'':null;
				//console.log("partNumberInOLI >>> "+partNumberInOLI);				
				if(partNumberInOLI===null)
				{					
					_.each(_validKeys,function(k){						
							if(undefined!==PD){					
							var foundvalue=_.findWhere(PD[k.key],{'id':1});//Only first data with id 1 will be used for PartNumber and ProductDescriptiton
								if(undefined != foundvalue){
									oli.PartNumber=foundvalue.PartNumber;				
									oli.ProductDescription=foundvalue.Description;
									//console.log("back end oli.ProductDescription >>>> "+oli.ProductDescription+"  cliid "+ dataArray[j].cliid);										
								}	
							}				
					});					
					
				}else{						
						oli.PartNumber=dataArray[j].part_number__c;							
						if(undefined!==stampedPd){						
								_.each(stampedPd,function(k){
									var foundvalue=_.findWhere(k,{'id':1,'PartNumber':dataArray[j].part_number__c});
									if(undefined != foundvalue){
										oli.ProductDescription=foundvalue.Description;
										//console.log("back end oli.ProductDescription >>>> "+oli.ProductDescription+"  cliid "+ dataArray[j].cliid);										
									}
								});
							}
				      }	
						      
				if(oli.ProductDescription===null){
					//console.log("null oli.ProductDescription >>>> "+oli.ProductDescription+"  cliid "+dataArray[j].cliid);
					if(dataArray[j].productname!==null || dataArray[j].productname!== '')
						{
								oli.ProductDescription = dataArray[j].productname;
								
						}else if(dataArray[j].productdescription!==null || dataArray[j].productdescription!== ''){	
																	
						        oli.ProductDescription = dataArray[j].productdescription;
						}
					  }			
					var oppId = null;
					oppId = dataArray[j].opportunityid;
					var oppIndex = Object.keys(oppLineItemData).lastIndexOf(oppId);
					if (oppIndex === -1) {
						oppLineItemData[oppId] = [oli];
					} else {
						oppLineItemData[oppId][Object.keys(oppLineItemData[oppId]).length] = oli;
					}
			    }
				oppId = null;
			}
			}//oli ends
			dataArray = null;			
			//Opportunity portion			
				var opportunities = [];				
				var opdataArray = oppdata.rows!== null ? oppdata.rows : undefined;
			    if(undefined!==opdataArray){//opportunity starts
					for (var j = 0; j < opdataArray.length; j++) {
						var opportunity = null;
						opportunity = responseutility.populateAndReturnOpportunity(opdataArray[j]);
						var oli = null;
						oli = responseutility.populateAndReturnOpportunityLineItem();					
						opportunity.ListOfLineItem = oppLineItemData[opdataArray[j].sfid] === undefined ? ['']: _.sortBy(oppLineItemData[opdataArray[j].sfid],'ItemNumber');
						opportunities.push(opportunity);
					}
				
				opdataArray = null;
				var endTime = new Date().getTime();
				logger.info('EXECUTION TIME - buildResponse() - ' + (endTime - buildresponseTime) + ' ms.',{"Opportunity":OpportunityNumber});				
		        callback(null, responseutility.outputwrapper(true,opportunities,''));
		       }else{
		       	callback(null, responseutility.outputwrapper(false,'',error.ServerErrorM()));
		       }

	};	
	new Promise(getOpportunity).then(function(odata) {											
				if (odata.rows[0].contract_term != null) {
					logger.info('Found DTS Contract',{"Opportunity":OpportunityNumber});										
					new Promise(getOLI).then(function(data) {									        
				        var oppdata=odata;
				        var olidata=data;				        
				        var generateDTSRenewalKeyTime=new Date().getTime();
				        generateDTSRenewalKey(olidata,function(err,data){
				        	this.doneFunc();
				        	var endTime = new Date().getTime();
							logger.info('EXECUTION TIME - generateDTSRenewalKey() - ' + (endTime - generateDTSRenewalKeyTime) + ' ms.',{"Opportunity":OpportunityNumber});				 
     						buildResponse(data, olidata, oppdata);
				        });
					}, function(olierr) {
						callback(null, responseutility.outputwrapper(false, '', olierr));
					});
				} else {
					logger.info('Found MTS Contract',{"Opportunity":OpportunityNumber});					
					new Promise(getOLI).then(function(data) {
						var endTime = new Date().getTime();			        
				        var oppdata=odata;
				        var olidata=data;				        
				        var generateMTSRenewalKeyTime=new Date().getTime();
				        generateMTSRenewalKey(olidata,function(err,data){
				        	this.doneFunc();
				        	var endTime = new Date().getTime();
							logger.info('EXECUTION TIME - generateMTSRenewalKey() - ' + (endTime - generateMTSRenewalKeyTime) + ' ms.',{"Opportunity":OpportunityNumber});				        	
     						buildResponse(data, olidata, oppdata);    						
				        });				        
					}, function(olierr) {						
						callback(null, responseutility.outputwrapper(false, '', olierr));
					});
				}		
		
	}, function(err) {		
		callback(null, responseutility.outputwrapper(false, '', oerr));
	});

	
};

/*
 * 
 *uncomment this portion to use agreement call
getOpportunityDetailsByAgreement = function(AgreementNumber, callback) {
	var aerr = new Error('Agreement does not exists');
	aerr.name = 'Invalid Agreement';
	aerr.status = 500;
	aerr.errorCode = errorCodes.code.INVALID_AGREEMENT;	
	opportunitydao.getAgreementLineItemData(AgreementNumber, function(err, data) {
		isValidInBackend(aerr,data,this.doneFunc,function(err){
			if(err){
				callback(null,responseutility.outputwrapper(false,'',aerr));
				utility.logsAsync("Agreement invalid in backend", null);				
				}else{
				 if(data.rows[0].contract_term__c!=null){
				 	//DTS
				 	console.log("Found dts contract");
				 	opportunitydao.getAgreementProductDTSPD(AgreementNumber,function(perr,pdata){						
						if(perr){
							callback(null,responseutility.outputwrapper(false,'',perr));
						}else{						
							processOpportunityLineItem(err,data,processPD(perr,pdata),function(lineitemdata){
								opportunitydao.getAgreementData(AgreementNumber, function(err, data) {
									 isValidInBackend(aerr,data,this.doneFunc,function(err){
									 	if(err){
										callback(null,responseutility.outputwrapper(false,'',aerr));
										utility.logsAsync("Agreement invalid in backend", null);				
										}else{					 	
									 	validateResponse(processOpportunity(err,data,lineitemdata), callback, "Agreement");
									 	}					 	
									 });					 
									});
							 });
							}
						
						});
						
						
					}else{
						//MTS
						console.log("Found mts contract");
						opportunitydao.getAgreementProductMTSPD(AgreementNumber,function(merr,mdata){												
						if(merr){
							callback(null,responseutility.outputwrapper(false,'',merr));							
						}else{						
							processOpportunityLineItem(err,data,processPD(merr,mdata),function(lineitemdata){								
								opportunitydao.getAgreementData(AgreementNumber, function(err, data) {
									 isValidInBackend(aerr,data,this.doneFunc,function(err){
									 	if(err){
										callback(null,responseutility.outputwrapper(false,'',aerr));
										utility.logsAsync("Agreement invalid in backend", null);				
										}else{					 	
									 	validateResponse(processOpportunity(err,data,lineitemdata), callback, "Agreement");
									 	}					 	
									 });					 
									});
							 });
							}
						
						});
						
					}
			      }
		  });
       });
};*/

module.exports = {
	getOpportunityDetails : getOpportunityDetails,
	//getOpportunityDetailsByAgreement : getOpportunityDetailsByAgreement ----Un comment to enable search by agreement functionality 
}; 