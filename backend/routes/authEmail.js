// routes/authEmail.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
//const admin = require('../firebase');
const { generateOtp, sendOtpEmail, saveOtp, verifyOtp } = require('../utils/emailOtp');

router.post('/send', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    const key = `email:${user._id.toString()}`;
    saveOtp(key, otp);
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ message: 'userId and otp required' });

    const key = `email:${userId}`;
    const ok = verifyOtp(key, otp);
    if (!ok) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // create Firebase custom token for this user
    //const uid = userId.toString(); // use mongo _id as uid
    //const customToken = await admin.auth().createCustomToken(uid);

    // Optionally store firebaseUid on user document to be explicit:
    //await User.findByIdAndUpdate(userId, { firebaseUid: uid });

    //res.json({ message: 'Verified', customToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
