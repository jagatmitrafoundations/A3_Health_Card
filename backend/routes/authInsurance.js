const express = require('express');
const router = express.Router();
const Insurance = require('../models/Insurance');
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

// Register Insurance Company
router.post('/register', upload.single('licenseUpload'), async (req, res) => {
  try {
    console.log("Insurance company registration request received:", req.body);
    
    // Parse JSON data from frontend
    const insuranceData = JSON.parse(req.body.insuranceData);
    
    // Check for existing insurance company
    const existingInsurance = await Insurance.findOne({
      $or: [
        { 'companyInfo.irdaiNumber': insuranceData.companyInfo.irdaiNumber },
        { 'companyInfo.cin': insuranceData.companyInfo.cin },
        { 'administrator.email': insuranceData.administrator.email },
        { 'administrator.phone': insuranceData.administrator.phone }
      ]
    });

    if (existingInsurance) {
      return res.status(400).json({
        message: 'Insurance company already registered with this IRDAI number, CIN, email, or phone number'
      });
    }

    // Generate unique code
    const uniqueCode = await generateUniqueCode(Insurance);
    console.log('Generated unique code:', uniqueCode);
    
    // Create insurance company object
    const insuranceToSave = {
      uniqueCode: uniqueCode,
      companyInfo: {
        companyName: insuranceData.companyInfo.companyName,
        irdaiNumber: insuranceData.companyInfo.irdaiNumber,
        cin: insuranceData.companyInfo.cin,
        officialWebsite: insuranceData.companyInfo.officialWebsite || ''
      },
      administrator: {
        fullName: insuranceData.administrator.fullName,
        title: insuranceData.administrator.title || '',
        email: insuranceData.administrator.email,
        phone: insuranceData.administrator.phone,
        password: insuranceData.administrator.password,
        isEmailVerified: insuranceData.verification.isEmailVerified || false,
        isPhoneVerified: insuranceData.verification.isPhoneVerified || false
      },
      compliance: {
        baaAgreementAccepted: insuranceData.compliance.baaAgreementAccepted,
        twoFactorEnabled: insuranceData.compliance.twoFactorEnabled
      }
    };

    // Add license document if uploaded
    if (req.file) {
      insuranceToSave.compliance.licenseDocument = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    console.log('Insurance data to save:', {
      uniqueCode: insuranceToSave.uniqueCode,
      companyName: insuranceToSave.companyInfo.companyName,
      email: insuranceToSave.administrator.email
    });

    // Create new insurance company
    const newInsurance = new Insurance(insuranceToSave);
    await newInsurance.save();

    console.log('Insurance company saved successfully with uniqueCode:', newInsurance.uniqueCode);
   
    // Send signup email
    try {
      await sendSignupEmail(
        newInsurance.administrator.email,
        `Your Insurance Company Unique code is: ${newInsurance.uniqueCode}. Please keep it safe! Your application is under compliance review.`
      );
      console.log('Signup email sent successfully');
    } catch (err) {
      console.error('Error sending signup email:', err);
    }

    // Return response
    res.status(201).json({
      message: 'Insurance company registered successfully! Please check your email for your Unique ID. Your application will be reviewed for compliance.',
      insurance: {
        uniqueCode: newInsurance.uniqueCode,
        companyName: newInsurance.companyInfo.companyName,
        email: newInsurance.administrator.email,
        status: newInsurance.status
      }
    });

  } catch (error) {
    console.error('Insurance company registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login Insurance Company
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const insurance = await Insurance.findOne({ 'administrator.email': email });
    if (!insurance) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (insurance.status !== 'active') {
      return res.status(403).json({ 
        message: 'Your account is pending compliance review. Please wait for approval.',
        status: insurance.status
      });
    }

    // Simple password comparison (you should use bcrypt in production)
    if (password !== insurance.administrator.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      insurance: {
        uniqueCode: insurance.uniqueCode,
        companyName: insurance.companyInfo.companyName,
        email: insurance.administrator.email,
        status: insurance.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;