// controllers/shippingController.js
const ShippingAddress = require('../models/shippingModel');

// Add a new address
const addShippingAddress = async (req, res) => {
    try {
        const newAddress = new ShippingAddress(req.body);
        await newAddress.save();
        res.status(201).json({ message: 'Shipping address saved!', address: newAddress });
    } catch (err) {
        res.status(500).json({ message: 'Error saving address', error: err.message });
    }
};

// Get all saved addresses
const getShippingAddresses = async (req, res) => {
    try {
        const addresses = await ShippingAddress.find();
        res.status(200).json(addresses);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching addresses', error: err.message });
    }
};

module.exports = { addShippingAddress, getShippingAddresses };
