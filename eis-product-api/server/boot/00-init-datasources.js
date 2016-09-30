var _ = require('underscore');
var debug = require('debug')('adsk:boot:init-datasources');
var logger = require('../utility/utility.js');
var PgCluster = require('../utility/pgcluster.js');

module.exports = function (app) {

  var connections = [], urls = process.env.CLUSTER_DB.split(' ');

  for(var i=0; i<urls.length; i++){
    connections.push(process.env[urls[i]]);
  }

  debug('Initializing DB cluster using: ', connections);

  var pgcluster = new PgCluster(connections);
  app.set('pgcluster', pgcluster);

  process.on('SIGTERM', function () {
    logger.logsAsync(null, 'Terminate signal received, init-datasources:closing pgcluster on application termination.');
    pgcluster.end();
    logger.logsAsync(null, 'pg Cluster closed.');
    process.exit();
  });

  process.on('SIGINT', function () {
    logger.logsAsync(null, 'Interrupt signal received, init-datasources:closing pgcluster on application termination.');
    pgcluster.end();
    logger.logsAsync(null, 'pgCluster closed.');
    process.exit();
  });

};
