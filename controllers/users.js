const User = require("../models/users.js");
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) =>
      //  res.send(users)
      console.log(111)
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error({
        message: "Requested resource not found",
      });
      error.statusCode = 404;
      error.name = "NotFoundError";
      throw error;
    })
    // return the found data to the user
    .then((user) => res.send({ data: user }))
    // if the record was not found, display an error message
    .catch((err) => {
      if (!err.name === "NotFoundError") {
        res.status(500).send({
          message: "error",
        });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body; // get the name and description of the user
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({
        message: "error",
      })
    );
};
