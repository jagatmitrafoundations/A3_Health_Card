const express = require('express');
const router = express.Router();
const MNC = require('../models/MNC');
const { validateMNC } = require('../utils/MNCvalidate');
const { sendSignupEmail } = require('../utils/emailOtp');
const generateUniqueId = require('../utils/generateUniqueId');
const { sendEmail } = require('../utils/emailOtp');

async function generateUniqueCode(Model) {
  let isUnique = false;
  let uniqueCode;

  while (!isUnique) {
    // Generate a random 16-digit numeric code
    uniqueCode = '';
    for (let i = 0; i < 16; i++) {
      uniqueCode += Math.floor(Math.random() * 10); // add one digit (0–9)
    }

    // Check if code exists in database using the correct model
    const existingRecord = await Model.findOne({ uniqueCode });
    if (!existingRecord) {
      isUnique = true;
    }
  }

  return uniqueCode;
}
// Register MNC
// router.post('/register', async (req, res) => {
//   try {
//     // Validate input data
//     const { error } = validateMNC(req.body);
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation error',
//         errors: error.details.map(err => ({
//           field: err.path.join('.'),
//           message: err.message
//         }))
//       });
//     }

//     // Check if MNC already exists
//     const existingMNC = await MNC.findOne({
//       $or: [
//         { 'companyInfo.registrationNumber': req.body.companyInfo.registrationNumber },
//         { 'administrator.adminEmail': req.body.administrator.adminEmail }
//       ]
//     });

//     if (existingMNC) {
//       return res.status(400).json({
//         message: 'Company already registered with this registration number or email'
//       });
//     }

//     // Generate unique ID
//     const uniqueId = generateUniqueId();

//     // Create new MNC
//     const mnc = new MNC({
//       uniqueId,
//       ...req.body,
//       administrator: {
//         ...req.body.administrator,
//         isEmailVerified: true, // Since email is verified during registration
//         isPhoneVerified: true  // Since phone is verified during registration
//       }
//     });

//     await mnc.save();

//     // Send welcome email with UID
//     const emailContent = `
//       Dear ${req.body.administrator.adminName},

//       Thank you for registering with JagatMitra Care. 
//       Your company has been successfully registered.

//       Company Details:
//       Company Name: ${req.body.companyInfo.companyName}
//       Unique ID: ${uniqueId}

//       Please keep this ID safe for future reference.

//       Best regards,
//       JagatMitra Care Team
//     `;

//     await sendEmail({
//       to: req.body.administrator.adminEmail,
//       subject: 'Welcome to JagatMitra Care - Registration Successful',
//       text: emailContent
//     });

//     res.status(201).json({
//       message: 'MNC registered successfully',
//       mnc: {
//         uniqueId: mnc.uniqueId,
//         companyName: mnc.companyInfo.companyName,
//         adminEmail: mnc.administrator.adminEmail
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });

// // Login MNC
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const mnc = await MNC.findOne({ 'administrator.adminEmail': email });
//     if (!mnc) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Simple password comparison (you might want to use bcrypt in production)
//     if (password !== mnc.administrator.password) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     res.json({
//       message: 'Login successful',
//       mnc: {
//         uniqueId: mnc.uniqueId,
//         companyName: mnc.companyInfo.companyName,
//         adminEmail: mnc.administrator.adminEmail
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// MNC Registration
router.post('/register', async (req, res) => {
  try {
    console.log("MNC registration request received:", req.body);
    
    // Extract data from request body
    const { companyInfo, administrator, verification } = req.body;
    
    // Check for existing MNC
    const existingMNC = await MNC.findOne({
      $or: [
        { 'companyInfo.registrationNumber': companyInfo.registrationNumber },
        { 'administrator.adminEmail': administrator.adminEmail },
        { 'administrator.adminPhone': administrator.adminPhone }
      ]
    });

    if (existingMNC) {
      return res.status(400).json({
        message: 'Company already registered with this registration number, email, or phone number'
      });
    }

    // Generate unique code
    const uniqueCode = await generateUniqueCode(MNC);
    console.log('Generated unique code:', uniqueCode);
    
    // Create MNC object with nested structure
    const mncToSave = {
      uniqueCode: uniqueCode,
      companyInfo: {
        companyName: companyInfo.companyName,
        registrationNumber: companyInfo.registrationNumber,
        industry: companyInfo.industry || ''
      },
      administrator: {
        adminName: administrator.adminName,       // ✅ Fixed
  adminEmail: administrator.adminEmail,     // ✅ Fixed
  adminPhone: administrator.adminPhone, 
        password: administrator.password,
        isEmailVerified: verification.isEmailVerified || false,
        isPhoneVerified: verification.isPhoneVerified || false
      }
    };

    console.log('MNC data to save:', {
      uniqueCode: mncToSave.uniqueCode,
      email: mncToSave.administrator.email,
      companyName: mncToSave.companyInfo.companyName
    });

    // Create new MNC
    const newMNC = new MNC(mncToSave);
    const savedMNC = await newMNC.save();

    console.log('MNC saved successfully with uniqueCode:', savedMNC.uniqueCode);
   
    // Send signup email
    try {
      await sendSignupEmail(
        savedMNC.administrator.adminEmail,  
        `Your Company Unique code is: ${savedMNC.uniqueCode}. Please keep it safe!`
      );
      console.log('Signup email sent successfully');
    } catch (err) {
      console.error('Error sending signup email:', err);
      // Don't fail registration if email fails
    }

    // Return response
    res.status(201).json({
      message: 'Corporate registration successful! Please check your email for your Unique ID.',
      uniqueCode: savedMNC.uniqueCode,
      companyName: savedMNC.companyInfo.companyName,
      email: savedMNC.administrator.email
    });

  } catch (error) {
    console.error('MNC registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login MNC
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const mnc = await MNC.findOne({ 'administrator.email': email });
    if (!mnc) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Simple password comparison (you should use bcrypt in production)
    if (password !== mnc.administrator.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      mnc: {
        uniqueCode: mnc.uniqueCode,
        companyName: mnc.companyInfo.companyName,
        email: mnc.administrator.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;