/**
 * This js file has utility functions that are used to get data and date in ISO format. These are used
 * across the application.
 */
var getDataValue = function (data) {
  data = data || null;
    return data;
  },

getISODate = function (date) {
  if (date) {
    var dateVar = new Date(date);
     date = dateVar.toISOString().substr(0, dateVar.toISOString().indexOf('T')).toString();
  }
  return date;
},

logsAsync = function (err, message, logRequestResponseHeaders) {
  if((process.env.ENABLE_LOGGING || 'true')==='true'){
    setTimeout(function(){
      if(err){
        console.error('AppName="'+ process.env.APP_NAME +'" ' + 'Error=' + JSON.stringify(err).trim());
        console.error('AppName="'+ process.env.APP_NAME +'" ' + 'ErrorStackTrace=' + JSON.stringify(err.stack).trim());
      }else {
        console.log('AppName="'+ process.env.APP_NAME +'" '+message);
      }
    }, 0);
  }
};

module.exports = {
  getDataValue : getDataValue,
  getISODate : getISODate,
  logsAsync : logsAsync
};
