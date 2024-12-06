const jwt = require("jsonwebtoken");
const { AuthError } = require("../utils/errorclass/AuthError");
const { JWT_SECRET } = require("../utils/config");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthError("Authorization required");
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // assigning payload to the request object
    next();
    return undefined;
  } catch (err) {
    throw new AuthError("Authorization failed");
  }
};
