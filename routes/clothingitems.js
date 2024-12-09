const itemRouter = require("express").Router(); // creating a router
const {
  getItems,
  createItem,
  deleteItem,
  dislikeItem,
  likeItem,
} = require("../controllers/clothingitems");
const { auth } = require("../middlewares/auth");
const {
  validateItemBody,
  validateItemId,
} = require("../middlewares/validation");

itemRouter.get("/", getItems);
itemRouter.post("/", auth, validateItemBody, createItem);
itemRouter.delete("/:itemId", auth, validateItemId, deleteItem);
itemRouter.put("/:itemId/likes", auth, validateItemId, likeItem);
itemRouter.delete("/:itemId/likes", auth, validateItemId, dislikeItem);
module.exports = itemRouter;
