var badRequest = require('../error/error.js');

/**
 * This middleware module is used to validate incoming url and request params.
 * @returns {Function}
 */
module.exports = function() {
  return function requestValidator(req, res, next) {
    if(req.originalUrl.indexOf('plcvs') !== -1) {
      if (!isValidEfinishRequest(req.query.plcvs)) {
        throw new badRequest.BadRequest('Invalid Input Parameters');
      }
    } else if(req.originalUrl.indexOf('skus') !== -1) {
      if (!req.query.skus) {
        throw new badRequest.BadRequest('Invalid Input Parameters');
      }
    }
    next();
  };

  function isValidEfinishRequest(plcvs){
    if(!plcvs) {
      return false;
    }else{
      var plcvsArr = plcvs.split(',');
      for (var i = 0; i < plcvsArr.length; i++) {
        if(!isValidPlc(plcvsArr[i])){
          return false;
        }
      }
    }
    return true;
  }

  function isValidPlc(plcv){
    if(!plcv) {
      return false;
    }else {
      var plcvArr = plcv.replace(/-([^-]*)$/, '@@$1').split('@@');
      if (plcvArr.length !== 2) {
        return false;
      }
    }
    return true;
  }

  function isNormalInteger(str) {
    var n = ~~Number(str.toString().trim());
    return String(n) === str.toString().trim() && n >= 0;
  }
};
