const crypto = require("crypto");

// const JWT_SECRET = crypto.randomBytes(32).toString("hex");
// module.exports.JWT_SECRET = JWT_SECRET;
const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};
