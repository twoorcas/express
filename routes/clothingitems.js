const itemRouter = require("express").Router(); // creating a router
const {
  getItems,
  createItem,
  deleteItem,
  dislikeItem,
  likeItem,
} = require("../controllers/clothingitems");
const { auth } = require("../middlewares/auth");
itemRouter.get("/", getItems);
itemRouter.post("/", auth, createItem);
itemRouter.delete("/:itemId", auth, deleteItem);
itemRouter.put("/:itemId/likes", auth, likeItem);
itemRouter.delete("/:itemId/likes", auth, dislikeItem);
module.exports = itemRouter;
