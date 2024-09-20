module.exports.invalidData = 400;
module.exports.documentNotFound = 404;
module.exports.defaultError = 500;
module.exports.duplicateData = 409;
module.exports.unauthorizedError = 401;
module.exports.forbiddenError = 403;
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

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
module.exports.AuthError = AuthError;
module.exports.DuplicateError = DuplicateError;
module.exports.NotFoundError = NotFoundError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.ValidationError = ValidationError;
