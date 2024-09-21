const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
