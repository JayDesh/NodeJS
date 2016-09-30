var app = require('../../server/server.js').getapp,
    fs = require('fs'),
    path = require('path'),
    errorCodes = require('../error/error.js'),
    logger = require('../utility/logger.js').async,

//Pre-fetch SQL queries from the .sql file.

  readOpportunitySQL=function(){
  	 var opportunityFilterdQuery = fs.readFileSync(path.resolve(appRoot, './sql/opportunity_query.sql'), 'utf-8');
    return opportunityFilterdQuery;
  	
  },  
  readOppotunityLineItemSQL=function(){
  	 var opportunityLineItemFilterdQuery = fs.readFileSync(path.resolve(appRoot, './sql/opportunity_oli_query.sql'), 'utf-8');
    return opportunityLineItemFilterdQuery;
  	
  },
  /*  
  readAgreementSQL=function(){
  	 var agreementFilterdQuery = fs.readFileSync(path.resolve(appRoot, './sql/agreement_query.sql'), 'utf-8');
    return agreementFilterdQuery;
  	
  },  
  readAgreementLineItemSQL=function(){
  	 var agreementFLineItemFilterdQuery = fs.readFileSync(path.resolve(appRoot, './sql/agreement_oli_query.sql'), 'utf-8');
    return agreementFLineItemFilterdQuery;
  	
  },*/
  readOpportunityDTSProductSQL=function(){
     var DTSQUery = fs.readFileSync(path.resolve(appRoot, './sql/opportunity_dts_product_query.sql'), 'utf-8');
    return DTSQUery;
    
  },
 readOpportunityMTSProductSQL=function(){
     var MTSQUery = fs.readFileSync(path.resolve(appRoot, './sql/opportunity_mts_product_query.sql'), 'utf-8');
    return MTSQUery;
    
  }, 
  /* 
  readAgreementDTSProductSQL=function(){
     var DTSQUery = fs.readFileSync(path.resolve(appRoot, './sql/agreement_dts_product_query.sql'), 'utf-8');
    return DTSQUery;
    
  },
 readAgreementMTSProductSQL=function(){
     var MTSQUery = fs.readFileSync(path.resolve(appRoot, './sql/agreement_mts_product_query.sql'), 'utf-8');
    return MTSQUery;
    
  }, */
  //New mts dts logic
  readOpportunityDTSProductSQLNew=function(){
     var DTSQUery = fs.readFileSync(path.resolve(appRoot, './sql/opportunity_dts_product_query_new.sql'), 'utf-8');
    return DTSQUery;
    
  },
 readOpportunityMTSProductSQLNew=function(){
     var MTSQUery = fs.readFileSync(path.resolve(appRoot, './sql/opportunity_mts_product_query_new.sql'), 'utf-8');
    return MTSQUery;
    
  },
  readOpportunityPartNumberNew=function(){
     var QUery = fs.readFileSync(path.resolve(appRoot, './sql/opportunity_product_by_part_number.sql'), 'utf-8');
    return QUery;
    
  }, 
 
  opportunitySQL=readOpportunitySQL(),opportunityLineItemSQL=readOppotunityLineItemSQL(),
  //agreementSQL=readAgreementSQL(),
  //agreementLineItemSQL=readAgreementLineItemSQL(),
  dtsOpportunityProductsql=readOpportunityDTSProductSQL(),
  mtsOpportunityProductsql=readOpportunityMTSProductSQL(),
  //dtsAgreementProductsql=readAgreementDTSProductSQL(),
  //mtsAgreementProductsql=readAgreementMTSProductSQL(),
  dtsOpportunityProductsqlNew=readOpportunityDTSProductSQLNew(),
  mtsOpportunityProductsqlNew=readOpportunityMTSProductSQLNew(),
  opportunityProductPartNumbersqlNew=readOpportunityPartNumberNew(),

  handleError = function (err, callback, done) {
    if (typeof(done) === 'function')
      done();
    return callback(err);
  },
  /**
   * The method makes the actual database call to execute the passed in query.
   * @param sql
   * @param inputArray
   * @param callback
   */
  queryExecutor = function(sql, inputArray, callback){
    //var startTime = new Date().getTime();
    var params = [], pgcluster = app.get('pgcluster');

    /*Uncomment if to use multiple params
    for(var i=1; i<=inputArray.length; i++){
      params.push('$'+i);
    }
    sql = sql + '(' + params.join(',') + ')';*/	
    pgcluster.connect(function (err, client, done) {
      if (err){ return handleError(err, callback, done);} 
      client.query(sql,[inputArray],callback.bind({doneFunc : done}));
      //var endTime = new Date().getTime();
      //logger.info('EXECUTION TIME - '+log_method+' - ' + (endTime - startTime) + ' ms.',{"Opportunity":inputArray});      
      
    });
    
  },
//The method can handle query with multiple parameters
//for Mts
queryExecutorMulti = function(isDTS,isMTS,sql, inputArray, callback){ 
   // var startTime = new Date().getTime();     
    var params = [], pgcluster = app.get('pgcluster');    
    for(var i=1; i<=inputArray.length; i++){
      params.push('$'+i);
    }
    sql = sql + '(' + params.join(',') + ')';
    if(isMTS){ 
    sql = sql + ' ORDER BY p.Maintenance_Renewal_SKU_Key__c , p.sfid DESC'  ; 
    }else if(isDTS){
        sql = sql + ' ORDER BY p.Desktop_Renewal_SKU_Key__c , p.sfid DESC' ; 
    }
    pgcluster.connect(function (err, client, done) {
      if (err){ return handleError(err, callback, done);}       
      client.query(sql,inputArray,callback.bind({doneFunc : done}));
       // var endTime = new Date().getTime();
        //logger.info('EXECUTION TIME - '+log_method+' - ' + (endTime - startTime) + ' ms.',{"Opportunity":opportunityNumber});     
    });
  
  };
  //for dts
  /*
  queryExecutorMultiDTS = function(sql, inputArray, callback){      
    var params = [], pgcluster = app.get('pgcluster');    
    for(var i=1; i<=inputArray.length; i++){
      params.push('$'+i);
    }
    sql = sql + '(' + params.join(',') + ')'; 
    sql = sql + ' ORDER BY p.Desktop_Renewal_SKU_Key__c , p.sfid DESC' ;  

    pgcluster.connect(function (err, client, done) {
      if (err){ return handleError(err, callback, done);}       
      client.query(sql,inputArray,callback.bind({doneFunc : done}));     
    });
  };*/
  getOpportunityData = function(opportunityNumber, callback){
           
      var opportunityNumber=opportunityNumber;
      var innerSql = opportunitySQL, query = opportunityNumber;
      queryExecutor(innerSql, query, callback);     

  };
  getOpportunityLineItemData = function(opportunityNumber, callback){      
      var opportunityNumber=opportunityNumber;
      var innerSql = opportunityLineItemSQL, query = opportunityNumber;
      queryExecutor(innerSql, query, callback);

  };
  /*
  getAgreementData = function(agreementNumber, callback){      
      var agreementnumber=agreementNumber;
      var innerSql = agreementSQL, query = agreementnumber;
      queryExecutor(innerSql, query, callback);

  };
  getAgreementLineItemData = function(agreementNumber, callback){      
      var agreementnumber=agreementNumber;
      var innerSql = agreementLineItemSQL, query = agreementnumber;
      queryExecutor(innerSql, query, callback);

  };
  getOpportunityProductDTSPD = function(data, callback){      
      var oppotunitynumber=data;
      var innerSql = dtsOpportunityProductsql, query = oppotunitynumber;
      queryExecutor(innerSql, query, callback);

  }; 
   getOpportunityProductMTSPD = function(data, callback){      
      var oppotunitynumber=data;
      var innerSql = mtsOpportunityProductsql, query = oppotunitynumber;
      queryExecutor(innerSql, query, callback);

  }; */
  /*  
  getAgreementProductDTSPD = function(data, callback){      
      var oppotunitynumber=data;
      var innerSql = dtsAgreementProductsql, query = oppotunitynumber;
      queryExecutor(innerSql, query, callback);

  }; 
   getAgreementProductMTSPD = function(data, callback){
      var oppotunitynumber=data;
      var innerSql = mtsAgreementProductsql, query = oppotunitynumber;
      queryExecutor(innerSql, query, callback);

  };*/
  //New logic for mts and dts product 
  getOpportunityProductDTSPDNew = function(data, callback){
      var keys=[];    
      keys=data;
      var innerSql = dtsOpportunityProductsqlNew, query = keys;
      queryExecutorMulti(true,false,innerSql, query, callback);

  }; 
   getOpportunityProductMTSPDNew = function(data, callback){  
      var keys=[];
      keys=data;
      var innerSql = mtsOpportunityProductsqlNew, query = keys;
      queryExecutorMulti(false,true,innerSql, query, callback);

  };
  getOpportunityProductByPart = function(data, callback){  
      var keys=[];    
      keys=data;
      var innerSql = opportunityProductPartNumbersqlNew, query = keys;
      queryExecutorMulti(false,false,innerSql, query, callback);

  };
  
  

module.exports = {
    getOpportunityData:getOpportunityData,
    getOpportunityLineItemData:getOpportunityLineItemData,
    //getAgreementData:getAgreementData,
    //getAgreementLineItemData:getAgreementLineItemData,
    //getOpportunityProductDTSPD:getOpportunityProductDTSPD,
    //getOpportunityProductMTSPD:getOpportunityProductMTSPD,
    //getAgreementProductDTSPD:getAgreementProductDTSPD,
    //getAgreementProductMTSPD:getAgreementProductMTSPD,
    getOpportunityProductMTSPDNew:getOpportunityProductMTSPDNew,
    getOpportunityProductDTSPDNew:getOpportunityProductDTSPDNew,
    getOpportunityProductByPart:getOpportunityProductByPart
    
};
