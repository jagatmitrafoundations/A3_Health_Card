const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  uniquecode: {
    type: String,
    required: true,
    unique: true,
    minlength: 16,
  maxlength: 16
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
  professionalInfo: {
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology",
        "General Surgery", "Neurology", "Oncology", "Orthopedics",
        "Pediatrics", "Psychiatry", "Radiology", "Urology", "Other"
      ]
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    currentAffiliation: {
      type: String,
      trim: true
    }
  },
  documents: {
    licenseFile: {
    data: {
      type: Buffer,        // ✅ Correct
      required: true       // ✅ 'required' is now inside the field definition
    },
    contentType: {
      type: String,        // ✅ Correct
      required: true
    }
  }},
  authentication: {
    password: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  },
  consent: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);