// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
