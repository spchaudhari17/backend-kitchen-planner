// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { createPaymentIntent , updateTransactionStatus,createBankTransferIntent, getAllTransactions , getOrderProducts } = require("../controllers/paymentController");

router.post("/create-payment-intent", createPaymentIntent);
router.post("/update-transaction", updateTransactionStatus);
router.post("/bank-transfer", createBankTransferIntent);
router.get("/All-transactions", getAllTransactions );
router.get("/order-products/:transactionId", getOrderProducts);

module.exports = router;
