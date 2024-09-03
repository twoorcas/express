const { Item } = require("../models/clothingitems.js");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) =>
      res.status(500).send({
        message: "error",
      })
    );
};

module.exports.deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      const error = new Error({
        message: "Requested resource not found",
      });
      error.name = "NotFoundError";
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err); // Log the error server-side
      console.log(err.name);
      console.log(err.message);
      if (err.name === "NotFoundError") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({
          message: err.message,
        });
      }
    });
};
