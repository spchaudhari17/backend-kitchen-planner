const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    requests: { 
      type: Number, 
      default: 0 
    },
    otpToken:{
      type:String
    },
    requestDate: Date,
    errorCount: { 
      type: Number, 
      default: 0 
    },
    errorDate: Date,
})

module.exports = otpSchema