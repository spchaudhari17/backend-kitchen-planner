const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, enum: ["card", "bank_transfer"], required: true },
  transaction_type: { type: String, default: "top-up" },
  transaction_id: { type: String }, // Stripe ID or null for bank
  transaction_status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  bank_details: {
    accountNumber: { type: String },
    ifscCode: { type: String }
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
