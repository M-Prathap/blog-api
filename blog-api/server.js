const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

// Route Middlewares
app.use("/api/user", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
