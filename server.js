// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Default route (optional: redirect to login page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Connect to MongoDB Atlas
const PORT = process.env.PORT || 4000;

// If you want to hardcode the URI directly (not recommended):
// const MONGO_URI = "mongodb+srv://eskedar_db_user:<db_password>@express.j80dwwu.mongodb.net/?appName=Express";

// Better: use .env file
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  });
