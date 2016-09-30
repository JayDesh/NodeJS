var myServerapp = require('../server/server.js').getapp,  
  expect = require('chai').expect,
  assert = require('chai').assert,
  sinon = require('sinon'),
  mysupertest = require('supertest'),
  errorCodes = require('../server/error/error.js'),
 // pgcluster = require('../server/utility/pgcluster.js'),
  opportunityservice=require("../server/service/opportunity-service.js");
  var exec = require('exec');
var timeOut=15000;
describe("Status = true",function(){	
	it("Response should have status:true response:data",function(done){	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-4711729")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.equal(true);	
		      	done();	      		      	      	
		      });
		      
	});	
	it("Response should have status:false",function(done){	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-4711729334332342423423423")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.equal(false);	
		      	done();	      		      	      	
		      });
		      
	});		
});
describe("Opportunity Does Not Exist",function(){    	
	it("No existence of opportunity in backend A-4711",function(done){//No existence of opportunity in backend	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-471101")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.not.equal(true);
		      	expect(res.body.error.errorCode).to.equal(errorCodes.code.INVALID_OPPORTUNITY);	
		      	done();	      		      	      	
		      });		      
	});			
	it("Closed opportunity response should have status false",function(done){//Closed opportunity	
		this.timeout(15000);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-4756922")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.equal(false);
		      	expect(res.body.response).to.equal(null);	
		      	done();	      		      	      	
		      });		      
	});
	it("Expired opportunity response should have status false",function(done){//Expired opportunity	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-4756827")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.not.equal(true);
		      	expect(res.body.error.errorCode).to.equal(errorCodes.code.INVALID_OPPORTUNITY);	
		      	done();	      		      	      	
		      });		      
	});
});

describe("Opportunity Request Format test",function(){	
	it("A-4711%^!><><>Lp",function(done){	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-4711%^!><><>Lp")		      
		      .expect(400) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.error.status).to.equal(400);
		      	expect(res.body.error.statusCode).to.equal(400);	
		      	done();	      		      	      	
		      });		      
	});		
	it("A-A-471",function(done){	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-A-471")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.equal(false);
		      	expect(res.body.error.errorCode).to.equal(errorCodes.code.BAD_REQUEST);	
		      	done();	      		      	      	
		      });		      
	});	
	it("/---/",function(done){	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/---/")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.equal(false);
		      	expect(res.body.error.errorCode).to.equal(errorCodes.code.BAD_REQUEST);	
		      	done();	      		      	      	
		      });		      
	});
	
	
});
describe("Environment variables available",function(){
	 //var env="set APP_NAME=adsk-opportunity-app-dev && 
     //set ENABLE_OAUTH=false&& 
     //set ENABLE_LOGGING=false&& 
     //set logRequestResponseHeaders=true&& 
     //set logRequestResponseHeaders=true&& 
     //set CLUSTER_DB=postgres://ueojmbuf28ltev:p5m9urnou0e422f72v2vdd1b2l@ec2-184-73-157-234.compute-1.amazonaws.com:5432/ddvkufoj6r258t?ssl=true&& 
     //set NODE_ENV=local&&
     //set LOG_LEVEL=&&
     //set DEBUG=adsk:boot:init-datasources,adsk:product:pgcluster";
     //process.env=env;
    it("APP_NAME",function(done){
    	expect(process.env.APP_NAME).to.exist;
    	done();    	
    });
    it("ENABLE_OAUTH",function(done){
    	expect(process.env.ENABLE_OAUTH).to.exist;
    	done(); 
    });
    it("ENABLE_LOGGING",function(done){
    	expect(process.env.ENABLE_LOGGING).to.exist;
    	done(); 
    });
    it("logRequestResponseHeaders",function(done){
    	expect(process.env.logRequestResponseHeaders).to.exist;
    	done(); 
    });
    it("logRequestResponseHeaders",function(done){
    	expect(process.env.logRequestResponseHeaders).to.exist;
    	done(); 
    });
    it("CLUSTER_DB",function(done){
    	expect(process.env.CLUSTER_DB).to.exist;
    	done(); 
    });
    it("NODE_ENV",function(done){
    	expect(process.env.NODE_ENV).to.exist;
    	done(); 
    });
    it("LOG_LEVEL",function(done){
    	expect(process.env.LOG_LEVEL).to.exist;
    	done(); 
    });   
    it("DEBUG",function(done){
    	expect(process.env.DEBUG).to.exist;
    	done(); 
    });   
	
});
describe("Cluster DB Config variables available but no valid connection",function(){	  
     var pgcluster=null;
     beforeEach(function() {      
      myServerapp;
      pgcluster=myServerapp.get('pgcluster');      
    });   	  
    it("CLUSTER_DB available",function(done){
    	expect(process.env.CLUSTER_DB).to.exist;    	
    	done();
     });
    it("Connection not available",function(done){    	
    	pgcluster.connect(function (err, client, done) {
	      expect(err).to.exist;	      
	    });
    	done(); 
    });	
});
describe("Cluster DB Config variables available with valid connection string but network disconnected",function(){	 
     var pgcluster=null;
     beforeEach(function() {      
      myServerapp;
      pgcluster=myServerapp.get('pgcluster');      
    });    
    it("CLUSTER_DB available",function(done){
    	expect(process.env.CLUSTER_DB).to.exist;
    	//expect(pgcluster.connect(function(){})).to.throw("No valid connections exist in the cluster.");
    	done(); 
    });
    it("Connection not available",function(done){    	
    	pgcluster.connect(function (err, client, done) {
	      expect(err).to.exist;	      
	    });
    	done(); 
    });	
});
describe("Cluster DB Config variables available with valid connection string but network disconnected and executing oppotuniy request",function(){ 
    it("CLUSTER_DB available",function(done){
    	expect(process.env.CLUSTER_DB).to.exist;    	
    	done(); 
    });    
    it("No backend connection and executing opportunity request A-4756922",function(done){	
		this.timeout(timeOut);	    
		    mysupertest(myServerapp)
		      .get("/api/service/v1/opportunity/A-4756922")		      
		      .expect(200) //Status code
		      .end(function(err, res){
		      	if(err)
		      		done(err);		      	
		      	expect(res.body.status).to.equal(false);
		      	expect(res.body.error.errorCode).to.equal(errorCodes.code.SERVER_ERROR);	
		      	done();	      		      	      	
		      });		      
	});	
});



