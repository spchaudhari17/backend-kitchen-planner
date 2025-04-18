// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { createPaymentIntent , updateTransactionStatus,createBankTransferIntent, getPendingTransactions } = require("../controllers/paymentController");

router.post("/create-payment-intent", createPaymentIntent);
router.post("/update-transaction", updateTransactionStatus);
router.post("/bank-transfer", createBankTransferIntent);
router.get("/pending-transactions", getPendingTransactions);

module.exports = router;
