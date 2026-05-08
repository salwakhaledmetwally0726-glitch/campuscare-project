require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const issueRoutes = require("./src/routes/issueRoutes");
const workerRoutes = require("./src/routes/workerRoutes");
const managerRoutes = require("./src/routes/managerRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CampusCare backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

module.exports = app;