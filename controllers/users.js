const { User } = require("../models/users.js");
const mongoose = require("mongoose");
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};
module.exports.getUser = (req, res) => {
  const { id } = req.params;
  // First validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid ID format");
    error.name === "invalidIdError";
    throw error;
  }
  // Explicitly cast the ID to an ObjectId
  const objectId = mongoose.Types.ObjectId(id);
  User.findById(objectId)
    .orFail(() => {
      const error = new Error("Requested resource not found");
      error.name = "NotFoundError";
      throw error;
    })
    // return the found data to the user
    .then((user) => res.send(user))
    // if the record was not found, display an error message
    .catch((err) => {
      console.error(err); // Log the error server-side
      console.log("Error name:", err.name);
      console.log("Error message:", err.message);
      if (err.name === "invalidIdError") {
        res.status(400).send({ message: "Invalid ID format" });
      }
      if (err.name === "NotFoundError") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({
          message: "An internal server error occurred",
        });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body; // get the name and description of the user
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err); // Log the error server-side
      res.status(500).send({
        message: "An internal server error occurred",
      });
    });
};
