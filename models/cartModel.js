const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // ✅ Make sure you have a User model
    required: true,
  },
  width: Number,
  depth: Number,
  description: String,
  subdescription: String,
  notes: Object,
  droppedItems: [
    {
      id: String,
      name: String,
      imageSrc: String,
      x: Number,
      y: Number,
      rotation: Number,
      width: Number,
      height: Number,
      basePrice: { type: String },
      minWidth: { type: String },
      maxWidth: { type: String },
      hinges: { type: Number },
      handles: { type: Number },
      drawers: { type: Number },
      cabinateType: { type: String },
      overlap: { type: Number },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
