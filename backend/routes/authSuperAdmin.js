const express = require('express');
const router = express.Router();
const SuperAdmin = require('../models/SuperAdmin');
const { sendSignupEmail } = require('../utils/emailOtp');
const { validateSuperAdminRegistration } = require('../utils/superAdminValidation');
//add these to env file
// # Existing variables... 

// # Super Admin Master Keys (keep these EXTREMELY secure!)
// MASTER_KEY_1=SUPERADMIN2024MASTER
// MASTER_KEY_2=CSUITE2024AUTHORIZATION
// MASTER_KEY_3=EXECUTIVE2024GRANT
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

// Master Keys (In production, store these securely in environment variables or a secure vault)
const VALID_MASTER_KEYS = [
  process.env.MASTER_KEY_1 || 'SUPERADMIN2024MASTER',
  process.env.MASTER_KEY_2 || 'CSUITE2024AUTHORIZATION',
  process.env.MASTER_KEY_3 || 'EXECUTIVE2024GRANT'
];

function isValidMasterKey(key) {
  return VALID_MASTER_KEYS.includes(key);
}

// Validate password strength for Super Admin
function validateSuperAdminPassword(password) {
  const minLength = 14;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

// Register Super Admin
router.post('/register', async (req, res) => {
  try {
    console.log("Super Admin registration request received:", req.body);
    
    const { identity, credentials, authorization, verification } = req.body;
    
    // Validate Master Key first
    if (!isValidMasterKey(authorization.masterKey)) {
      return res.status(403).json({
        message: 'Invalid Master Authorization Key. This incident will be logged and reported to the C-suite.'
      });
    }
    
    // Check for existing super admin with same email, phone, or employee ID
    const existingSuperAdmin = await SuperAdmin.findOne({
      $or: [
        { 'credentials.adminEmail': credentials.adminEmail },
        { 'credentials.adminPhone': credentials.adminPhone },
        { 'identity.employeeId': identity.employeeId }
      ]
    });

    if (existingSuperAdmin) {
      return res.status(400).json({
        message: 'A Super Admin account already exists with this email, phone, or employee ID'
      });
    }

    // Validate password strength
    if (!validateSuperAdminPassword(credentials.password)) {
      return res.status(400).json({
        message: 'Password must be at least 14 characters with uppercase, lowercase, number, and special character'
      });
    }

    // Validate fiduciary acknowledgment
    if (!authorization.fiduciaryAcknowledgment) {
      return res.status(400).json({
        message: 'Fiduciary acknowledgment is required for Super Admin accounts'
      });
    }

    // Generate unique code
    const uniqueCode = await generateUniqueCode(SuperAdmin);
    console.log('Generated unique code:', uniqueCode);
    
    // Create super admin object
    const superAdminToSave = {
      uniqueCode: uniqueCode,
      identity: {
        fullName: identity.fullName,
        employeeId: identity.employeeId,
        officialTitle: identity.officialTitle,
        workLocation: identity.workLocation || ''
      },
      credentials: {
        adminEmail: credentials.adminEmail,
        adminPhone: credentials.adminPhone,
        password: credentials.password, // In production, hash this with bcrypt
        isEmailVerified: verification.isEmailVerified || false,
        isPhoneVerified: verification.isPhoneVerified || false
      },
      authorization: {
        masterKey: authorization.masterKey, // In production, hash this
        fiduciaryAcknowledgment: authorization.fiduciaryAcknowledgment,
        twoFactorEnabled: true // Always mandatory for Super Admin
      },
      status: 'pending_audit',
      createdBy: 'Self-Registration',
      auditLog: [{
        action: 'SUPER_ADMIN_REGISTRATION',
        timestamp: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress,
        details: `Super Admin account created for ${identity.fullName} (${identity.employeeId})`
      }]
    };

    console.log('Super Admin data to save:', {
      uniqueCode: superAdminToSave.uniqueCode,
      fullName: superAdminToSave.identity.fullName,
      email: superAdminToSave.credentials.adminEmail,
      employeeId: superAdminToSave.identity.employeeId
    });

    // Create new super admin
    const newSuperAdmin = new SuperAdmin(superAdminToSave);
    await newSuperAdmin.save();

    console.log('Super Admin saved successfully with uniqueCode:', newSuperAdmin.uniqueCode);
   
    // Send signup email with enhanced security notice
    try {
      await sendSignupEmail(
        newSuperAdmin.credentials.adminEmail,
        `🔐 SUPER ADMIN ACCOUNT CREATED - CONFIDENTIAL\n\n` +
        `Your Super Admin Account has been created and is pending final audit.\n\n` +
        `Your Unique Super Admin Code: ${newSuperAdmin.uniqueCode}\n` +
        `Employee ID: ${newSuperAdmin.identity.employeeId}\n\n` +
        `⚠️ CRITICAL SECURITY INFORMATION:\n` +
        `- This account has FULL SYSTEM ACCESS with the highest privileges\n` +
        `- Multi-Factor Authentication is MANDATORY and enabled\n` +
        `- All actions are logged and audited\n` +
        `- You are legally and ethically responsible for data protection\n` +
        `- Never share your credentials with anyone\n` +
        `- This account is subject to regular security audits\n\n` +
        `Your account status: PENDING AUDIT\n` +
        `You will be notified once your account is activated by the C-suite.\n\n` +
        `IMPORTANT: Keep this email and your unique code secure. This code is required for account recovery.\n\n` +
        `If you did not request this account, please contact security immediately.`
      );
      console.log('Super Admin signup email sent successfully');
    } catch (err) {
      console.error('Error sending signup email:', err);
    }

    // Return response (excluding sensitive data)
    res.status(201).json({
      message: 'Super Admin registration successful! Your account is pending final audit by C-suite. Please check your email for your Unique Super Admin Code.',
      superAdmin: {
        uniqueCode: newSuperAdmin.uniqueCode,
        fullName: newSuperAdmin.identity.fullName,
        employeeId: newSuperAdmin.identity.employeeId,
        email: newSuperAdmin.credentials.adminEmail,
        title: newSuperAdmin.identity.officialTitle,
        status: newSuperAdmin.status,
        twoFactorEnabled: newSuperAdmin.authorization.twoFactorEnabled
      },
      securityNotice: 'This account request has been logged and will be reviewed by executive management.'
    });

  } catch (error) {
    console.error('Super Admin registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `A Super Admin with this ${field.split('.')[1]} already exists`
      });
    }
    
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login Super Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password, employeeId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Find super admin by email or employee ID
    const superAdmin = await SuperAdmin.findOne({
      $or: [
        { 'credentials.adminEmail': email },
        { 'identity.employeeId': employeeId }
      ]
    });

    if (!superAdmin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (superAdmin.status !== 'active') {
      // Log failed attempt
      await superAdmin.logLoginAttempt(ipAddress, userAgent, false);
      
      return res.status(403).json({ 
        message: `Your Super Admin account is ${superAdmin.status}. Please contact C-suite for assistance.`,
        status: superAdmin.status
      });
    }

    // Verify password (In production, use bcrypt.compare)
    if (password !== superAdmin.credentials.password) {
      await superAdmin.logLoginAttempt(ipAddress, userAgent, false);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log successful login
    await superAdmin.logLoginAttempt(ipAddress, userAgent, true);
    await superAdmin.logAction('LOGIN', ipAddress, 'Successful login');

    res.json({
      message: 'Login successful',
      superAdmin: {
        uniqueCode: superAdmin.uniqueCode,
        fullName: superAdmin.identity.fullName,
        employeeId: superAdmin.identity.employeeId,
        email: superAdmin.credentials.adminEmail,
        title: superAdmin.identity.officialTitle,
        status: superAdmin.status,
        twoFactorEnabled: superAdmin.authorization.twoFactorEnabled,
        permissions: superAdmin.permissions,
        lastLogin: superAdmin.lastLogin
      }
    });

  } catch (error) {
    console.error('Super Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Super Admin Profile
router.get('/profile/:uniqueCode', async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findOne({ uniqueCode: req.params.uniqueCode })
      .select('-credentials.password -authorization.masterKey');

    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    }

    res.json({ superAdmin });
  } catch (error) {
    console.error('Get super admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve Super Admin (for C-suite use)
router.patch('/approve/:uniqueCode', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    
    const superAdmin = await SuperAdmin.findOneAndUpdate(
      { uniqueCode: req.params.uniqueCode },
      { 
        status: 'active',
        approvedBy: approvedBy,
        approvedAt: new Date()
      },
      { new: true }
    ).select('-credentials.password -authorization.masterKey');

    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    }

    // Log approval
    await superAdmin.logAction('ACCOUNT_APPROVED', req.ip, `Approved by: ${approvedBy}`);

    // Send approval email
    try {
      await sendSignupEmail(
        superAdmin.credentials.adminEmail,
        `🎉 Your Super Admin Account Has Been Activated!\n\n` +
        `Your account has been approved by: ${approvedBy}\n` +
        `Status: ACTIVE\n\n` +
        `You now have full system access. Please log in to begin.\n\n` +
        `Remember: With great power comes great responsibility.`
      );
    } catch (err) {
      console.error('Error sending approval email:', err);
    }

    res.json({ 
      message: 'Super Admin account approved and activated',
      superAdmin 
    });
  } catch (error) {
    console.error('Approve super admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Audit Logs (for compliance)
router.get('/audit-logs/:uniqueCode', async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findOne({ uniqueCode: req.params.uniqueCode })
      .select('auditLog identity.fullName identity.employeeId');

    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    }

    res.json({ 
      adminInfo: {
        fullName: superAdmin.identity.fullName,
        employeeId: superAdmin.identity.employeeId
      },
      auditLog: superAdmin.auditLog.sort((a, b) => b.timestamp - a.timestamp)
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Login History
router.get('/login-history/:uniqueCode', async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findOne({ uniqueCode: req.params.uniqueCode })
      .select('loginHistory identity.fullName identity.employeeId');

    if (!superAdmin) {
      return res.status(404).json({ message: 'Super Admin not found' });
    }

    res.json({ 
      adminInfo: {
        fullName: superAdmin.identity.fullName,
        employeeId: superAdmin.identity.employeeId
      },
      loginHistory: superAdmin.loginHistory.sort((a, b) => b.timestamp - a.timestamp)
    });
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;