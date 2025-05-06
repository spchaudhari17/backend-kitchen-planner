// controllers/paymentController.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/transactionModel");
const nodemailer = require("nodemailer");
const { generateUserOrderEmail, generateAdminOrderEmail } = require("../controllers/templates/emailTemplates");
const User = require("../models/user/User");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { userId, amount, products, email } = req.body;

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
        User_email: email, // ✅ Required field added here
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


 
///for only one main admin
// exports.updateTransactionStatus = async (req, res) => {
//   try {
//     const { transaction_id, userId, products } = req.body;

//     const updated = await Transaction.findOneAndUpdate(
//       {
//         transaction_id,
//         user_id: userId,
//       },
//       {
//         transaction_status: "success",
//         products,
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.ADMIN_EMAIL,
//         pass: process.env.ADMIN_PASS,
//       },
//     });

//     // Generate HTML content using templates
//     const userHtml = generateUserOrderEmail(
//       updated.User_email,
//       updated.amount,
//       transaction_id,
//       updated.payment_method,
//       updated.products
//     );

//     const adminHtml = generateAdminOrderEmail(
//       updated.User_email,
//       updated.amount,
//       transaction_id,
//       updated.payment_method,
//       updated.products
//     );

//     // Send to user
//     await transporter.sendMail({
//       from: `"Kitchen Planner" <${process.env.ADMIN_EMAIL}>`,
//       to: updated.User_email,
//       subject: `🧾 Your Kitchen Planner Order Confirmation`,
//       html: userHtml,
//     });

//     // Send to admin
//     await transporter.sendMail({
//       from: `"Kitchen Planner" <${process.env.ADMIN_EMAIL}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: `📦 New Order Received: ${transaction_id}`,
//       html: adminHtml,
//     });

//     return res.status(200).json({ success: true, data: updated });

//   } catch (err) {
//     console.error("Update Transaction Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

//for all admins
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transaction_id, userId, products } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      {
        transaction_id,
        user_id: userId,
      },
      {
        transaction_status: "success",
        products,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

     const buyer = await User.findById(userId);
    if (!buyer) {
      return res.status(404).json({ error: "User not found" });
    }

 
    const admins = await User.find({ role: "admin" });
    const adminEmails = admins.map((admin) => admin.email);

   
    const userHtml = generateUserOrderEmail(
      buyer.email,
      updated.amount,
      transaction_id,
      updated.payment_method,
      updated.products
    );

    const adminHtml = generateAdminOrderEmail(
      buyer.email,
      updated.amount,
      transaction_id,
      updated.payment_method,
      updated.products
    );

 
    await transporter.sendMail({
      from: `"Kitchen Planner" <${process.env.ADMIN_EMAIL}>`,
      to: buyer.email,
      subject: `🧾 Your Kitchen Planner Order Confirmation`,
      html: userHtml,
    });

 
    if (adminEmails.length > 0) {
      await transporter.sendMail({
        from: `"Kitchen Planner" <${process.env.ADMIN_EMAIL}>`,
        to: adminEmails,
        subject: `📦 New Order Received: ${transaction_id}`,
        html: adminHtml,
      });
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


