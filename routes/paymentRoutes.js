// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { createPaymentIntent , updateTransactionStatus,recordBankTransfer } = require("../controllers/paymentController");

router.post("/create-payment-intent", createPaymentIntent);
router.post("/update-transaction", updateTransactionStatus);
router.post("/bank-transfer", recordBankTransfer);

module.exports = router;
