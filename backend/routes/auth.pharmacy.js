const express = require('express');
const router = express.Router();
const PharmacyPartner = require('../models/pharmacy');
const generateUniqueId = require('../utils/generateUniqueId');
const validatePharmacy = require('../utils/validatePharmacy');
const multer = require('multer');
const path = require('path');
const { sendEmail } = require('../utils/emailOtp');
const { sendSignupEmail } = require('../utils/emailOtp');

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

// Register Pharmacy Partner
router.post('/register', upload.single('drugLicenseFile'), async (req, res) => {
  try {
    console.log("Pharmacy registration request received:", req.body);
    
    // Parse JSON data from frontend
    const pharmacyData = JSON.parse(req.body.pharmacyData);
    
    // Check for existing pharmacy
    const existingPharmacy = await PharmacyPartner.findOne({
      $or: [
        { 'pharmacyInfo.drugLicenseNumber': pharmacyData.pharmacyInfo.drugLicenseNumber },
        { 'administrator.workEmail': pharmacyData.administrator.workEmail },
        { 'administrator.contactPhone': pharmacyData.administrator.contactPhone }
      ]
    });

    if (existingPharmacy) {
      return res.status(400).json({
        message: 'Pharmacy already registered with this license number, email, or phone number'
      });
    }

    // Generate unique code
    const uniqueCode = await generateUniqueCode(PharmacyPartner);
    console.log('Generated unique code:', uniqueCode);
    
    // Create pharmacy object
    const pharmacyToSave = {
      uniqueCode: uniqueCode,
      pharmacyInfo: {
        pharmacyName: pharmacyData.pharmacyInfo.pharmacyName,
        drugLicenseNumber: pharmacyData.pharmacyInfo.drugLicenseNumber,
        gstin: pharmacyData.pharmacyInfo.gstin
      },
      officialAddress: {
        fullAddress: pharmacyData.officialAddress.fullAddress,
        city: pharmacyData.officialAddress.city,
        state: pharmacyData.officialAddress.state,
        pincode: pharmacyData.officialAddress.pincode
      },
      administrator: {
        fullName: pharmacyData.administrator.fullName,
        workEmail: pharmacyData.administrator.workEmail,
        contactPhone: pharmacyData.administrator.contactPhone,
        password: pharmacyData.administrator.password,
        isEmailVerified: pharmacyData.verification.isEmailVerified || false,
        isPhoneVerified: pharmacyData.verification.isPhoneVerified || false
      },
      compliance: {
        drugLicenseFile: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        },
        twoFactorEnabled: pharmacyData.compliance.twoFactorEnabled,
        termsAccepted: pharmacyData.compliance.termsAccepted
      }
    };

    console.log('Pharmacy data to save:', {
      uniqueCode: pharmacyToSave.uniqueCode,
      pharmacyName: pharmacyToSave.pharmacyInfo.pharmacyName,
      workEmail: pharmacyToSave.administrator.workEmail
    });

    // Create new pharmacy partner
    const newPharmacy = new PharmacyPartner(pharmacyToSave);
    await newPharmacy.save();

    console.log('Pharmacy saved successfully with uniqueCode:', newPharmacy.uniqueCode);
   
    // Send signup email
    try {
      await sendSignupEmail(
        newPharmacy.administrator.workEmail,
        `Your Pharmacy Unique code is: ${newPharmacy.uniqueCode}. Please keep it safe!`
      );
      console.log('Signup email sent successfully');
    } catch (err) {
      console.error('Error sending signup email:', err);
    }

    // Return response
    res.status(201).json({
      message: 'Pharmacy registered successfully! Please check your email for your Unique ID.',
      pharmacy: {
        uniqueCode: newPharmacy.uniqueCode,
        pharmacyName: newPharmacy.pharmacyInfo.pharmacyName,
        email: newPharmacy.administrator.workEmail
      }
    });

  } catch (error) {
    console.error('Pharmacy registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// router.post('/register', upload.single('drugLicenseFile'), async (req, res) => {
//   try {
//     // Prepare data for validation
//     const uniqueId = generateUniqueId();
//     const pharmacyData = {
//       uniqueId,
//       pharmacyInfo: {
//         pharmacyName: req.body.pharmacyName,
//         drugLicenseNumber: req.body.drugLicenseNumber,
//         gstin: req.body.gstin
//       },
//       officialAddress: {
//         fullAddress: req.body.fullAddress,
//         city: req.body.city,
//         state: req.body.state,
//         pincode: req.body.pincode
//       },
//       administrator: {
//         fullName: req.body.fullName,
//         workEmail: req.body.workEmail,
//         contactPhone: req.body.contactPhone,
//         password: req.body.password
//       },
//       compliance: {
//         drugLicenseFile: {
//           data: req.file.buffer,
//           contentType: req.file.mimetype
//         },
//         termsAccepted: req.body.termsAccepted === 'true'
//       }
//     };
    
//     // Validate pharmacy data
//     const { error } = validatePharmacy(pharmacyData);
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation error',
//         errors: error.details.map(err => ({
//           field: err.path.join('.'),
//           message: err.message
//         }))
//       });
//     }

//     // Check if pharmacy already exists
//     const existingPharmacy = await PharmacyPartner.findOne({
//       $or: [
//         { 'pharmacyInfo.drugLicenseNumber': pharmacyData.pharmacyInfo.drugLicenseNumber },
//         { 'administrator.workEmail': pharmacyData.administrator.workEmail }
//       ]
//     });

//     if (existingPharmacy) {
//       return res.status(400).json({
//         message: 'Pharmacy already registered with this license number or email'
//       });
//     }

//     // Create new pharmacy partner
//     const pharmacyPartner = new PharmacyPartner({
//       ...pharmacyData
//     });

//     await pharmacyPartner.save();
//     const emailContent = `
//       Dear ${pharmacyData.administrator.fullName},

//       Thank you for registering with JagatMitra Care. 
//       Your pharmacy has been successfully registered.

//       Pharmacy Details:
//       Unique ID: ${pharmacyData.uniqueId}
//       Pharmacy Name: ${pharmacyData.pharmacyInfo.pharmacyName}

//       Please keep this ID safe for future reference.

//       Best regards,
//       JagatMitra Care Team
//     `;

//     await sendEmail({
//       to: pharmacyData.administrator.workEmail,
//       subject: 'Welcome to JagatMitra Care - Registration Successful',
//       text: emailContent
//     });
//     // Create session
//     req.session.pharmacyId = pharmacyPartner._id;

//     res.status(201).json({
//       message: 'Pharmacy registered successfully',
//       pharmacy: {
//         uniqueId: pharmacyPartner.uniqueId,
//         pharmacyName: pharmacyPartner.pharmacyInfo.pharmacyName,
//         email: pharmacyPartner.administrator.workEmail
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

// // Update Pharmacy Profile
// router.put('/profile', checkSession, upload.single('drugLicenseFile'), async (req, res) => {
//   try {
//     const pharmacyPartner = await PharmacyPartner.findById(req.session.pharmacyId);

//     if (!pharmacyPartner) {
//       return res.status(404).json({ message: 'Pharmacy not found' });
//     }

//     // Prepare update data
//     const updateData = {
//       pharmacyInfo: req.body.pharmacyInfo ? JSON.parse(req.body.pharmacyInfo) : undefined,
//       officialAddress: req.body.officialAddress ? JSON.parse(req.body.officialAddress) : undefined,
//       administrator: req.body.administrator ? JSON.parse(req.body.administrator) : undefined,
//       compliance: {
//         ...(req.body.compliance ? JSON.parse(req.body.compliance) : {}),
//         ...(req.file ? {
//           drugLicenseFile: {
//             data: req.file.buffer,
//             contentType: req.file.mimetype
//           }
//         } : {})
//       }
//     };

//     // Validate update data
//     if (Object.keys(updateData).length > 0) {
//       const { error } = validatePharmacy({
//         ...pharmacyPartner.toObject(),
//         ...updateData
//       });

//       if (error) {
//         return res.status(400).json({
//           message: 'Validation error',
//           errors: error.details.map(err => ({
//             field: err.path.join('.'),
//             message: err.message
//           }))
//         });
//       }
//     }

//     // Apply updates
//     if (updateData.pharmacyInfo) {
//       Object.assign(pharmacyPartner.pharmacyInfo, updateData.pharmacyInfo);
//     }
    
//     if (updateData.officialAddress) {
//       Object.assign(pharmacyPartner.officialAddress, updateData.officialAddress);
//     }
    
//     if (updateData.administrator) {
//       const adminUpdates = { ...updateData.administrator };
//       delete adminUpdates.passwordHash;
//       Object.assign(pharmacyPartner.administrator, adminUpdates);
//     }

//     if (req.file) {
//       pharmacyPartner.compliance.drugLicenseFile = {
//         data: req.file.buffer,
//         contentType: req.file.mimetype
//       };
//     }

//     await pharmacyPartner.save();
    
//     res.json({
//       message: 'Profile updated successfully',
//       pharmacy: pharmacyPartner
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// Login Pharmacy Partner
// router.post('/login', async (req, res) => {
//   try {
//     const { workEmail, password } = req.body;

//     // Find pharmacy by email
//     const pharmacyPartner = await PharmacyPartner.findOne({
//       'administrator.workEmail': workEmail
//     });

//     if (!pharmacyPartner) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Simple password comparison
//     if (password !== pharmacyPartner.administrator.passwordHash) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Create session
//     req.session.pharmacyId = pharmacyPartner._id;

//     res.json({
//       message: 'Login successful',
//       pharmacy: {
//         id: pharmacyPartner._id,
//         pharmacyName: pharmacyPartner.pharmacyInfo.pharmacyName,
//         email: pharmacyPartner.administrator.workEmail
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Middleware to check session
// const checkSession = (req, res, next) => {
//   if (!req.session.pharmacyId) {
//     return res.status(401).json({ message: 'Please login first' });
//   }
//   next();
// };

// Get Pharmacy Profile
// router.get('/profile', async (req, res) => {
//   try {
//     const pharmacyPartner = await PharmacyPartner.findById(req.session.pharmacyId)
//       .select('-administrator.passwordHash -compliance.drugLicenseFile');

//     if (!pharmacyPartner) {
//       return res.status(404).json({ message: 'Pharmacy not found' });
//     }

//     res.json({ pharmacy: pharmacyPartner });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Update Pharmacy Profile
// router.put('/profile', upload.single('drugLicenseFile'), async (req, res) => {
//   try {
//     const pharmacyPartner = await PharmacyPartner.findById(req.session.pharmacyId);

//     if (!pharmacyPartner) {
//       return res.status(404).json({ message: 'Pharmacy not found' });
//     }

//     // Update allowed fields
//     const updates = req.body;
    
//     if (updates.pharmacyInfo) {
//       Object.assign(pharmacyPartner.pharmacyInfo, updates.pharmacyInfo);
//     }
    
//     if (updates.officialAddress) {
//       Object.assign(pharmacyPartner.officialAddress, updates.officialAddress);
//     }
    
//     if (updates.administrator) {
//       const adminUpdates = { ...updates.administrator };
//       delete adminUpdates.passwordHash;
//       Object.assign(pharmacyPartner.administrator, adminUpdates);
//     }

//     // Update license file if provided
//     if (req.file) {
//       pharmacyPartner.compliance.drugLicenseFile = {
//         data: req.file.buffer,
//         contentType: req.file.mimetype
//       };
//     }

//     await pharmacyPartner.save();
    
//     res.json({
//       message: 'Profile updated successfully',
//       pharmacy: pharmacyPartner
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Logout
// router.post('/logout', (req, res) => {
//   req.session.destroy();
//   res.json({ message: 'Logged out successfully' });
// });

module.exports = router;