const mongoose = require('mongoose');

const healthAuthoritySchema = new mongoose.Schema({
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 16,
    maxlength: 16
  },
  authorityInfo: {
    authorityName: {
      type: String,
      required: true,
      trim: true
    },
    jurisdiction: {
      type: String,
      required: true,
      enum: ['National', 'State', 'Local', 'Regional'],
      trim: true
    },
    authorityRegNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    officialWebsite: {
      type: String,
      trim: true,
      match: /^https?:\/\/.+/
    }
  },
  representative: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    govEmployeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /\.gov(?:\.[a-z]{2})?$/
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
    authorizationLetter: {
      data: Buffer,
      contentType: String
    },
    dataUseAgreementAccepted: {
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
  verificationStatus: {
    type: String,
    enum: ['unverified', 'under_review', 'verified', 'rejected'],
    default: 'unverified'
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
healthAuthoritySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HealthAuthority', healthAuthoritySchema);