const { Item } = require("../models/clothingitems");
const { ValidationError } = require("../utils/errorclass/ValidationError.js");

module.exports.getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
      }
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
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
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
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
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
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};
