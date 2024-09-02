const Item = require("../models/clothingitems");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch((err) =>
      res.status(500).send({
        message: "error",
      })
    );
};

module.exports.deleteItem = (req, res) => {
  Item.findByIdAndRemove(req.params.itemId)
    .orFail(() => {
      const error = new Error({
        message: "Requested resource not found",
      });
      error.statusCode = 404;
      error.name = "NotFoundError";
      throw error;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (!err.name === "NotFoundError") {
        res.status(500).send({
          message: "error",
        });
      }
    });
};
