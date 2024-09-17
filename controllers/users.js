const { User } = require("../models/users");
const bcrypt = require("bcryptjs"); // importing bcrypt
const {
  invalidData,
  documentNotFound,
  defaultError,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
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
    .then((user) => res.status(200).send(user))
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
  bcrypt
    .hash(password, 10)
    .then(User.create({ name, avatar, email, password }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      console.error(err); // Log the error server-side
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: "Invalid data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};
