const express = require("express");
const router = express.Router();
const User = require("../models/User"); // your DB model
const sendWelcomeEmail = require("../utils/email");

// Registration route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Save user in DB
    const user = await User.create({ name, email, password });

    // Send welcome email
    await sendWelcomeEmail(user.email);

    res.status(200).json({ message: "Registered successfully, check your email!" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

module.exports = router;
