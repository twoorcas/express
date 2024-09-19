const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { AuthError } = require("../utils/errors");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [30, "Name exceeds 30 characters"],
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return validator.isURL(value);
        },
        message: "You must enter a valid URL",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
        message: "You must enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select("+password")
          .then((user) => {
            if (!user) {
              return Promise.reject(
                new AuthError("Incorrect email or password")
              );
            }

            console.log("Plain password:", password);
            console.log("Stored hashed password:", user.password);
            return bcrypt
              .compare(password, user.password)
              .then((matched) => {
                if (!matched) {
                  console.log("Password match failed:", matched);
                  return Promise.reject(
                    new AuthError("Incorrect email or password")
                  );
                }
                return user;
              })
              .catch((err) => {
                console.error(err);
                throw err;
              });
          })
          .catch((err) => {
            console.error(err);
            throw err;
          });
      },
    },
  }
);

module.exports.User = mongoose.model("User", userSchema);
