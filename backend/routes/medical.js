const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const router = express.Router();

// POST /api/medical/:userId -> create/update
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const caller = req.mongoUser;
    
    if (!caller) return res.status(401).json({ message: 'Not authenticated' });

    const isDoctor = caller.role === 'Doctor';
    if (!isDoctor && caller._id.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: cannot edit this user' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let record = await MedicalRecord.findOne({ user: userId });
    if (record) {
      record.set(req.body);
    } else {
      record = new MedicalRecord({ user: userId, ...req.body });
    }
    await record.save();
    res.json({ message: 'Record saved', record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/medical/:userId -> get record (owner or doctor)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const caller = req.mongoUser;
    if (!caller) return res.status(401).json({ message: 'Not authenticated' });

    const isDoctor = caller.role === 'Doctor';
    if (!isDoctor && caller._id.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const record = await MedicalRecord.findOne({ user: userId });
    if (!record) return res.status(404).json({ message: 'No record found' });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;