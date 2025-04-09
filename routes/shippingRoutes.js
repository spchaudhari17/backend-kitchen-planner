// routes/shippingRoutes.js
const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.post('/shipping', shippingController.addShippingAddress);
router.get('/shipping', shippingController.getShippingAddresses);

module.exports = router;
