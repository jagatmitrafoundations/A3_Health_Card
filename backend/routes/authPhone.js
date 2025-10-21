// routes/authPhone.js
const express = require('express');
const router = express.Router();
const admin = require('../firebase');
const User = require('../models/User');

async function verifyIdTokenFromHeader(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUid = decoded.uid;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

// Link the signed-in firebase uid (phone user) to a mongo user
router.post('/link', verifyIdTokenFromHeader, async (req, res) => {
  try {
    const { userId } = req.body; // your mongo user id to map to
    const firebaseUid = req.firebaseUid;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    // store mapping
    await User.findByIdAndUpdate(userId, { firebaseUid });
    res.json({ message: 'Linked', firebaseUid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
