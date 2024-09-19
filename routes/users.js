const userRouter = require("express").Router(); // creating a router
const {
  getUsers,
  createUser,
  getUser,
  getCurrentUser,
  updateProfile,
  login,
} = require("../controllers/users");
const { auth } = require("../middlewares/auth");
userRouter.post("/signin", login);
userRouter.post("/signup", createUser);
userRouter.get("/me", auth, getCurrentUser);
userRouter.patch("/me", auth, updateProfile);
module.exports = userRouter;
