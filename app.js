const express = require("express");
const app = express();
const mongoose = require("mongoose");
const indexRouter = require("./routes/index.js");
const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use("/", indexRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
