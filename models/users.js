const mongoose = require("mongoose");
const validator = require("validator");
const AuthError = require("../utils/errors");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
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
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email }).then((user) => {
          if (!user) {
            return Promise.reject(new AuthError("Incorrect email or password"));
          }
          bcrypt.compare(password, user.password).then((matched) => {
            if (!matched) {
              return Promise.reject(
                new AuthError("Incorrect email or password")
              );
            }
            return user;
          });
        });
      },
    },
  }
);

module.exports.User = mongoose.model("User", userSchema);
