const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { sendSignupEmail } = require('../utils/emailOtp');
const { validateAdminRegistration } = require('../utils/adminValidation');

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

// Verify Authorization Code (you should implement your own logic)
const VALID_AUTHORIZATION_CODES = [
  'ADMIN2024SECURE',
  'SUPERVISOR2024KEY',
  'MANAGEMENT2024CODE'
];

function isValidAuthorizationCode(code) {
  return VALID_AUTHORIZATION_CODES.includes(code);
}

// Register Admin
router.post('/register', async (req, res) => {
  try {
    console.log("Admin registration request received:", req.body);
    
    const { identity, credentials, authorization, verification } = req.body;
    
    // Validate authorization code first
    if (!isValidAuthorizationCode(authorization.authorizationCode)) {
      return res.status(403).json({
        message: 'Invalid authorization code. Please contact your supervisor for a valid code.'
      });
    }
    
    // Check for existing admin with same email, phone, or employee ID
    const existingAdmin = await Admin.findOne({
      $or: [
        { 'credentials.adminEmail': credentials.adminEmail },
        { 'credentials.adminPhone': credentials.adminPhone },
        { 'identity.employeeId': identity.employeeId }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Admin already registered with this email, phone, or employee ID'
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(credentials.password)) {
      return res.status(400).json({
        message: 'Password must be at least 12 characters with uppercase, lowercase, number, and special character'
      });
    }

    // Generate unique code
    const uniqueCode = await generateUniqueCode(Admin);
    console.log('Generated unique code:', uniqueCode);
    
    // Create admin object
    const adminToSave = {
      uniqueCode: uniqueCode,
      identity: {
        fullName: identity.fullName,
        employeeId: identity.employeeId,
        adminRole: identity.adminRole
      },
      credentials: {
        adminEmail: credentials.adminEmail,
        adminPhone: credentials.adminPhone,
        password: credentials.password, // In production, hash this with bcrypt
        isEmailVerified: verification.isEmailVerified || false,
        isPhoneVerified: verification.isPhoneVerified || false
      },
      authorization: {
        authorizationCode: authorization.authorizationCode,
        agreedToPolicy: authorization.agreedToPolicy,
        twoFactorEnabled: authorization.twoFactorEnabled !== false // Default true
      }
    };

    console.log('Admin data to save:', {
      uniqueCode: adminToSave.uniqueCode,
      fullName: adminToSave.identity.fullName,
      email: adminToSave.credentials.adminEmail,
      employeeId: adminToSave.identity.employeeId
    });

    // Create new admin
    const newAdmin = new Admin(adminToSave);
    await newAdmin.save();

    console.log('Admin saved successfully with uniqueCode:', newAdmin.uniqueCode);
   
    // Send signup email
    try {
      await sendSignupEmail(
        newAdmin.credentials.adminEmail,
        `Your Admin Account has been created successfully!\n\nYour Unique Admin Code is: ${newAdmin.uniqueCode}\n\nEmployee ID: ${newAdmin.identity.employeeId}\n\nPlease keep this code safe and secure. This account has administrative privileges and must be used responsibly.\n\nImportant Security Notes:\n- Two-Factor Authentication is enabled by default\n- Never share your credentials with anyone\n- Change your password regularly\n- Log out when not in use\n\nYour account is pending approval. You will be notified once it's activated.`
      );
      console.log('Admin signup email sent successfully');
    } catch (err) {
      console.error('Error sending signup email:', err);
    }

    // Return response (excluding sensitive data)
    res.status(201).json({
      message: 'Admin registration successful! Your account is pending approval. Please check your email for your Unique Admin Code.',
      admin: {
        uniqueCode: newAdmin.uniqueCode,
        fullName: newAdmin.identity.fullName,
        employeeId: newAdmin.identity.employeeId,
        email: newAdmin.credentials.adminEmail,
        role: newAdmin.identity.adminRole,
        status: newAdmin.status,
        twoFactorEnabled: newAdmin.authorization.twoFactorEnabled
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `An admin with this ${field.split('.')[1]} already exists`
      });
    }
    
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password, employeeId } = req.body;

    // Find admin by email or employee ID
    const admin = await Admin.findOne({
      $or: [
        { 'credentials.adminEmail': email },
        { 'identity.employeeId': employeeId }
      ]
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (admin.status !== 'active') {
      return res.status(403).json({ 
        message: `Your admin account is ${admin.status}. Please contact system administrator.`,
        status: admin.status
      });
    }

    // Verify password (In production, use bcrypt.compare)
    if (password !== admin.credentials.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      message: 'Login successful',
      admin: {
        uniqueCode: admin.uniqueCode,
        fullName: admin.identity.fullName,
        employeeId: admin.identity.employeeId,
        email: admin.credentials.adminEmail,
        role: admin.identity.adminRole,
        status: admin.status,
        twoFactorEnabled: admin.authorization.twoFactorEnabled,
        permissions: admin.permissions
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Admin Profile
router.get('/profile/:uniqueCode', async (req, res) => {
  try {
    const admin = await Admin.findOne({ uniqueCode: req.params.uniqueCode })
      .select('-credentials.password -authorization.authorizationCode');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ admin });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Admin Status (for super admin use)
router.patch('/status/:uniqueCode', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'active', 'suspended', 'deactivated'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const admin = await Admin.findOneAndUpdate(
      { uniqueCode: req.params.uniqueCode },
      { status: status },
      { new: true }
    ).select('-credentials.password -authorization.authorizationCode');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ 
      message: `Admin status updated to ${status}`,
      admin 
    });
  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;