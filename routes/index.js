const indexRouter = require("express").Router(); // creating a router
const userRouter = require("./users");
const itemRouter = require("./clothingitems");

indexRouter.use("/users", userRouter);
indexRouter.use("/items", itemRouter);
module.exports = indexRouter;
