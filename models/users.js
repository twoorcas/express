const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { ValidationError } = require("../utils/errorclass/ValidationError");
const { AuthError } = require("../utils/errorclass/AuthError");

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
        if (!email || !password) {
          return Promise.reject(
            new ValidationError("Missing email or password")
          );
        }
        return this.findOne({ email })
          .select("+password")
          .then((user) => {
            if (!user) {
              return Promise.reject(
                new AuthError("Incorrect email or password")
              );
            }

            return bcrypt.compare(password, user.password).then((matched) => {
              if (!matched) {
                return Promise.reject(
                  new AuthError("Incorrect email or password")
                );
              }
              return user;
            });
          });
        // .catch((err) => {
        //   console.error(err);
        //   throw err;
        // });
      },
    },
  }
);

module.exports.User = mongoose.model("User", userSchema);
