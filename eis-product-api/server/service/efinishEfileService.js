var efinishdao = require('../dao/efinishdao.js'),
    utility = require('../utility/utility.js'),
    mask = require('json-mask'),
    errorCodes = require('../error/error.js'),

  /**
   * Method populates and returns Efinish data into an eFinish object.
   * @param eFinishData
   * @returns {app.models.Efinish}
   */
  populateAndReturnEfinish = function (eFinishData) {
    var eFinish = new app.models.Efinish();

    eFinish.$productLineCode = utility.getDataValue(eFinishData.prodefgproductlinecode);
    eFinish.$version = utility.getDataValue(eFinishData.prodefgversion);
    eFinish.$downloadEndDate = utility.getISODate(eFinishData.efgdownloadenddate);
    eFinish.$efinishId = utility.getDataValue(eFinishData.efgpartnumber);

    return eFinish;
  },

  /**
   * Method populates and returns Efile data into an eFinish object.
   * @param eFileData
   * @returns {app.models.Efile}
   */
  populateAndReturnEfile = function (eFileData) {
    var eFile = new app.models.Efile();

    eFile.$checksum = utility.getDataValue(eFileData.efilechecksum);
    eFile.$contentType = utility.getDataValue(eFileData.efilecontenttype);
    eFile.$downloadMethod = utility.getDataValue(eFileData.efiledownloadmethod);
    eFile.$efileId = utility.getDataValue(eFileData.efilepartnumber);
    eFile.$fileDescription = utility.getDataValue(eFileData.efiledescription);
    eFile.$fileNameWithPath = utility.getDataValue(eFileData.efilenamewithpath);
    eFile.$packedFileSize = utility.getDataValue(eFileData.efilepackedfilesize);
    eFile.$platform = utility.getDataValue(eFileData.efilepateform);
    eFile.$productLanguageCodes = eFileData.efilelanguages.split(';');
    eFile.$productLineCode = utility.getDataValue(eFileData.efileproductlinecode);
    eFile.$subRelease = utility.getDataValue(eFileData.efilesubrelease);
    eFile.$unpackedFileSize = utility.getDataValue(eFileData.efileunpackedfilesize);
    eFile.$productName = utility.getDataValue(eFileData.efileprimaryproductline);
    eFile.$version = utility.getDataValue(eFileData.efileversion);

    return eFile;
  },


  addEfile = function (efileArray, efile) {
    if (efileArray === undefined) {
      efileArray = [];
    }
    efileArray.push(efile);
    return efileArray;
  };

  /**
   * This method is used to call the dao layer to retrieve the efinish and efile data and consolidate the response
   * into one single array of efinishes that gets passed into the final callback method to output the response for
   * rest call. There is also logic for applying json-mask in this method that filters the fields that need to be
   * outputted in the response.
   * @param plcvs
   * @param includeExpired
   * @param fields
   * @param callback
   */
  getEfinishEfileAssociation = function (plcvs, includeExpired, fields, callback) {

    var queryInput = plcvs.toString().toUpperCase().replace(/[\s-]+/g, '').trim(),
        startTime = new Date().getTime(),
        processEfinishEFile = function (err, data) {

          var eFinishes = [], eFinishesIds = [];

          if(err) {
            utility.logsAsync(err,null);
            err = new Error ('Not able to retrieve efinish data for plcvs='+plcvs);
            err.name = 'Server Error';
            err.status = 500;
            err.errorCode = errorCodes.code.SERVER_ERROR;
            return callback(err);
          } else {

            //release the database connection back to the pool.
            this.doneFunc();

            var dataArray = data.rows;
            for (var j = 0; j < dataArray.length; j++) {

              var eFinishId = dataArray[j].efgpartnumber.toString(),
                eFinishIndex = eFinishesIds.indexOf(eFinishId),
                eFinish = null;

              if (eFinishIndex === -1) {
                eFinish = populateAndReturnEfinish(dataArray[j]);
                eFinishes.push(eFinish);
                eFinishesIds.push(eFinishId);
              } else {
                eFinish = eFinishes[eFinishIndex];
              }

              var eFile = populateAndReturnEfile(dataArray[j]);
              eFinish.efiles = addEfile(eFinish.efiles, eFile);
            }

            dataArray = null;
            data = null;

            if (fields !== undefined && fields.length > 0) {
              var maskedObj;
              if (fields.indexOf('*') > -1) {
                maskedObj = mask(JSON.parse(JSON.stringify(eFinishes)), fields);
              } else {
                maskedObj = mask(eFinishes, fields);
              }
              callback(null, maskedObj);
            } else {
              callback(null, eFinishes);
            }
          }
          var endTime = new Date().getTime();
          utility.logsAsync(null, 'category="ExecutionTime" method="getEfinishEfileAssociation" duration="'+(endTime-startTime) +'" unit="ms" ');
        };

    // use the includeExpired flag to filter data.
    if(includeExpired !== undefined && includeExpired === true){
      efinishdao.getAllEfinishEfileData(queryInput, processEfinishEFile);
    } else {
      efinishdao.getFilteredEfinishEfileData(queryInput, processEfinishEFile);
    }

  };

module.exports = {
  getEfinishEfileAssociation : getEfinishEfileAssociation
};
