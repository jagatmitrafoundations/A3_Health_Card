
const express = require("express");
const router = express.Router();
const Otp = require("../models/Otp");
const User = require("../models/User");
//const admin = require("../firebase");
const { sendOtpToEmailOrPhone } = require("../utils/otpSender");

// Step 1: Request OTP for pre-signup or login
router.post("/send-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body;
    if (!email && !mobile) return res.status(400).json({ message: "Email or Mobile required" });

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

    // OTP for a new user (pre-signup)
    if (!existingUser) {
        // Prevent sending OTP if email/mobile is already in Otp table and verified
        const existingVerifiedOtp = await Otp.findOne({ $or: [{ email, verified: true }, { mobile, verified: true }] });
        if(existingVerifiedOtp) return res.status(409).json({ message: "A user with this email or mobile is already verified." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ $or: [{ email }, { mobile }] });
    await Otp.create({ email, mobile, otp, type: email ? "email" : "phone" });
    await sendOtpToEmailOrPhone(email, mobile, otp);

    res.json({ message: "OTP sent successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// Step 2: Verify OTP and get Firebase custom token
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;
    if (!otp || (!email && !mobile)) return res.status(400).json({ message: "Email or mobile, and OTP required" });

    const query = email ? { email, otp } : { mobile, otp };
    const otpRecord = await Otp.findOne(query);

    if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

    // If a user exists, log them in. If not, mark OTP for signup.
    const user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (user) {
      // User exists, so this is a login request
      //const firebaseUid = user._id.toString();
      //const customToken = await admin.auth().createCustomToken(firebaseUid);

      // Clean up the OTP after successful login
      await Otp.findByIdAndDelete(otpRecord._id);
      
      // Update firebaseUid on user record
      //await User.findByIdAndUpdate(user._id, { firebaseUid });

      res.json({ message: "Login successful"});
    } else {
      // New user, mark OTP as verified for signup
      otpRecord.verified = true;
      await otpRecord.save();
      res.json({ message: "OTP verified. You can now proceed with signup." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
});

module.exports = router;