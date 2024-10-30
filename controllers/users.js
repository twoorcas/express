const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { User } = require("../models/users");
const {
  invalidData,
  documentNotFound,
  defaultError,
  duplicateData,
  unauthorizedError,
} = require("../utils/errors");
const { DuplicateError } = require("../utils/errorclass/DuplicateError");
const { NotFoundError } = require("../utils/errorclass/NotFoundError");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.log(err);
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    // throw error if id format valid but id not found
    .orFail()
    // return the found data to the user
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err); // Log the error server-side
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid id format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFound)
          .send({ message: "Requested resource not found" });
      }
      return res.status(defaultError).send({
        message: "An error has occurred on the server",
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body; // get the name and description of the user
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DuplicateError("duplicate emails");
      }
      // If user doesn't exist, hash the password and create the user
      bcrypt
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
          console.error(err); // Log the error server-side
          if (err.name === "ValidationError") {
            return res.status(invalidData).send({ message: "Invalid data" });
          }
          return res
            .status(defaultError)
            .send({ message: "An error has occurred on the server" });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DuplicateError") {
        return res
          .status(duplicateData)
          .send({ message: "User already exists" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.login = (req, res) => {
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(invalidData)
          .send({ message: "Email or password missing" });
      }
      if (err.name === "AuthError") {
        return res
          .status(unauthorizedError)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return Promise.reject(new NotFoundError("User Not Found"));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return res
          .status(documentNotFound)
          .send({ message: "User does not exist" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.updateProfile = (req, res) => {
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
      console.error(err);
      if (err.name === "NotFoundError") {
        return res.status(documentNotFound).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};
