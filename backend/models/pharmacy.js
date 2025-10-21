const mongoose = require("mongoose");
const { min } = require("../utils/validateSignup");

const pharmacyPartnerSchema = new mongoose.Schema({
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
    minlength: 16,
    maxlength: 16
  },
  pharmacyInfo: {
    pharmacyName: {
      type: String,
      required: true,
      trim: true,
    },
    drugLicenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    gstin: {
      type: String,
      required: true, // GSTIN is required
      match: /^[0-9A-Z]{15}$/, // basic GSTIN format check
    },
  },

  officialAddress: {
    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
       
    },
  },

  administrator: {
    fullName: {
      type: String,
      required: true,
    },
    workEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    contactPhone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {    // ✅ Add this
    type: Boolean,
    default: false
  },
  isPhoneVerified: {    // ✅ Add this
    type: Boolean,
    default: false
  }
  },

  compliance: {
    drugLicenseFile: {
      data: {
        type: Buffer,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: true,
    },
    termsAccepted: {
      type: Boolean,
      required: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PharmacyPartner", pharmacyPartnerSchema);
