const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;
const cors = require("cors");
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))

  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(auth);
// Middleware to parse JSON bodies
app.use(express.json());
app.use("/", indexRouter);

app.use(cors());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
