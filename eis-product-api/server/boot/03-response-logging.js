var utility = require('../utility/utility.js');
var uuid = require('node-uuid');

module.exports = function(app) {
  var remotes = app.remotes();
  remotes.after('**', function (ctx, next) {
    if(process.env.logRequestResponseHeaders==="true") {
      utility.logsAsync(null, 'OutgoingResponse=' + JSON.stringify(ctx.result));
    }
    next();
  });
};
