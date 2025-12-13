// routes/expenses.js
const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/expenses (only user's expenses)
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// POST /api/expenses
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, date, category } = req.body;
    if (!description || amount == null || !date) {
      return res.status(400).json({ error: "Description, amount, and date are required" });
    }
    const expense = await Expense.create({
      userId: req.user.id,
      description,
      amount,
      date: new Date(date),
      category: category || "General",
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const exp = await Expense.findOne({ _id: id, userId: req.user.id });
    if (!exp) return res.status(404).json({ error: "Expense not found" });

    await Expense.deleteOne({ _id: id });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
