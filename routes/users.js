const userRouter = require("express").Router(); // creating a router
const { getUsers, createUser, getUser } = require("../controllers/users");

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", createUser);
module.exports = userRouter;
