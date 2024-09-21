const { Item } = require("../models/clothingitems");
const {
  invalidData,
  documentNotFound,
  defaultError,
  forbiddenError,
  ForbiddenError,
} = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err); // Log the error server-side
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: "Invalid data" });
      }
      return res.status(defaultError).send({ message: "Internal Server" });
    });
};

module.exports.deleteItem = (req, res) => {
  const user = req.user._id;
  Item.findById(req.params.itemId)
    .populate("owner")
    .orFail() // ensures if no such _id in the db, it throws 404
    .then((item) => {
      if (item.owner._id.equals(user)) {
        return Item.findByIdAndDelete(item._id)
          .orFail()
          .then((deleted) => res.send({ deleted }));
      }

      throw new ForbiddenError("Request forbidden");
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ForbiddenError") {
        return res
          .status(forbiddenError)
          .send({ message: "Item cannot be deleted" });
      }
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
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid id format" });
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
