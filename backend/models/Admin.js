const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    adminRole: {
      type: String,
      required: true,
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
      minlength: 12
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
    authorizationCode: {
      type: String,
      required: true,
      trim: true
    },
    agreedToPolicy: {
      type: Boolean,
      required: true,
      default: false
    },
    twoFactorEnabled: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'deactivated'],
    default: 'pending'
  },
  permissions: {
    type: [String],
    default: []
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
adminSchema.index({ 'credentials.adminEmail': 1 });
adminSchema.index({ 'identity.employeeId': 1 });
adminSchema.index({ status: 1 });

module.exports = mongoose.model('Admin', adminSchema);