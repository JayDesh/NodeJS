var app = require('../../server/server.js').getapp,
    fs = require('fs'),
    path = require('path'),

//Pre-fetch SQL queries from the .sql file.

  readfilteredSQL = function () {
    var efinshEfileFilteredQuery = fs.readFileSync(path.resolve(appRoot, './sql/efinish-efile-filtered.sql'), 'utf-8');
    return efinshEfileFilteredQuery;
  },

  readAllSQL = function () {
    var efinshEfileAllQuery = fs.readFileSync(path.resolve(appRoot, './sql/efinish-efile-all.sql'), 'utf-8');
    return efinshEfileAllQuery;
  },

  readSKUSQL = function () {
      var skuQuery = fs.readFileSync(path.resolve(appRoot, './sql/sku.sql'), 'utf-8');
      return skuQuery;
  },

  sqlFiltered = readfilteredSQL(), sqlAll = readAllSQL(), skuSql = readSKUSQL(),

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

    var params = [], pgcluster = app.get('pgcluster');

    for(var i=1; i<=inputArray.length; i++){
      params.push('$'+i);
    }

    sql = sql + '(' + params.join(',') + ')';

    pgcluster.connect(function (err, client, done) {
      if (err) return handleError(err, callback, done);

      client.query(sql, inputArray, callback.bind({doneFunc : done}));
    });
  },

  getAllEfinishEfileData = function(plcvs, callback){

      var innerSql = sqlAll, queryArray = plcvs.split(',');
      queryExecutor(innerSql, queryArray, callback);

  },

  getFilteredEfinishEfileData = function(plcvs, callback){

  var innerSql = sqlFiltered, queryArray = plcvs.split(',');
  queryExecutor(innerSql, queryArray, callback);

  },

  getSKUData = function(skuArray, callback){

    var innerSkuSql = skuSql, params = [];
    queryExecutor(innerSkuSql, skuArray, callback);

  };

module.exports = {
  getAllEfinishEfileData : getAllEfinishEfileData,
  getFilteredEfinishEfileData : getFilteredEfinishEfileData,
  getSKUData : getSKUData
};
