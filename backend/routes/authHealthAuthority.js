const express = require('express');
const router = express.Router();
const HealthAuthority = require('../models/HealthAuthority');
const multer = require('multer');
const path = require('path');
const { sendSignupEmail } = require('../utils/emailOtp');

// Generate unique code function
async function generateUniqueCode(Model) {
  let isUnique = false;
  let uniqueCode;

  while (!isUnique) {
    uniqueCode = '';
    for (let i = 0; i < 16; i++) {
      uniqueCode += Math.floor(Math.random() * 10);
    }
    const existingRecord = await Model.findOne({ uniqueCode: uniqueCode });
    if (!existingRecord) {
      isUnique = true;
    }
  }
  return uniqueCode;
}

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Register Health Authority
router.post('/register', upload.single('authorizationLetter'), async (req, res) => {
  try {
    console.log("Health Authority registration request received:", req.body);
    
    // Parse JSON data from frontend
    const authorityData = JSON.parse(req.body.authorityData);
    
    // Check for existing health authority
    const existingAuthority = await HealthAuthority.findOne({
      $or: [
        { 'authorityInfo.authorityRegNumber': authorityData.authorityInfo.authorityRegNumber },
        { 'representative.govEmployeeId': authorityData.representative.govEmployeeId },
        { 'representative.email': authorityData.representative.email },
        { 'representative.phone': authorityData.representative.phone }
      ]
    });

    if (existingAuthority) {
      return res.status(400).json({
        message: 'Health Authority already registered with this registration number, employee ID, email, or phone number'
      });
    }

    // Generate unique code
    const uniqueCode = await generateUniqueCode(HealthAuthority);
    console.log('Generated unique code:', uniqueCode);
    
    // Create health authority object
    const authorityToSave = {
      uniqueCode: uniqueCode,
      authorityInfo: {
        authorityName: authorityData.authorityInfo.authorityName,
        jurisdiction: authorityData.authorityInfo.jurisdiction,
        authorityRegNumber: authorityData.authorityInfo.authorityRegNumber,
        officialWebsite: authorityData.authorityInfo.officialWebsite || ''
      },
      representative: {
        fullName: authorityData.representative.fullName,
        title: authorityData.representative.title,
        govEmployeeId: authorityData.representative.govEmployeeId,
        email: authorityData.representative.email,
        phone: authorityData.representative.phone,
        password: authorityData.representative.password,
        isEmailVerified: authorityData.verification.isEmailVerified || false,
        isPhoneVerified: authorityData.verification.isPhoneVerified || false
      },
      compliance: {
        dataUseAgreementAccepted: authorityData.compliance.dataUseAgreementAccepted,
        twoFactorEnabled: authorityData.compliance.twoFactorEnabled
      }
    };

    // Add authorization letter if uploaded
    if (req.file) {
      authorityToSave.compliance.authorizationLetter = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    } else {
      return res.status(400).json({
        message: 'Official authorization letter is required'
      });
    }

    console.log('Health Authority data to save:', {
      uniqueCode: authorityToSave.uniqueCode,
      authorityName: authorityToSave.authorityInfo.authorityName,
      email: authorityToSave.representative.email
    });

    // Create new health authority
    const newAuthority = new HealthAuthority(authorityToSave);
    await newAuthority.save();

    console.log('Health Authority saved successfully with uniqueCode:', newAuthority.uniqueCode);
   
    // Send signup email
    try {
      await sendSignupEmail(
        newAuthority.representative.email,
        `Your Health Authority Unique code is: ${newAuthority.uniqueCode}. Please keep it safe! Your application is under compliance review and will be activated upon successful verification.`
      );
      console.log('Signup email sent successfully');
    } catch (err) {
      console.error('Error sending signup email:', err);
    }

    // Return response
    res.status(201).json({
      message: 'Health Authority registered successfully! Please check your email for your Unique ID. Your application will be reviewed for compliance.',
      authority: {
        uniqueCode: newAuthority.uniqueCode,
        authorityName: newAuthority.authorityInfo.authorityName,
        email: newAuthority.representative.email,
        status: newAuthority.status,
        verificationStatus: newAuthority.verificationStatus
      }
    });

  } catch (error) {
    console.error('Health Authority registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login Health Authority
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const authority = await HealthAuthority.findOne({ 'representative.email': email });
    if (!authority) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (authority.status !== 'active') {
      return res.status(403).json({ 
        message: 'Your account is pending compliance review. Please wait for approval.',
        status: authority.status,
        verificationStatus: authority.verificationStatus
      });
    }

    // Simple password comparison (you should use bcrypt in production)
    if (password !== authority.representative.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      authority: {
        uniqueCode: authority.uniqueCode,
        authorityName: authority.authorityInfo.authorityName,
        email: authority.representative.email,
        status: authority.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;