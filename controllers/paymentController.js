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
 

exports.createBankTransferIntent = async (req, res) => {
  const { userId, amount, email, name } = req.body;

  try {
    const customer = await stripe.customers.create({ email, name });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'aud',
      customer: customer.id,
      payment_method_types: ['au_becs_debit'],
    });

    const newTransaction = new Transaction({
      user_id: userId,
      amount,
      payment_method: "bank_transfer", // ✅ Must match schema enum
      transaction_type: "product-purchase",
      transaction_status: "pending",
      transaction_id: paymentIntent.id, // Store Stripe intent ID
    });

    await newTransaction.save();

    // ✅ Send success only after saving transaction
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe BECS Error:", error);
    res.status(500).json({ error: "Failed to create bank transfer intent" });
  }
};

// controllers/paymentController.js
exports.getPendingTransactions = async (req, res) => {
  try {
    const pendingTransactions = await Transaction.find({
      transaction_status: "pending",
    }).select("user_id transaction_id amount payment_method created_at"); // ✅ use created_at (not createdAt)

    return res.status(200).json({ success: true, data: pendingTransactions });
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    res.status(500).json({ error: "Failed to fetch pending transactions" });
  }
};

