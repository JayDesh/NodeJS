/**
* 
*/
var utility = require('../utility/utility.js'),
    app = require('../server.js'),
    badRequest = require('../error/error.js');

  module.exports = function routeErrors(app) {
    // 500 error.
    app.use(function (err, req, res, next) {
      utility.logsAsync(err);
      var error = new app.models.Error();
      if (err instanceof badRequest.BadRequest) {
        error.$details = err.message;
        error.$message = err.message;
        error.$errorCode = '400';
        res.status(400).send(error);
      }else {
        error.$details = err.message;
        error.$message = 'Server Error';
        error.$errorCode = '500';
        res.status(500).send(error);
      }
    });

    // 404 error.
    app.use(function (req, res, next) {
      if (res.headersSent) return;
      var error = new app.models.Error();
      error.$details = 'Error';
      error.$message = 'The requested resource could not be found';
      error.$errorCode = '404';
      res.status(404).send(error);
    });
  };
