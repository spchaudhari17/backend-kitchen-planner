// controllers/paymentController.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/transactionModel");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { userId, amount, products } = req.body;

    if (!userId || !amount || !products || products.length === 0) {
      return res.status(400).json({ error: "userId, amount and products are required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, //  only allowed fields
      currency: "usd",
      payment_method_types: ["card"],
    });

    if (paymentIntent) {
      const originalAmount = paymentIntent.amount / 100;

      // 👉 Save products in your Transaction model
      const newTransaction = new Transaction({
        user_id: userId,
        amount: originalAmount,
        payment_method: "card",
        transaction_type: "product-purchase",
        transaction_id: paymentIntent.id,
        transaction_status: "pending",
        products: products, 
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
    const { transaction_id, userId, products } = req.body; 

    const updated = await Transaction.findOneAndUpdate(
      {
        transaction_id: transaction_id,
        user_id: userId,
      },
      {
        transaction_status: "success",
        products: products,   
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
      amount: Math.round(amount * 100), 
      currency: 'aud',
      customer: customer.id,
      payment_method_types: ['au_becs_debit'],
    });

    const newTransaction = new Transaction({
      user_id: userId,
      User_email: email,
      amount,
      payment_method: "bank_transfer",  
      transaction_type: "product-purchase",
      transaction_status: "pending",
      transaction_id: paymentIntent.id,  
    });

    await newTransaction.save();

   
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe BECS Error:", error);
    res.status(500).json({ error: "Failed to create bank transfer intent" });
  }
};

 
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
    .populate('user_id', 'email')
      .select("user_id transaction_id amount payment_method created_at transaction_status");

    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
 
 
exports.getOrderProducts = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId).select("products transaction_status");

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.transaction_status !== "success") {
      return res.status(400).json({ success: false, message: "Payment not completed. Cannot show products." });
    }

    return res.status(200).json({ success: true, data: transaction.products || [] });

  } catch (error) {
    console.error("Error fetching order products:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch order products" });
  }
};


