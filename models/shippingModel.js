// models/shippingModel.js
const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    company: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    region: String,
    postalCode: String,
    phone: String,
    receiveUpdates: Boolean,
});

const ShippingAddress = mongoose.model('ShippingAddress', shippingSchema);

module.exports = ShippingAddress;
