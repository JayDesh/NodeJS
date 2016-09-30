var path = require('path'),
app = require(path.resolve(__dirname, './server'));
var loopback = require('loopback');
var boot = require('loopback-boot');

global.appRoot = path.resolve(__dirname);

loopback=module.exports.getLoopBack=loopback;
app = module.exports.getapp = loopback();

app.set('port', (process.env.PORT || 7000));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
