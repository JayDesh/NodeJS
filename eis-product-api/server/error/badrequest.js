/**
 * custom error object created for sending application error response to the client.
 * @param message
 * @constructor
 */
function BadRequestError(message) {
  this.name = 'BadRequestError';
  this.message = message || 'Bad Request!';
}
BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;


module.exports = {
  BadRequestError: BadRequestError
};
