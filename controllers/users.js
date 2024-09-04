const { User } = require("../models/users");
const mongoose = require("mongoose");
const {
  invalidData,
  documentNotFound,
  defaultError,
} = require("../utils/errors.js");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(defaultError).send({ message: err.message });
    });
};
module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    //throw error if id format valid but id not found
    .orFail()
    // return the found data to the user
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err); // Log the error server-side
      console.log("Error name:", err.name);
      console.log("Error message:", err.message);
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFound)
          .send({ message: "Requested resource not found" });
      }
      return res.status(defaultError).send({
        message: err.message,
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body; // get the name and description of the user
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      console.error(err); // Log the error server-side
      console.log(err.name);
      console.log(err.message);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};
