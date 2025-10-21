const mongoose = require('mongoose');

const mncSchema = new mongoose.Schema({
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 16,
    maxlength: 16
  },
  companyInfo: {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    }
  },
  administrator: {
    adminName: {
      type: String,
      required: true,
      trim: true
    },
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    adminPhone: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
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
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MNC', mncSchema);