const indexRouter = require("express").Router(); // creating a router
const userRouter = require("../routes/users");
const itemRouter = require("./clothingitems.js");
indexRouter.use("/users", userRouter);
indexRouter.use("/items", itemRouter);
module.exports = indexRouter;
