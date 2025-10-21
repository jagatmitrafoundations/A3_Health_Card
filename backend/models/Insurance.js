const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
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
    irdaiNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    cin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 21,
      maxlength: 21
    },
    officialWebsite: {
      type: String,
      trim: true
    }
  },
  administrator: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    },
    phone: {
      type: String,
      required: true,
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
  compliance: {
    licenseDocument: {
      data: Buffer,
      contentType: String
    },
    baaAgreementAccepted: {
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
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
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
insuranceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Insurance', insuranceSchema);