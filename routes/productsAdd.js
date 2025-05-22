const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const productController = require("../controllers/productController");

// Ensure 'uploads' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Routes for managing products
router.post("/products", upload.fields([
    { name: 'cabinateImage', maxCount: 1 },
    { name: 'cabinateFrontImage', maxCount: 1 }
]), productController.addProduct); // Add product

router.get("/products", productController.getProducts); // Get all products

router.get("/products/:id", productController.getProductById);


router.put("/products/:id", upload.fields([
    { name: 'cabinateImage', maxCount: 1 },
    { name: 'cabinateFrontImage', maxCount: 1 }
]), productController.updateProduct);

router.delete("/products/:id", productController.deleteProduct); // Delete product

module.exports = router;
