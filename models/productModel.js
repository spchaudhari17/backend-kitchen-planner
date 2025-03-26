const mongoose = require('mongoose');

// Define the schema for a product
const cabinateSchema = new mongoose.Schema({
    cabinateName: { type: String, required: true },
    cabinateType: { type: String, required: true },
    cabinateImage: { type: String, required: true }
});

const Product = mongoose.model('Cabinates', cabinateSchema);

module.exports = Product;
