const express = require('express');
const router = express.Router();

// Import all models
const User = require('../models/User');
const Hospital = require('../models/hospital');
const Doctor = require('../models/Doctor');
const Pharmacy = require('../models/pharmacy');
const Insurance = require('../models/Insurance');
const MNC = require('../models/MNC');
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');
const HealthAuthority = require('../models/HealthAuthority');

// A map to easily access the correct model and its unique code field
const models = {
  user: { model: User, uniqueCodeField: 'uniqueCode' },
  hospital: { model: Hospital, uniqueCodeField: 'uniquecode' },
  doctor: { model: Doctor, uniqueCodeField: 'uniquecode' },
  pharmacy: { model: Pharmacy, uniqueCodeField: 'uniqueCode' },
  insurance: { model: Insurance, uniqueCodeField: 'uniqueCode' },
  mnc: { model: MNC, uniqueCodeField: 'uniqueCode' },
  admin: { model: Admin, uniqueCodeField: 'uniqueCode' },
  superadmin: { model: SuperAdmin, uniqueCodeField: 'uniqueCode' },
  healthauthority: { model: HealthAuthority, uniqueCodeField: 'uniqueCode' },
};

router.get('/', async (req, res) => {
  const { uniqueCode, userType } = req.query;

  if (!uniqueCode || !userType) {
    return res.status(400).json({ message: 'uniqueCode and userType are required query parameters.' });
  }

  const config = models[userType.toLowerCase()];

  if (!config) {
    return res.status(404).json({ message: 'Invalid userType specified.' });
  }

  try {
    // Fetch the user data and convert it to a plain object
    const user = await config.model.findOne({ [config.uniqueCodeField]: uniqueCode }).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Remove sensitive data before sending it to the frontend
    if (user.password) delete user.password;
    if (user.authentication?.password) delete user.authentication.password;
    if (user.administrator?.password) delete user.administrator.password;
    if (user.credentials?.password) delete user.credentials.password;
    if (user.representative?.password) delete user.representative.password;
    if (user.authorization?.masterKey) delete user.authorization.masterKey;
    
    // Also remove file buffer data to avoid sending large binary files
    if (user.documents) {
        for (const doc in user.documents) {
            if (user.documents[doc] && user.documents[doc].data) {
                delete user.documents[doc].data;
            }
        }
    }
     if (user.profileImage?.data) delete user.profileImage.data;


    res.json({ success: true, user });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile data.' });
  }
});

module.exports = router;