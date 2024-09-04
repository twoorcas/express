const { Item } = require("../models/clothingitems.js");
const {
  invalidData,
  documentNotFound,
  defaultError,
} = require("../utils/errors.js");
module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      return res.status(defaultError).send({ message: err.message });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
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

module.exports.deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
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
      } else {
        return res.status(defaultError).send({
          message: err.message,
        });
      }
    });
};

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      console.log("Error name:", err.name);
      console.log("Error message:", err.message);
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFound)
          .send({ message: "Requested resource not found" });
      } else {
        return res.status(defaultError).send({
          message: err.message,
        });
      }
    });
};
module.exports.dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      console.log("Error name:", err.name);
      console.log("Error message:", err.message);
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFound)
          .send({ message: "Requested resource not found" });
      } else {
        return res.status(defaultError).send({
          message: err.message,
        });
      }
    });
};
