// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // make sure you have a User model defined

const router = express.Router();

/**
 * REGISTER
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

/**
 * RESET PASSWORD
 * POST /api/auth/reset-password
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
