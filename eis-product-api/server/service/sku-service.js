var efinishdao = require('../dao/efinishdao.js'),
    utility = require('../utility/utility.js'),
    mask = require('json-mask'),
    errorCodes = require('../error/error.js'),

  populateAndReturnSku = function (skuData) {
    var sku = new app.models.Sku();

    var skuPartNumber = utility.getDataValue(skuData.part_number__c);
    sku.$sku = skuPartNumber === null ? '' : skuPartNumber;

    var skuAliasName = utility.getDataValue(skuData.alias_name__c);
    sku.$name = skuAliasName === null ? '' : skuAliasName;

    var skuDescription =  utility.getDataValue(skuData.description);
    sku.$description = skuDescription === null ? '' : skuDescription;

    var skuStatus = utility.getDataValue(skuData.status__c);
    sku.$status = skuStatus === null ? '' : skuStatus;

    var skuFcsDate = utility.getISODate(skuData.fcs_date__c);
    sku.$fcsDate = skuFcsDate === null ? '' : skuFcsDate;

    var skuProductKey = utility.getDataValue(skuData.product_key__c);
    sku.$productKey = skuProductKey === null ? '' : skuProductKey;

    var skuProductLineCode = utility.getDataValue(skuData.product_line_code__c);
    sku.$productLineCode = skuProductLineCode === null ? '' : skuProductLineCode;

    var skuVersion = utility.getDataValue(skuData.version__c);
    sku.$productVersion = skuVersion === null ? '' : skuVersion;

    var skuActivationCode = utility.getDataValue(skuData.activation_code_required__c);
    sku.$activationCodeRequired = skuActivationCode === null ? '' : skuActivationCode;

    var skuAssetModificationC = utility.getDataValue(skuData.asset_modification__c);
    sku.$assetModification = skuAssetModificationC === null ? '' : skuAssetModificationC;

    var skuBillingBehavior = utility.getDataValue(skuData.billing_behavior__c);
    sku.$billingBehavior = skuBillingBehavior === null ? '' : skuBillingBehavior;

    var skuIsBundle = utility.getDataValue(skuData.is_bundle__c);
    sku.$bundle = skuIsBundle === null ? '' : skuIsBundle;

    var skuContractTerm = utility.getDataValue(skuData.contract_term__c);
    sku.$contractTerm = skuContractTerm === null ? '' : skuContractTerm;

    var skuDeploymentType = utility.getDataValue(skuData.deployment__c);
    sku.$deploymentType = skuDeploymentType === null ? '' : skuDeploymentType;

    var skuEndUserType = utility.getDataValue(skuData.end_user_type__c);
    sku.$endUserType = skuEndUserType === null ? '' : skuEndUserType;

    var skuFertCertificate = utility.getDataValue(skuData.fert_certificate__c);
    sku.$fertCertificate = skuFertCertificate === null ? '' : skuFertCertificate;

    var skuLanguageCode = utility.getDataValue(skuData.language_code__c);
    sku.$languageCode = skuLanguageCode === null ? '' : skuLanguageCode;

    var skuLicenseModel = utility.getDataValue(skuData.license_model__c);
    sku.$licenseModel = skuLicenseModel === null ? '' : skuLicenseModel;

    var skuLicenseType = utility.getDataValue(skuData.license_type__c);
    sku.$licenseType = skuLicenseType === null ? '' : skuLicenseType;

    var skuLockingMechanism = utility.getDataValue(skuData.locking_mechanism__c);
    sku.$lockingMechanism = skuLockingMechanism === null ? '' : skuLockingMechanism;

    var skuMaterialGroup = utility.getDataValue(skuData.material_group__c);
    sku.$materialGroup = skuMaterialGroup === null ? '' : skuMaterialGroup;

    var skuMedia = utility.getDataValue(skuData.media__c);
    sku.$media = skuMedia === null ? '' : skuMedia;

    var skuNfrUser = utility.getDataValue(skuData.nfr_use__c);
    sku.$nfrUseCode = skuNfrUser === null ? '' : skuNfrUser;

    var skuProductBehavior = utility.getDataValue(skuData.product_behavior__c);
    sku.$productBehavior = skuProductBehavior === null ? '' : skuProductBehavior;

    var skuProgramType = utility.getDataValue(skuData.program_type__c);
    sku.$programType = skuProgramType === null ? '' : skuProgramType;

    var skuRegistrationMethod = utility.getDataValue(skuData.registration_method_code__c);
    sku.$registrationMethod = skuRegistrationMethod === null ? '' : skuRegistrationMethod;

    var skuReleaseType = utility.getDataValue(skuData.release_type__c);
    sku.$releaseType = skuReleaseType === null ? '' : skuReleaseType;

    var skuSalesLicenseType = utility.getDataValue(skuData.sales_license_type__c);
    sku.$salesLicenseType = skuSalesLicenseType === null ? '' : skuSalesLicenseType;

    var skuSalesProgramType = utility.getDataValue(skuData.special_sales_program_type__c);
    sku.$salesProgramType = skuSalesProgramType === null ? '' : skuSalesProgramType;

    var skuSequenceExecution = utility.getDataValue(skuData.sequence_extension__c);
    sku.$sequenceExtension = skuSequenceExecution === null ? '' : skuSequenceExecution;

    var skuServiceLimit = utility.getDataValue(skuData.service_limit_code__c);
    sku.$serviceLimit = skuServiceLimit === null ? '' : skuServiceLimit;

    var skuSalesType = utility.getDataValue(skuData.service_sales_type__c);
    sku.$serviceSalesType = skuSalesType === null ? '' : skuSalesType;

    var skuServiceType = utility.getDataValue(skuData.service_type__c);
    sku.$serviceType = skuServiceType === null ? '' : skuServiceType;

    var skuSubscriptionLevel = utility.getDataValue(skuData.subscription_level__c);
    sku.$subscriptionLevel = skuSubscriptionLevel === null ? '' : skuSubscriptionLevel;

    var skuSupportEndDate = utility.getDataValue(skuData.support_end_date__c);
    sku.$supportEndDate = skuSupportEndDate === null ? '' : skuSupportEndDate;

    var skuSupportStartDate = utility.getDataValue(skuData.support_start_date__c);
    sku.support_start_date__c = skuSupportStartDate === null ? '' : skuSupportStartDate;

    var skuUpgradable = utility.getDataValue(skuData.upgradeable__c);
    sku.$upgradable = skuUpgradable === null ? '' : skuUpgradable;

    var skuUsageType = utility.getDataValue(skuData.usage_type__c);
    sku.$usageType = skuUsageType === null ? '' : skuUsageType;

    return sku;
  };

  getProductsFromSkusOrPlcvs = function(skus, fields, callback){
    var skuArray = skus.toString().replace(/[\s]+/g, '').trim().toUpperCase().split(','),
        startTime = new Date().getTime(),
        processSkus = function(err, data){

          var skus = [];

          if(err) {
            utility.logsAsync(err,null);
            err = new Error ('Not able to retrieve SKU data for skus='+skus);
            err.name = 'Server Error';
            err.status = 500;
            err.errorCode = errorCodes.code.SERVER_ERROR;
            return callback(err);
          } else {

            //release the database connection back to the pool.
            this.doneFunc();

            var dataArray = data.rows;
            for (var j = 0; j < dataArray.length; j++) {
              var sku = null;
              sku = populateAndReturnSku(dataArray[j]);
              skus.push(sku);
            }

            dataArray = null;

            if (fields !== undefined && fields.length > 0) {
              var maskedObj;
              if (fields.indexOf('*') > -1) {
                maskedObj = mask(JSON.parse(JSON.stringify(skus)), fields);
              } else {
                maskedObj = mask(skus, fields);
              }
              callback(null, maskedObj);
            } else {
              callback(null, skus);
            }
          }
          var endTime = new Date().getTime();
          utility.logsAsync(null, 'category="ExecutionTime" method="getProductsFromSkusOrPlcvs" duration="'+(endTime-startTime) +'" unit="ms" ');
        };

    efinishdao.getSKUData(skuArray, processSkus);
  };

module.exports = {
  getProductsFromSkusOrPlcvs : getProductsFromSkusOrPlcvs
};
