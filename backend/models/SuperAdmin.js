const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 16,
    maxlength: 16
  },
  identity: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    officialTitle: {
      type: String,
      required: true,
      trim: true
    },
    workLocation: {
      type: String,
      trim: true
    }
  },
  credentials: {
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    },
    adminPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 14 // Super Admin requires stronger password
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    }
  },
  authorization: {
    masterKey: {
      type: String,
      required: true,
      trim: true
    },
    fiduciaryAcknowledgment: {
      type: Boolean,
      required: true,
      default: false
    },
    twoFactorEnabled: {
      type: Boolean,
      required: true,
      default: true // Mandatory for Super Admin
    }
  },
  status: {
    type: String,
    enum: ['pending_audit', 'active', 'suspended', 'revoked'],
    default: 'pending_audit'
  },
  permissions: {
    type: [String],
    default: ['full_system_access', 'user_management', 'data_governance', 'audit_logs', 'system_settings']
  },
  auditLog: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    details: String
  }],
  lastLogin: {
    type: Date
  },
  loginHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    success: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'System'
  },
  approvedBy: {
    type: String
  },
  approvedAt: {
    type: Date
  }
});

// Update the updatedAt field before saving
superAdminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries and security
superAdminSchema.index({ 'credentials.adminEmail': 1 });
superAdminSchema.index({ 'identity.employeeId': 1 });
superAdminSchema.index({ status: 1 });
superAdminSchema.index({ createdAt: -1 });

// Method to log actions
superAdminSchema.methods.logAction = function(action, ipAddress, details) {
  this.auditLog.push({
    action,
    ipAddress,
    details,
    timestamp: new Date()
  });
  return this.save();
};

// Method to log login attempt
superAdminSchema.methods.logLoginAttempt = function(ipAddress, userAgent, success) {
  this.loginHistory.push({
    ipAddress,
    userAgent,
    success,
    timestamp: new Date()
  });
  
  if (success) {
    this.lastLogin = new Date();
  }
  
  // Keep only last 50 login attempts
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }
  
  return this.save();
};

module.exports = mongoose.model('SuperAdmin', superAdminSchema);