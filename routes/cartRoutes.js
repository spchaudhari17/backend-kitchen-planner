const express = require("express");
const router = express.Router();
const { saveCart , getUserCart } = require("../controllers/cartController");

router.post("/save", saveCart);
router.get("/user/:userId", getUserCart);  

module.exports = router;
