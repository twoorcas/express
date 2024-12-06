const userRouter = require("express").Router(); // creating a router
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

userRouter.get("/me", auth, getCurrentUser);
userRouter.patch("/me", validateUserUpdate, auth, updateProfile);
module.exports = userRouter;

// According the the HTTP spec,
// GET requests should not include a body in the request payload.
// For that reason, celebrate does not validate the body on GET requests.
