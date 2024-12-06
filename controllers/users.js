const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { User } = require("../models/users");
const { ValidationError } = require("../utils/errorclass/ValidationError");
const { DuplicateError } = require("../utils/errorclass/DuplicateError");
const { NotFoundError } = require("../utils/errorclass/NotFoundError");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};
module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    // throw error if id format valid but id not found
    .orFail()
    // return the found data to the user
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body; // get the name and description of the user
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DuplicateError("duplicate emails");
      }
      // If user doesn't exist, hash the password and create the user
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({ name, avatar, email, password: hashedPassword })
        )
        .then((created) =>
          res.status(201).send({
            name: created.name,
            avatar: created.avatar,
            email: created.email,
          })
        )
        .catch((err) => {
          if (err.name === "CastError") {
            next(new ValidationError("The id string is in an invalid format"));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: "7d" } // this token will expire in 7d
      );
      return res.send({ token, user });
      // { token }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return Promise.reject(new NotFoundError("User Not Found"));
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { runValidators: true, new: true }
  )
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      throw new NotFoundError("Not found");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};
