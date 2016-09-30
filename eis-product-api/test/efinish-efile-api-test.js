var myServerapp = require('../server/server.js').getapp,
  efinishdao = require('../server/dao/efinishdao.js'),
  expect = require('chai').expect,
  assert = require('chai').assert,
  sinon = require('sinon'),
  mysupertest = require('supertest');

//Integration test

describe('Test Product/SKU APIs', function(){
  describe('Tests Efinish/Efile API call', function () {

    beforeEach(function() {
      sinon.spy(efinishdao, 'getFilteredEfinishEfileData');
    });

      afterEach(function() {
        efinishdao.getFilteredEfinishEfileData.restore();
      });

    it('output for civ3d-2014', function (done) {
      mysupertest(myServerapp).get('/api/service/products/v1/efinishes?plcvs=civ3d-2014&includeExpired=false')
        .set('Authorization', 'Bearer gPh9rrP4i1yuC0Yx3clgW8FHr8mpGKCsWe07WE44ffUkvZdVIbokHN6HWXd7QpAo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {

          if (err)
            return done(err);

          expect(res.body.length).to.equals(1);
          expect(res.body[0].efinishId).to.equals('237F1-EFG000-0101E');
          expect(res.body[0].efiles[0].checksum).to.equals('EA780EA5F3E30F4EC9E63FB1891D8A9E');
          assert(efinishdao.getFilteredEfinishEfileData.called);
          done();
        });

    });

    it('output for A-SURV-2007', function (done) {
      mysupertest(myServerapp).get('/api/service/products/v1/efinishes?plcvs=A-SURV-2007&includeExpired=false')
        .set('Authorization', 'Bearer gPh9rrP4i1yuC0Yx3clgW8FHr8mpGKCsWe07WE44ffUkvZdVIbokHN6HWXd7QpAo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {

          if (err)
            return done(err);

          expect(res.body.length).to.equals(0);
          assert(efinishdao.getFilteredEfinishEfileData.called);
          done();
        });

    });

  });

  describe('Tests SKU-API', function () {

    beforeEach(function() {
      sinon.spy(efinishdao, 'getSKUData');
    });

    afterEach(function() {
      efinishdao.getSKUData.restore();
    });

    it('output for 549B1-120763-10A1', function (done) {
      mysupertest(myServerapp).get('/api/service/products/v1/skus?skus=549B1-120763-10A1')
        .set('Authorization', 'Bearer gPh9rrP4i1yuC0Yx3clgW8FHr8mpGKCsWe07WE44ffUkvZdVIbokHN6HWXd7QpAo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {

          if (err)
            return done(err);

          expect(res.body.length).to.equals(1);
          expect(res.body[0].productKey).to.equals('549B1');
          assert(efinishdao.getSKUData.called);
          done();
        });
    });
  });

});
