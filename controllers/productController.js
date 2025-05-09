const Product = require('../models/productModel');

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { 
            cabinateName, 
            cabinateType,
            minWidth,
            maxWidth,
            minDepth,
            maxDepth,
            hinges,
            handles,
            drawers
        } = req.body;
        
        // Check if both images are uploaded
        if (!req.files || !req.files['cabinateImage'] || !req.files['cabinateFrontImage']) {
            return res.status(400).json({ message: 'Both top view and front view images are required' });
        }

        const newProduct = new Product({
            cabinateName,
            cabinateType,
            cabinateImage: req.files['cabinateImage'][0].path,
            cabinateFrontImage: req.files['cabinateFrontImage'][0].path,
            minWidth,
            maxWidth,
            minDepth,
            maxDepth,
            hinges,
            handles,
            drawers
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding product', error: err.message });
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        
        const updatedProducts = products.map(product => {
            const productObj = product.toObject(); // Convert Mongoose document to plain object
            
            return {
                ...productObj,
                cabinateImage: productObj.cabinateImage 
                    ? `${process.env.SERVER_URL}/${productObj.cabinateImage.replace(/\\/g, "/")}`
                    : null,
                cabinateFrontImage: productObj.cabinateFrontImage 
                    ? `${process.env.SERVER_URL}/${productObj.cabinateFrontImage.replace(/\\/g, "/")}`
                    : null
            };
        });

        res.status(200).json(updatedProducts);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error retrieving products', 
            error: err.message 
        });
    }
};
    
// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { cabinateName, cabinateType } = req.body;
        const cabinateImage = req.file ? req.file.path : null;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { cabinateName, cabinateType, cabinateImage },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
};

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
