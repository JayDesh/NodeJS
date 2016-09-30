var pg;
if(process.env.NODE_ENV === 'local')
  pg = require('pg');
else
  pg = require('pg').native;

var _ = require('underscore'),
    debug = require('debug')('adsk:product:pgcluster'),
    logger = require('./utility.js');

var defaultOptions = {

  // Initial timeout for a failed connection.
  baseTimeout: 2000,

  // On consecutive failures, increase timeout by this many seconds.
  retryFactor: 2

};

/**
 * Implements a simple, round-robin cluster of postgres connections.
 * @param {[string]} connections an array of postgres connection strings.
 */
var PgCluster = function (connections, options) {
  debug('init:', connections);
  this.options = _.extend(defaultOptions, options);
  this.counter = 0;
  this.connections = connections;
  this.connectionTimeout = {};
  _.each(connections, (function (item) {
    this.connectionTimeout[item] = 0;
  })  .bind(this));
};

PgCluster.prototype.end = function () {
  pg.end();
  debug('pgcluster was closed successfully!');
};

/**
 * Fetch a postgres client from the cluster.
 * @param  {Function} callback (err, client, done)
 */
PgCluster.prototype.connect = function (callback) {

  if (this.connections.length === 0) {
    return callback(new Error('No valid connections exist in the cluster.'));
  }
  var index = this.counter++ % this.connections.length;
  var connection = this.connections[index];

  debug('connecting to:', connection);
  pg.connect(connection, (function (err, client, done) {

    // If there was an error with the connection, remove the 'bad' connection
    // from the cluster and retry using the next valid connection.
    if (err) {

      logger.logsAsync(err);

      // If this connection previously caused an error, increase the timeout length by a factor of 2.
      if (this.connectionTimeout[connection] === 0)
        this.connectionTimeout[connection] = this.options.baseTimeout;
      else
        this.connectionTimeout[connection] += (this.options.retryFactor * 1000);

      logger.logsAsync(null, 'removing from cluster for' + this.connectionTimeout[connection] + ' ms: ' + connection);

      this.connections = _.reject(this.connections, function (item) {
        return item === connection;
      });

      this.counter--;

      // Add the connection back to the cluster after the timeout period.
      setTimeout(function (self, connection) {
        logger.logsAsync(null, 'adding connection back to cluster: ' + connection);
        self.connections.push(connection);
      }, this.connectionTimeout[connection], this, connection);

      done(); // Release connection.

      if (this.connections.length > 0)
      // Retry using the next connection in the cluster.
        return this.connect(callback);
      else {
        // We're out of connections! Bubble the error up the callback stack.
        return callback(err);
      }

    }

    // This is a valid connection. Set the timeout to zero and proceed with processing the callback.
    this.connectionTimeout[connection] = 0;
    return callback(err, client, done);

  }).bind(this));
};

module.exports = PgCluster;
