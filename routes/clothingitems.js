const itemRouter = require("express").Router(); // creating a router
const {
  getItems,
  createItem,
  deleteItem,
  dislikeItem,
  likeItem,
} = require("../controllers/clothingitems.js");
itemRouter.get("/", getItems);
itemRouter.post("/", createItem);
itemRouter.delete("/:itemId", deleteItem);
itemRouter.put("/:itemId/likes", likeItem);
itemRouter.delete("/:itemId/likes", dislikeItem);
module.exports = itemRouter;
