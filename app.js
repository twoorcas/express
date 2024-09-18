const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))

  .catch((err) => console.error("Failed to connect to MongoDB", err));
const auth = (req, res, next) => {
  req.user = {
    _id: "66d69c43b406aa6bae74f9f7",
  };
  next();
};
app.use(auth);
// Middleware to parse JSON bodies
app.use(express.json());
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
