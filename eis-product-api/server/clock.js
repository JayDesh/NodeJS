/**
 * This script is used to schedule a task that runs on Heroku once every hour for updating the contents of the
 * materialized view named salesforce.efinish_efile_view. This view has been created to optimize the performance
 * of SQL that is executed within the workflow that retrieves Efinishes/Efiles for a set of plcvs
 * (ProductLineCode & Version)
 */
var pgClock;
if(process.env.NODE_ENV === 'local')
  pgClock = require('pg');
else
  pgClock = require('pg').native;

var logger = require('./utility/utility.js'),
  debug = require('debug')('adsk:clock');

pgClock.defaults.poolSize = 8;

var timeInterval = process.env.MVIEW_REFRESH_TIME || 35000,
  connectionString = process.env.MASTER_DATABASE_URL + '?ssl=true';

debug('Initializing clock task using: ', connectionString, ' with a clock interval of: ' + timeInterval);

// Using setInterval to schedule as task that will run periodically based on the value of the CLOCK_INTERVAL config var
var intervalFunc = setInterval(function() {
  pgClock.connect(connectionString, function(err, client, done) {
    var query = client.query('Refresh materialized view salesforce.efinish_efile_view', function (err, result) {
      if (err) {
        logger.logsAsync(err);
      } else {
        logger.logsAsync(null, 'ViewRefreshMessage="Materialized view refreshed successfully!"');
      }
      result = null;
      done();
    });
  });
}, Number(timeInterval));

//Catch the SIGTERM and SIGINT signals and properly shutdown the app by closing the pgcluster and exiting the node
//process

process.on('SIGTERM', function () {
  clearInterval(intervalFunc);
  pgClock.end();
  logger.logsAsync(null, 'ResourceShutdownMessage="Terminate signal received, Clock:closed Clock pgClock on application termination."');
  process.exit();
});

process.on('SIGINT', function () {
  clearInterval(intervalFunc);
  pgClock.end();
  logger.logsAsync(null, 'ResourceShutdownMessage="Interrupt signal received, Clock:closed Clock pgClock on application termination."');
  process.exit();
});
