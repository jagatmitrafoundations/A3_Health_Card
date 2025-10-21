
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Joi = require('joi');
const Otp = require('../models/Otp');

const upload = require('../utils/upload');
const { sendSignupEmail } = require('../utils/emailOtp');
const signupSchema = require('../utils/validateSignup');
//const admin = require('../firebase');
async function generateUniqueCode(User) {
  let isUnique = false;
  let uniqueCode;

  while (!isUnique) {
    // Generate a random 16-digit numeric code
    uniqueCode = '';
    for (let i = 0; i < 16; i++) {
      uniqueCode += Math.floor(Math.random() * 10); // add one digit (0–9)
    }

    // Check if code exists in database
    const existingUser = await User.findOne({ uniqueCode });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return uniqueCode;
}

router.post('/', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'documentFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const body = await req.body;
    const uniqueCode = await generateUniqueCode(User);
    const presentAddress = typeof body.presentAddress === 'string' ? JSON.parse(body.presentAddress) : body.presentAddress;
    const permanentAddress = typeof body.permanentAddress === 'string' ? JSON.parse(body.permanentAddress) : body.permanentAddress;
    const emergencyContacts = typeof body.emergencyContacts === 'string' ? JSON.parse(body.emergencyContacts) : body.emergencyContacts;
    const uniqueId = typeof body.uniqueId === 'string' ? JSON.parse(body.uniqueId) : body.uniqueId;
    const { error, value } = signupSchema.validate({ ...body, presentAddress, permanentAddress, emergencyContacts, uniqueId });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const emailOtp = await Otp.findOne({ email: value.email, verified: true });
   const mobileOtp = await Otp.findOne({ mobile: value.mobile, verified: true });
//    if (!emailOtp || !mobileOtp) {
//   return res.status(400).json({ message: "Please verify both your email and mobile number with OTP first." });
// } else {
//   return res.status(400).json({ message: "Please verify your email and mobile number with OTP first." });
// }
    if (!emailOtp && !mobileOtp) {
      return res.status(400).json({ message: "Please verify your email and mobile number with OTP first." });
    } else if (!emailOtp) {
      return res.status(400).json({ message: "Please verify your email with OTP first." });
    } else if (!mobileOtp) {
      return res.status(400).json({ message: "Please verify your mobile number with OTP first." });
    }

    // Check for a verified OTP record
    // const verifiedOtpRecord = await Otp.findOne({
    //   $or: [{ email: value.email }, { mobile: value.mobile }],
    //   verified: true  
    // });
    // if (!verifiedOtpRecord) {
    //   return res.status(400).json({ message: "Please verify your email or mobile number with OTP first." });
    // }

    const existingUser = await User.findOne({ $or: [{ email: value.email }, { mobile: value.mobile }] });
    if (existingUser) {
        return res.status(409).json({ message: "Email or mobile already exists." });
    }
    const existingId = await User.findOne({
  'uniqueId.number': value.uniqueId.number,
  'uniqueId.country': { $ne: value.uniqueId.country }
});
if (existingId) {
  return res.status(400).json({ message: "This unique ID is already registered for a different country." });
}

    const profileImageFile = req.files['profileImage']?.[0];
    const documentFile = req.files['documentFile']?.[0];
    if (!profileImageFile || !documentFile) {
      return res.status(400).json({ message: "profileImage and documentFile required" });
    }

    let role = 'User';
    if (value.occupation && value.occupation.toLowerCase().includes('doctor')) {
        role = 'Doctor';
    }

    // Create a Firebase user entry and link it to the Mongo user
    // const firebaseUser = await admin.auth().createUser({
    //   email: value.email,
    //   phoneNumber: value.mobile,
    //   displayName: value.name
    // });

    const newUser = new User({
      ...value,
      uniqueCode: uniqueCode,
      presentAddress,
      permanentAddress,
      emergencyContacts,
      profileImage: profileImageFile
        ? { data: profileImageFile.buffer, contentType: profileImageFile.mimetype }
        : undefined,
      document: {
        
        file: documentFile ? {
          data: documentFile.buffer,
          contentType: documentFile.mimetype
        } : undefined
      },
      role
      
    });

    await newUser.save();
    // Otp.findByIdAndDelete(verifiedOtpRecord._id);
    //const uniqueCode = generateUniqueCode();
    
// Create new user with uniqueCode


await newUser.save();

// Send unique code to user's email
await sendSignupEmail(newUser.email,  `Your Unique code is : ${uniqueCode} .Please keep it safe!`);
    res.status(201).json({ message: "User created", id: newUser._id,uniqueCode: newUser.uniqueCode, role: newUser.role });

  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(409).json({ message: "Email or mobile already exists" });
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

module.exports = router;