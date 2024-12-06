const indexRouter = require("express").Router(); // creating a router
const userRouter = require("./users");
const itemRouter = require("./clothingitems");
const { login, createUser } = require("../controllers/users");
const {
  validateAuthentication,
  validateUserBody,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/errorclass/NotFoundError");

indexRouter.use("/users", userRouter);
indexRouter.use("/items", itemRouter);
indexRouter.post("/signin", validateAuthentication, login);
indexRouter.post("/signup", validateUserBody, createUser);
indexRouter.use(() => {
  throw new NotFoundError("Source Not Found");
});

module.exports = indexRouter;
