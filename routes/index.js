const indexRouter = require("express").Router(); // creating a router
const userRouter = require("./users");
const itemRouter = require("./clothingitems");
const { documentNotFound } = require("../utils/errors");

indexRouter.use("/users", userRouter);
indexRouter.use("/items", itemRouter);
indexRouter.use((req, res) => {
  res.status(documentNotFound).send({ error: "Not Found" });
}); // no need for next(), since the middleware direcrtly sends a res and no pass control to further middleware.
module.exports = indexRouter;
