const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');
const { validateHospital } = require('../utils/validateHospital');
const multer = require('multer');
const { sendSignupEmail } = require('../utils/emailOtp');
//const generateUniqueCode = require('../utils/generateUniqueId'); // Import the utility
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

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF are allowed.'));
    }
  }
});

// Register Hospital
// router.post('/signup', 
//   upload.fields([
//     { name: 'registrationCertificate', maxCount: 1 },
//     { name: 'otherLicense', maxCount: 1 }
//   ]), 
//   async (req, res) => {
    
//     try {

//       console.log("Hospital registration request received:", req.body);
//       const uniqueCode = await generateUniqueCode(Hospital); // Use Hospital model to ensure uniqueness
//       const hospitalData = {
//       hospitalName: req.body.hospitalName,
//       hospitalType: req.body.hospitalType,
//       registrationNumber: req.body.registrationNumber,
//       email: req.body.email,
//       phoneNumber: req.body.phoneNumber,
//       address: req.body.address,
//       city: req.body.city,
//       state: req.body.state,
//       pincode: req.body.pincode,
//       country: req.body.country,
//       adminName: req.body.adminName,
//       adminEmail: req.body.adminEmail,
//       password: req.body.password,
//       uniqueCode: uniqueCode // Use the generated uniqueCode
//     };

//       // Validate hospital data
//       const { error } = validateHospital(hospitalData);
//       if (error) {
//         return res.status(400).json({
//           message: 'Validation error',
//           errors: error.details.map(err => ({
//             field: err.path.join('.'),
//             message: err.message
//           }))
//         });
//       }

//       // Check for existing hospital
//       const existingHospital = await Hospital.findOne({
//         $or: [
//           { 'hospitalInfo.registrationNumber': hospitalData.hospitalInfo.registrationNumber },
//           { 'contactInfo.email': hospitalData.contactInfo.email }
//         ]
//       });

//       if (existingHospital) {
//         return res.status(400).json({
//           message: 'Hospital already registered with this registration number or email'
//         });
//       }

//       // Create new hospital
//       const hospital = new Hospital(hospitalData);
//       await hospital.save();

//       // Create session
//       req.session.hospitalId = hospital._id;

//       res.status(201).json({
//         message: 'Hospital registered successfully',
//         hospital: {
//           id: hospital._id,
//           name: hospital.hospitalInfo.hospitalName,
//           uniqueCode: hospital.uniqueCode,
//           email: hospital.contactInfo.email
//         }
//       });

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         message: 'Server error',
//         error: error.message
//       });
//     }
// });
// In your auth.hospital.js file, update the signup route
router.post('/signup', 
  upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'otherLicense', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      console.log("Hospital registration request received:", req.body);
      
      // Parse the JSON data
      const hospitalData = JSON.parse(req.body.hospitalData);
      const existingHospital = await Hospital.findOne({
        $or: [
          { 'hospitalInfo.registrationNumber': hospitalData.hospitalInfo.registrationNumber },
          { 'contactInfo.email': hospitalData.contactInfo.email },
          { 'contactInfo.phoneNumber': hospitalData.contactInfo.phoneNumber }
        ]
      });

      if (existingHospital) {
        return res.status(400).json({
          message: 'Hospital already registered with this registration number, email, or phone number'
        });
      }
      // Generate unique code
      const uniquecode = await generateUniqueCode(Hospital);
      
      
      // Create hospital object with nested structure
      const hospitalToSave = {
        uniquecode: uniquecode, // ✅ THIS WAS MISSING
        hospitalInfo: {
          hospitalName: hospitalData.hospitalInfo.hospitalName,
          hospitalType: hospitalData.hospitalInfo.hospitalType,
          registrationNumber: hospitalData.hospitalInfo.registrationNumber
        },
        contactInfo: {
          email: hospitalData.contactInfo.email,
          phoneNumber: hospitalData.contactInfo.phoneNumber,
          isEmailVerified: hospitalData.settings.isEmailVerified || false,
          isPhoneVerified: hospitalData.settings.isPhoneVerified || false
        },
        location: {
          fullAddress: hospitalData.location.fullAddress,
          city: hospitalData.location.city,
          state: hospitalData.location.state,
          pincode: hospitalData.location.pincode,
          country: hospitalData.location.country || 'India'
        },
        administrator: {
          fullName: hospitalData.administrator.fullName,
          email: hospitalData.administrator.email,
          password: hospitalData.administrator.password
        },
        documents: {},
        settings: {
          termsAccepted: hospitalData.settings.termsAccepted
        }
      };

      // Add file information if uploaded
      if (req.files && req.files.registrationCertificate) {
        hospitalToSave.documents.registrationCertificate = {
          filename: req.files.registrationCertificate[0].originalname,
          data: req.files.registrationCertificate[0].buffer,
          contentType: req.files.registrationCertificate[0].mimetype
        };
      }
      
      if (req.files && req.files.otherLicense) {
        hospitalToSave.documents.otherLicense = {
          filename: req.files.otherLicense[0].originalname,
          data: req.files.otherLicense[0].buffer,
          contentType: req.files.otherLicense[0].mimetype
        };
      }

      // Check for existing hospital
     
      console.log('Hospital data to save:', {
        uniqueCode: hospitalToSave.uniqueCode,
        email: hospitalToSave.contactInfo.email,
        hospitalName: hospitalToSave.hospitalInfo.hospitalName
      });

      // Create new hospital
      const newhospital = new Hospital(hospitalToSave);
      const savedHospital = await newhospital.save();
     
      // Send signup email
      try {
        await sendSignupEmail(savedHospital.contactInfo.email,  `Your Unique code is : ${savedHospital.uniquecode} .Please keep it safe!`);
        //res.status(201).json({ message: "User created", id: savedHospital._id, uniqueCode: savedHospital.uniqueCode, role: savedHospital.role });
      } catch (err) {
        console.error('Error sending signup email:', err);
      }

      // Return response
      res.status(201).json({
        message: 'Hospital registered successfully',
        id: savedHospital._id,
        uniqueCode: savedHospital.uniquecode,
        hospitalName: savedHospital.hospitalInfo.hospitalName
      });

    } catch (error) {
      console.error('Hospital registration error:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
});
// Additional routes can be added here for OTP verification, login, etc.

module.exports = router;