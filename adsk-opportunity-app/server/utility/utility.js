/**
 * This js file has utility functions that are used to get data and date in ISO format. These are used
 * across the application.
 */
var moment=require('moment');
var getDataValue = function (data) {
  data = data || null;
    return data;
  },
  

getISODate = function (date) {
  if (date) {
     var dateVar = new Date(date);
     date = dateVar.toISOString().substr(0, dateVar.toISOString().indexOf('T')).toString();     
  }
  return date;
},

addMonths=function(date,month){
	if (date) {    
      var dateVar=new Date(date);
      date=dateVar.setMonth(dateVar.getMonth()+month,0);    
  }
  return date;
},
validateOpportunityNumber=function(data){
	//var re=/^A\-\d{7}/;	//Regex pattern for opportuniy number
	var re=/^A\-\d*$/;
	var pattern=new RegExp(re);
	return(pattern.test(data));	
},
/*
validateAgreementNumber=function(data){
	var re=/(^\d*$|^\d*-\d*$)/;
	var pattern=new RegExp(re);
	return(pattern.test(data));	
},*/

logsAsync = function (err, message, logRequestResponseHeaders) {
  if((process.env.ENABLE_LOGGING || 'true')==='true'){
    setTimeout(function(){
      if(err){
        console.error('Error happened: ', err);
        console.error('Error Stack trace: ', err.stack);
      }else {
        console.log(message);
      }
    }, 0);
  }
};

module.exports = {
  getDataValue : getDataValue,
  getISODate : getISODate,
  logsAsync : logsAsync,
  addMonths:addMonths,
  validateOpportunityNumber:validateOpportunityNumber,
  //validateAgreementNumber:validateAgreementNumber
};
