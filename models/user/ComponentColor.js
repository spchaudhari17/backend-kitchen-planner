 

const mongoose = require("mongoose");

const ComponentColorSchema = new mongoose.Schema(
  {
    website_color_combination: {
      type: Boolean,
      default: false,
      required:false
    },
   
  },
  { strict: false, timestamps: true }  
);
module.exports = mongoose.model('ComponentColor', ComponentColorSchema);