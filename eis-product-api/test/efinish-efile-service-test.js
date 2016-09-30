var sinon = require('sinon'),
    efinishefileservice = require('../server/service/efinishEfileService.js'),
    efinishdao = require('../server/dao/efinishdao.js'),
    testData = require('../test-resources/test-data.js'),
    expect = require('chai').expect,
    assert = require('chai').assert;

//unit test

describe('Test efinishEfileService', function() {

  beforeEach(function() {

    var testFunc = function() {};

    sinon.stub(efinishdao, 'getFilteredEfinishEfileData', function(req, callback) {
      return callback.apply({doneFunc : testFunc}, [null, testData.efinishDatabaseResponse]);
    });

  });

  afterEach(function() {
    efinishdao.getFilteredEfinishEfileData.restore();
  });

  it('Test invocation of passed callback and business logic!', function(){

    var returnedEfinishVar,
        callbackfunc = function(testVar, efinishVar){
            console.log('This function was called and the value of efinishVar is: ' + JSON.stringify(efinishVar));
            returnedEfinishVar = efinishVar;
        };

    efinishefileservice.getEfinishEfileAssociation('civ3d-2014', false, '', callbackfunc);

    expect(returnedEfinishVar.length).to.equals(1);
    expect(returnedEfinishVar[0].efinishId).to.equals('237F1-EFG000-0101E');
    expect(returnedEfinishVar[0].efiles[0].$checksum).to.equals('EA780EA5F3E30F4EC9E63FB1891D8A9E');
    assert(efinishdao.getFilteredEfinishEfileData.called);

  });

});
