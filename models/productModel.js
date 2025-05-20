const mongoose = require('mongoose');

// Define the schema for a product
const cabinateSchema = new mongoose.Schema({
    cabinateName: { type: String, required: true },
    cabinateType: { type: String, required: true },
    cabinateImage: { type: String, required: true }, 
    cabinateFrontImage: { type: String, required: true }, 
    minWidth: { type: Number },
    maxWidth: { type: Number },
    minDepth: { type: Number },
    maxDepth: { type: Number },
    hinges: { type: Number },
    handles: { type: Number },
    drawers: { type: Number },
    description: {type: String}
});

const Product = mongoose.model('Cabinates', cabinateSchema);

module.exports = Product;
