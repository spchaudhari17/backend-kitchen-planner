const Product = require('../models/productModel');

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { cabinateName, cabinateType} = req.body;
        const cabinateImage = req.file ? req.file.path : null;

        console.log("cabinateImage", cabinateName)

        const newProduct = new Product({
            cabinateName,
            cabinateType,
            cabinateImage
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

        const updatedProducts = products.map(product => ({
            ...product._doc,
            cabinateImage: product.cabinateImage 
                ? `http://localhost:3001/${product.cabinateImage.replace(/\\/g, "/")}`
                : null
        }));
        res.status(200).json(updatedProducts);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving products', error: err.message });
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
