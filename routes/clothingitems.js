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
itemRouter.post("/", validateItemBody, auth, createItem);
itemRouter.delete("/:itemId", validateItemId, auth, deleteItem);
itemRouter.put("/:itemId/likes", validateItemId, auth, likeItem);
itemRouter.delete("/:itemId/likes", validateItemId, auth, dislikeItem);
module.exports = itemRouter;
