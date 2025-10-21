const express = require('express');
const router = express.Router();
const Otp = require('../models/Otp');
const { sendOtpToEmailOrPhone } = require('../utils/otpSender');

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

// Helper function to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to get nested values from an object
function getValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Step 1: Validate credentials and send OTPs
router.post('/unified-login', async (req, res) => {
  try {
    const { uniqueCode, password } = req.body;
    
    if (!uniqueCode || !password) {
      return res.status(400).json({ message: 'Unique code and password are required' });
    }

    console.log(`ðŸ” LOGIN-STEP-1: Validating credentials for code: ${uniqueCode}`);
    
    const modelConfigs = [
      { model: User, type: 'user', uniqueCodeField: 'uniqueCode', passwordField: 'password', nameField: 'name', emailField: 'email', phoneField: 'mobile' },
      { model: Hospital, type: 'hospital', uniqueCodeField: 'uniquecode', passwordField: 'administrator.password', nameField: 'hospitalInfo.hospitalName', emailField: 'contactInfo.email', phoneField: 'contactInfo.phoneNumber' },
      { model: Doctor, type: 'doctor', uniqueCodeField: 'uniquecode', passwordField: 'authentication.password', nameField: 'personalInfo.fullName', emailField: 'personalInfo.email', phoneField: 'personalInfo.phoneNumber' },
      { model: Pharmacy, type: 'pharmacy', uniqueCodeField: 'uniqueCode', passwordField: 'administrator.password', nameField: 'pharmacyInfo.pharmacyName', emailField: 'administrator.workEmail', phoneField: 'administrator.contactPhone' },
      { model: Insurance, type: 'insurance', uniqueCodeField: 'uniqueCode', passwordField: 'administrator.password', nameField: 'companyInfo.companyName', emailField: 'administrator.email', phoneField: 'administrator.phone' },
      { model: MNC, type: 'mnc', uniqueCodeField: 'uniqueCode', passwordField: 'administrator.password', nameField: 'companyInfo.companyName', emailField: 'administrator.adminEmail', phoneField: 'administrator.adminPhone' },
      { model: Admin, type: 'admin', uniqueCodeField: 'uniqueCode', passwordField: 'credentials.password', nameField: 'identity.fullName', emailField: 'credentials.adminEmail', phoneField: 'credentials.adminPhone' },
      { model: SuperAdmin, type: 'superadmin', uniqueCodeField: 'uniqueCode', passwordField: 'credentials.password', nameField: 'identity.fullName', emailField: 'credentials.adminEmail', phoneField: 'credentials.adminPhone' },
      { model: HealthAuthority, type: 'healthauthority', uniqueCodeField: 'uniqueCode', passwordField: 'representative.password', nameField: 'authorityInfo.authorityName', emailField: 'representative.email', phoneField: 'representative.phone' }
    ];

    let foundUser = null;
    let userType = null;
    let userConfig = null;

    for (const config of modelConfigs) {
      const user = await config.model.findOne({ [config.uniqueCodeField]: uniqueCode });
      if (user) {
        let userPassword = getValue(user, config.passwordField);
        if (userPassword && password === userPassword) {
          foundUser = user;
          userType = config.type;
          userConfig = config;
          break;
        }
      }
    }

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid unique code or password' });
    }

    const email = getValue(foundUser, userConfig.emailField);
    const phone = getValue(foundUser, userConfig.phoneField);
    
    if (!email || !phone) {
      return res.status(400).json({ message: 'User profile is incomplete and cannot be secured with 2FA. Please contact support.' });
    }

    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();

    await Otp.deleteMany({ $or: [{ email }, { mobile: phone }] });
    await Otp.create({ email, otp: emailOtp, type: 'email' });
    await Otp.create({ mobile: phone, otp: phoneOtp, type: 'phone' });

    await sendOtpToEmailOrPhone(email, null, emailOtp);
    await sendOtpToEmailOrPhone(null, phone, phoneOtp);
    
    console.log(`âœ… LOGIN-STEP-1-SUCCESS: OTPs sent to ${email} and ${phone}`);

    res.json({
        success: true,
        message: 'Credentials validated. Please verify with OTPs.',
        userData: {
            uniqueCode: getValue(foundUser, userConfig.uniqueCodeField),
            email: email,
            mobile: `+91${phone}`,
            userType: userType
        }
    });

  } catch (error) {
    console.error('âŒ UNIFIED LOGIN STEP 1 ERROR:', error);
    res.status(500).json({ message: 'Server error during login process', error: error.message });
  }
});

// Step 2: Verify OTPs and complete login
router.post('/verify-login', async (req, res) => {
  try {
    const { uniqueCode, userType, emailOtp, phoneOtp } = req.body;
    
    if (!uniqueCode || !userType || !emailOtp || !phoneOtp) {
      return res.status(400).json({ message: 'Required information is missing for verification.' });
    }

    console.log(`ðŸ” LOGIN-STEP-2: Verifying OTPs for code: ${uniqueCode}`);
    
    const modelConfigs = {
      user: { model: User, uniqueCodeField: 'uniqueCode', emailField: 'email', phoneField: 'mobile' },
      hospital: { model: Hospital, uniqueCodeField: 'uniquecode', emailField: 'contactInfo.email', phoneField: 'contactInfo.phoneNumber' },
      doctor: { model: Doctor, uniqueCodeField: 'uniquecode', emailField: 'personalInfo.email', phoneField: 'personalInfo.phoneNumber' },
      pharmacy: { model: Pharmacy, uniqueCodeField: 'uniqueCode', emailField: 'administrator.workEmail', phoneField: 'administrator.contactPhone' },
      insurance: { model: Insurance, uniqueCodeField: 'uniqueCode', emailField: 'administrator.email', phoneField: 'administrator.phone' },
      mnc: { model: MNC, uniqueCodeField: 'uniqueCode', emailField: 'administrator.adminEmail', phoneField: 'administrator.adminPhone' },
      admin: { model: Admin, uniqueCodeField: 'uniqueCode', emailField: 'credentials.adminEmail', phoneField: 'credentials.adminPhone' },
      superadmin: { model: SuperAdmin, uniqueCodeField: 'uniqueCode', emailField: 'credentials.adminEmail', phoneField: 'credentials.adminPhone' },
      healthauthority: { model: HealthAuthority, uniqueCodeField: 'uniqueCode', emailField: 'representative.email', phoneField: 'representative.phone' }
    };
    
    const config = modelConfigs[userType.toLowerCase()];

    if (!config) {
        return res.status(400).json({ message: 'Invalid user type.' });
    }

    const foundUser = await config.model.findOne({ [config.uniqueCodeField]: uniqueCode });
    if (!foundUser) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const email = getValue(foundUser, config.emailField);
    const phone = getValue(foundUser, config.phoneField);
    
    const emailOtpRecord = await Otp.findOne({ email, otp: emailOtp });
    const phoneOtpRecord = await Otp.findOne({ mobile: phone, otp: phoneOtp });

    if (!emailOtpRecord || !phoneOtpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try logging in again.' });
    }

    await Otp.deleteMany({ email });
    await Otp.deleteMany({ mobile: phone });

    console.log(`âœ… LOGIN-STEP-2-SUCCESS: OTPs verified for ${uniqueCode}`);

    const userObject = foundUser.toObject();

    // ** THIS IS THE FIX **
    // Remove sensitive and large binary data before sending the response to prevent crashing
    if (userObject.password) delete userObject.password;
    if (userObject.authentication?.password) delete userObject.authentication.password;
    if (userObject.administrator?.password) delete userObject.administrator.password;
    if (userObject.credentials?.password) delete userObject.credentials.password;
    if (userObject.representative?.password) delete userObject.representative.password;
    
    if (userObject.documents) {
        for (const doc in userObject.documents) {
            if (userObject.documents[doc] && userObject.documents[doc].data) {
                delete userObject.documents[doc].data;
            }
        }
    }
    if (userObject.profileImage?.data) delete userObject.profileImage.data;
    if (userObject.compliance?.licenseDocument?.data) delete userObject.compliance.licenseDocument.data;
    if (userObject.compliance?.authorizationLetter?.data) delete userObject.compliance.authorizationLetter.data;
    if (userObject.document?.file?.data) delete userObject.document.file.data;
    // ** END OF FIX **

    res.json({
      success: true,
      message: `Welcome back!`,
      user: {
        ...userObject,
        userType: userType
      }
    });

  } catch (error) {
    console.error('âŒ OTP VERIFICATION ERROR:', error);
    res.status(500).json({ message: 'Server error during OTP verification', error: error.message });
  }
});

module.exports = router;