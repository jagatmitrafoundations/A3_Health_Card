//models/User.js
const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  contactNumber: { type: String, required: true } 
}, { _id: false });

const addressSchema = new mongoose.Schema({
  houseNo: { type: String, required: true },
  vpo: { type: String },
  block: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  
  file: { data: Buffer, contentType: String }, // store file as buffer
}, { _id: false });

const uniqueIdSchema = new mongoose.Schema({
  country: { type: String, required: true },
  type: { type: String, required: true },
  number: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // fullName in frontend
  dob: { type: Date, required: true },
  sex: { type: String, enum: ['Male','Female','Other'], required: true },
  password: { type: String, required: true },
  presentAddress: { type: addressSchema, required: true },
  permanentAddress: { type: addressSchema, required: true },
  maritalStatus: { type: String, enum: ['Single','Married','Divorced','Widowed'] },
  guardianName: { type: String, required: true },
  guardianRelation: { type: String },
  occupation: { type: String },
  educationLevel: { type: String },
  emergencyContacts: {
    type: [emergencyContactSchema],
    validate: {
      validator: v => Array.isArray(v) && v.length === 3,
      message: 'Exactly 3 emergency contacts required'
    },
    required: true
  },
   // legacy field, keep for compatibility
  uniqueId: { type: uniqueIdSchema, required: true }, // new field from signup page
   profileImage: { data: Buffer, contentType: String }, // store profile image as buffer
  document: { type: documentSchema, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  useBiometric: { type: Boolean, default: false }, // from signup page
  uniqueCode: { type: String, unique: true }, // generatedCode after signup page
  role: { type: String, enum: ['User', 'Doctor'], default: 'User' }, // add role for future
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);