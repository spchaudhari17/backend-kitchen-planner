const Cart = require("../models/cartModel");

exports.saveCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    return res.status(201).json({ success: true, message: "Cart saved successfully" });
  } catch (error) {
    console.error("Save Cart Error:", error);
    return res.status(500).json({ success: false, error: "Failed to save cart" });
  }
};


exports.getUserCart = async (req, res) => {
    try {
      const userId = req.params.userId;
      const cart = await Cart.find({ user_id: userId });
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      console.error("Fetch Cart Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };