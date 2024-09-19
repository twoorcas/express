module.exports.invalidData = 400;
module.exports.documentNotFound = 404;
module.exports.defaultError = 500;
module.exports.duplicateData = 409;
module.exports.unauthorizedError = 401;
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}
class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateError";
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}
module.exports.AuthError = AuthError;
module.exports.DuplicateError = DuplicateError;
module.exports.NotFoundError = NotFoundError;
