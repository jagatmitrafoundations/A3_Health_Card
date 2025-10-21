const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { validateDoctor } = require('../utils/Doctorvalidation');
const generateUniqueId = require('../utils/generateUniqueId');
const { sendEmail } = require('../utils/emailOtp');
const { sendSignupEmail } = require('../utils/emailOtp');
const multer = require('multer');
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
// Configure multer for file uploads
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

// Register Doctor
router.post('/register', 
  upload.fields([
    { name: 'licenseFile', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      console.log("Doctor registration request received:", req.body);
      
      // Parse JSON data from frontend
      const doctorData = JSON.parse(req.body.doctorData);
      
      // Generate unique code
      const uniquecode = await generateUniqueCode(Doctor);
      const doctorToSave = {
        uniquecode:uniquecode, // Use correct field name
        personalInfo: doctorData.personalInfo,
        professionalInfo: doctorData.professionalInfo,
        documents: {},
        authentication: {
          password: doctorData.credentials.password
        },
        consent: doctorData.settings.termsAccepted
      };
       if (req.files && req.files.licenseFile) {
        doctorToSave.documents.licenseFile = {
          data: req.files.licenseFile[0].buffer,
          contentType: req.files.licenseFile[0].mimetype
        };
      }
      
      if (req.files && req.files.profilePhoto) {
        doctorToSave.documents.profilePhoto = {
          data: req.files.profilePhoto[0].buffer,
          contentType: req.files.profilePhoto[0].mimetype
        };
      }

      // // Validate doctor data
      // const { error } = validateDoctor(doctorData);
      // if (error) {
      //   return res.status(400).json({
      //     message: 'Validation error',
      //     errors: error.details.map(err => ({
      //       field: err.path.join('.'),
      //       message: err.message
      //     }))
      //   });
      // }
      // Change this part in your authDoctor.js file:
const existingDoctor = await Doctor.findOne({
  $or: [
    { 'personalInfo.email': doctorData.personalInfo.email },
    { 'personalInfo.phoneNumber': doctorData.personalInfo.phoneNumber },
    { 'professionalInfo.licenseNumber': doctorData.professionalInfo.licenseNumber }
  ]
});

if (existingDoctor) {
  return res.status(400).json({
    message: 'Doctor already registered with this email, phone number, or license number'
  });
}
      

      // Create new doctor
      const newdoctor = new Doctor(doctorToSave);
      await newdoctor.save();

      // Send welcome email with UID
      try {
        await sendSignupEmail(newdoctor.personalInfo.email,  `Your Unique code is : ${newdoctor.uniquecode} .Please keep it safe!`);
       
      } catch (err) {
        console.error('Error sending signup email:', err);
      }

      res.status(201).json({
        message: 'Registration successful! Please check your email for your Unique ID.',
        doctor: {
          
          uniqueCode: newdoctor.uniquecode,
          fullName: newdoctor.personalInfo.fullName,
          email: newdoctor.personalInfo.email,
          specialization: newdoctor.professionalInfo.specialization
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
});

module.exports = router;