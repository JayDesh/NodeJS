var efinishEfileService = require('../service/efinishEfileService.js'),
    skuService = require('../service/sku-service.js');


module.exports = function (SwaggerApi) {

  /**
   * Endpoint lets user search for skus based on set of pclvs (Product Line Code Versions) or retrieve data
   * for various skus.
   * @param {string[]} skus Comma separated list of skus whose details to be returned.
   * For ex., `978G1-EFG000-0101E` or `978G1-EFG000-0101E,978G1-EFG000-0101E,978G1-EFG000-0101E`.
   * Either skus or plcvs parameters needs to be specified. If both are present, skus parameter takes the precedence.
   * @param {string[]} plcvs Comma separated list of Product Line Code/Versions for which all matching skus
   * would need to be returned. For ex., `ACD-2016` or `ACD-2016,MAYA2015`. Product line codes are case insensitive
   * as system will always convert to Upper case before lookup. Either skus or plcvs parameters needs to be specified.
   * If both are present, skus parameter takes the precedence.
   * @param {string} fields Json mask [https://github.com/nemtsov/json-mask] compatible
   * list of model fields to return in the response
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {Error} result Result object
   */
  SwaggerApi.getProductsVSkus = function (skus, fields, callback) {
    // Replace the code below with your implementation.
    // Please make sure the callback is invoked.
    process.nextTick(function () {
      skuService.getProductsFromSkusOrPlcvs(skus, fields, callback);
    });

  };

  /**
   * Returns an array of Efinishes and its efiles for matching set of Product Line Code/Versions.
   * If there are no efinishes matching given plcvs, then empty array is returned (not 404).
   * @param {string[]} plcvs Comma separated list of Product Line Code/Versions for which all
   * matching skus would need to be returned.
   * For ex., `ACD-2016` or `ACD-2016,MAYA-2015`. Product line codes are case insensitive as
   * system will always convert to Upper case before lookup.
   * @param {string} fields Json mask (https://github.com/nemtsov/json-mask) compatible list
   * of model fields to return in the response
   * @callback {Function} callback Callback function
   * @param {Error|string} err Error object
   * @param {Error} result Result object
   */
  SwaggerApi.getProductsVEfinishes = function (plcvs, includeExpired, fields, callback) {
    process.nextTick(function () {
      efinishEfileService.getEfinishEfileAssociation(plcvs, includeExpired, fields, callback);
    });
  };

  SwaggerApi.remoteMethod('getProductsVSkus',
    {
      isStatic: true,
      accepts: [{
        arg: 'skus',
        type: ['string'],
        description: 'Comma separated list of skus whose details to be returned. For ex., `978G1-EFG000-0101E` or ' +
        '`978G1-EFG000-0101E,978G1-EFG000-0101E,978G1-EFG000-0101E`. Either skus or plcvs parameters ' +
        'needs to be specified. If both are present, skus parameter takes the precedence.',
        required: true,
        http: {source: 'query'}
      },
        {
          arg: 'fields',
          type: 'string',
          description: 'Json mask [https://github.com/nemtsov/json-mask] compatible list of model fields ' +
          'to return in the response',
          required: undefined,
          http: {source: 'query'}
        }],
      returns: [{
        description: 'error response',
        type: 'Error',
        arg: 'data',
        root: true
      }],
      http: {verb: 'get', path: '/products/v1/skus'},
      description: 'Endpoint lets user search for skus based on set of pclvs (Product Line Code Versions) ' +
      'or retrieve data for various skus.'
    }
  );

  SwaggerApi.remoteMethod('getProductsVEfinishes',
    {
      isStatic: true,
      accepts: [{
        arg: 'plcvs',
        type: ['string'],
        description: 'Comma separated list of Product Line Code/Versions for which all matching skus would ' +
        'need to be returned. For ex., `ACD-2016` or `ACD-2016,MAYA-2015`. Product line codes are case ' +
        'insensitive as system will always convert to Upper case before lookup.',
        required: true,
        http: {source: 'query'}
      },
        {
          arg: 'includeExpired',
          type: 'boolean',
          description: 'By default only the efinishes whose download end date equals to today or later than today ' +
          'are returned. If you specify this flag, all active efinishes, including expired ones are returned.',
          required: undefined,
          http: {source: 'query'}
        },
        {
          arg: 'fields',
          type: 'string',
          description: 'Json mask (https://github.com/nemtsov/json-mask) compatible list of model fields to' +
          ' return in the response',
          required: undefined,
          http: {source: 'query'}
        }],
      returns: [{
        description: 'error response',
        type: 'Efinish',
        arg: 'data',
        root: true
      }],
      http: {verb: 'get', path: '/products/v1/efinishes'},
      description: 'Returns an array of Efinishes and its efiles for matching set of Product Line Code/Versions. ' +
      'If there are no efinishes matching given plcvs, then empty array is returned (not 404).'
    }
  );

};
