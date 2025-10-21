// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  mobile: String,
  otp: String,
  type: { type: String, enum: ['email','phone'], required: true },
  verified: { type: Boolean, default: false }, // mark when OTP verified
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires in 5 min
});

module.exports = mongoose.model("Otp", otpSchema);
