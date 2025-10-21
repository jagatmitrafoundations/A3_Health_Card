const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  uniquecode: {
    type: String,
    required: true,
    unique: true,
    length: 8
  },
  hospitalInfo: {
    hospitalName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100
    },
    hospitalType: {
      type: String,
      required: true,
      enum: ['Private', 'Government', 'Trust', 'Charitable']
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },

  contactInfo: {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
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

  location: {
    fullAddress: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 200
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^[1-9][0-9]{5}$/
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    }
  },

  administrator: {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 50
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },

  documents: {
    registrationCertificate: {
      data: Buffer,
      contentType: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    otherLicense: {
      data: Buffer,
      contentType: String,
      uploadedAt: Date
    }
  },

  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },

  settings: {
    twoFactorEnabled: {
      type: Boolean,
      default: true
    },
    termsAccepted: {
      type: Boolean,
      required: true
    }
  },

//   status: {
//     type: String,
//     enum: ['pending', 'active', 'suspended', 'blocked'],
//     default: 'pending'
//   },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
hospitalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Hospital', hospitalSchema);