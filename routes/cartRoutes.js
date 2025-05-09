const express = require("express");
const router = express.Router();
const { saveCart , getUserCart , deleteCartItem} = require("../controllers/cartController");

router.post("/save", saveCart);
router.get("/user/:userId", getUserCart);  
router.delete('/:userId/:itemId', deleteCartItem);


module.exports = router;
