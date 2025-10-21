const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Import all models
const User = require('./models/User');
const Hospital = require('./models/hospital');
const Doctor = require('./models/Doctor');
const Pharmacy = require('./models/pharmacy');
const Insurance = require('./models/Insurance');
const MNC = require('./models/MNC');
const Admin = require('./models/Admin');
const SuperAdmin = require('./models/SuperAdmin');
const HealthAuthority = require('./models/HealthAuthority');

// Unified login endpoint that searches across all schemas
router.post('/unified-login', async (req, res) => {
  try {
    const { uniqueCode, password } = req.body;
    
    if (!uniqueCode || !password) {
      return res.status(400).json({ 
        message: 'Unique code and password are required' 
      });
    }

    console.log(`🔍 UNIFIED LOGIN: Searching for unique code: ${uniqueCode}`);
    
    // Define all models with their search configurations
    const modelConfigs = [
      {
        model: User,
        type: 'user',
        uniqueCodeField: 'uniqueCode',
        passwordField: 'password',
        nameField: 'name',
        emailField: 'email',
        phoneField: 'mobile',
        statusField: null
      },
      {
        model: Hospital,
        type: 'hospital',
        uniqueCodeField: 'uniquecode',
        passwordField: 'administrator.password',
        nameField: 'hospitalInfo.hospitalName',
        emailField: 'contactInfo.email',
        phoneField: 'contactInfo.phoneNumber',
        statusField: 'status'
      },
      {
        model: Doctor,
        type: 'doctor',
        uniqueCodeField: 'uniquecode',
        passwordField: 'authentication.password',
        nameField: 'personalInfo.fullName',
        emailField: 'personalInfo.email',
        phoneField: 'personalInfo.phoneNumber',
        statusField: 'status'
      },
      {
        model: Pharmacy,
        type: 'pharmacy',
        uniqueCodeField: 'uniqueCode',
        passwordField: 'administrator.passwordHash',
        nameField: 'pharmacyInfo.pharmacyName',
        emailField: 'administrator.workEmail',
        phoneField: 'administrator.contactPhone',
        statusField: 'status'
      },
      {
        model: Insurance,
        type: 'insurance',
        uniqueCodeField: 'uniqueCode',
        passwordField: 'administrator.password',
        nameField: 'companyInfo.companyName',
        emailField: 'administrator.email',
        phoneField: 'administrator.adminPhone',
        statusField: 'status'
      },
      {
        model: MNC,
        type: 'mnc',
        uniqueCodeField: 'uniqueCode',
        passwordField: 'administrator.password',
        nameField: 'companyInfo.companyName',
        emailField: 'administrator.adminEmail',
        phoneField: 'administrator.adminPhone',
        statusField: 'status'
      },
      {
        model: Admin,
        type: 'admin',
        uniqueCodeField: 'uniqueCode',
        passwordField: 'credentials.password',
        nameField: 'identity.fullName',
        emailField: 'credentials.adminEmail',
        phoneField: 'credentials.adminPhone',
        statusField: 'status'
      },
      {
        model: SuperAdmin,
        type: 'superadmin',
        uniqueCodeField: 'uniqueCode',
        passwordField: 'credentials.password',
        nameField: 'identity.fullName',
        emailField: 'credentials.adminEmail',
        phoneField: 'credentials.adminPhone',
        statusField: 'status'
      },
      {
        model: HealthAuthority,
        type: 'healthauthority',
        uniqueCodeField: 'uniqueCode',
        passwordField: 'representative.password',
        nameField: 'authorityInfo.authorityName',
        emailField: 'representative.email',
        phoneField: 'representative.phone',
        statusField: 'status'
      }
    ];

    let foundUser = null;
    let userType = null;
    let userConfig = null;
    let searchResults = [];

    // Search across all models
    for (const config of modelConfigs) {
      try {
        console.log(`🔍 SEARCH: Checking ${config.type.toUpperCase()} collection...`);
        
        const searchQuery = { [config.uniqueCodeField]: uniqueCode };
        const user = await config.model.findOne(searchQuery);
        
        if (user) {
          console.log(`✅ FOUND: User exists in ${config.type.toUpperCase()} collection`);
          console.log(`📋 USER DATA: Name: ${getValue(user, config.nameField)}, Email: ${getValue(user, config.emailField)}`);
          
          // Get password from nested field if specified
          let userPassword = getValue(user, config.passwordField);
          
          if (!userPassword) {
            console.log(`❌ PASSWORD: No password found for ${config.type}`);
            searchResults.push({
              model: config.type,
              found: true,
              passwordExists: false,
              reason: 'No password field'
            });
            continue;
          }
          
          // Try password verification
          let isValidPassword = false;
          
          try {
            // Try bcrypt comparison first
            isValidPassword = await bcrypt.compare(password, userPassword);
            console.log(`🔐 BCRYPT: Password verification result: ${isValidPassword}`);
          } catch (error) {
            // If bcrypt fails, try direct comparison (for non-hashed passwords)
            isValidPassword = password === userPassword;
            console.log(`🔐 DIRECT: Password verification result: ${isValidPassword}`);
          }
          
          searchResults.push({
            model: config.type,
            found: true,
            passwordExists: true,
            passwordValid: isValidPassword
          });
          
          if (isValidPassword) {
            foundUser = user;
            userType = config.type;
            userConfig = config;
            console.log(`🎉 SUCCESS: Valid credentials found in ${config.type.toUpperCase()}`);
            break;
          } else {
            console.log(`❌ INVALID: Wrong password for ${config.type}`);
          }
        } else {
          console.log(`❌ NOT FOUND: No user in ${config.type} collection`);
          searchResults.push({
            model: config.type,
            found: false
          });
        }
      } catch (error) {
        console.error(`❌ ERROR: Error searching ${config.type}:`, error.message);
        searchResults.push({
          model: config.type,
          found: false,
          error: error.message
        });
      }
    }

    // Log search summary
    console.log('\n📊 SEARCH SUMMARY:');
    console.log('═'.repeat(50));
    searchResults.forEach(result => {
      console.log(`${result.model.toUpperCase()}: ${result.found ? '✅ Found' : '❌ Not Found'}${result.passwordValid !== undefined ? (result.passwordValid ? ' | ✅ Valid Password' : ' | ❌ Invalid Password') : ''}`);
    });
    console.log('═'.repeat(50));

    if (!foundUser) {
      console.log('❌ FINAL RESULT: No valid user found across all models');
      return res.status(401).json({ 
        message: 'Invalid unique code or password',
        searchSummary: searchResults
      });
    }

    // Check if account is active (if status field exists)
    if (userConfig.statusField) {
      const status = foundUser[userConfig.statusField];
      if (status && status !== 'active' && status !== 'approved') {
        console.log(`⚠️  STATUS: Account status is ${status}`);
        return res.status(403).json({ 
          message: `Account is ${status}. Please contact support.`,
          status: status,
          userType: userType
        });
      }
    }

    // Get user details using the config
    const userDetails = {
      id: foundUser._id,
      uniqueCode: foundUser[userConfig.uniqueCodeField],
      userType: userType,
      name: getValue(foundUser, userConfig.nameField),
      email: getValue(foundUser, userConfig.emailField),
      phone: getValue(foundUser, userConfig.phoneField),
      status: userConfig.statusField ? foundUser[userConfig.statusField] : 'active'
    };

    console.log(`🎉 FINAL SUCCESS: Login successful for ${userType.toUpperCase()}`);
    console.log(`👤 USER: ${userDetails.name} (${userDetails.email})`);
    console.log(`📱 PHONE: ${userDetails.phone}`);
    console.log(`🏆 MODEL IDENTIFIED: ${userType.toUpperCase()}`);

    // Return success response with user data (no OTP, no sessions)
    res.json({
      success: true,
      message: `Welcome back! Logged in as ${userType}`,
      user: {
        ...userDetails,
        userModel: userType.toUpperCase()
      },
      searchSummary: searchResults
    });

  } catch (error) {
    console.error('❌ UNIFIED LOGIN ERROR:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// Helper function to get nested values
function getValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

module.exports = router;