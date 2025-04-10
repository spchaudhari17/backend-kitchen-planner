// controllers/paymentController.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/transactionModel");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "userId and amount are required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    if (paymentIntent) {
      const originalAmount = paymentIntent.amount / 100;

      const newTransaction = new Transaction({
        user_id: userId,
        amount: originalAmount,
        payment_method: "card",
        transaction_type: "product-purchase",
        transaction_id: paymentIntent.id,
      
        transaction_status: "pending",
      });

      const savedTransaction = await newTransaction.save();

      return res.status(200).json({
        success: true,
        data: paymentIntent.client_secret,
        transaction_id: savedTransaction._id,
      });
    }
  } catch (error) {
    console.error("Stripe createPaymentIntent error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transaction_id, userId } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      {
        transaction_id: transaction_id,  
        user_id: userId,
      },
      {
        transaction_status: "success",
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Transaction Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.recordBankTransfer = async (req, res) => {
  const { userId, amount, accountNumber, ifscCode } = req.body;

  if (!userId || !amount || !accountNumber || !ifscCode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newTransaction = new Transaction({
      user_id: userId,
      amount,
      payment_method: "bank_transfer",
      transaction_type: "product-purchase",
      transaction_status: "pending", // pending until admin manually approves
      bank_details: {
        accountNumber,
        ifscCode
      }
    });

    const savedTransaction = await newTransaction.save();

    return res.status(201).json({
      success: true,
      message: "Bank transfer recorded. Awaiting verification.",
      transaction_id: savedTransaction._id
    });
  } catch (error) {
    console.error("Error recording bank transfer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};