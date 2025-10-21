//models/MedicalRecord.js
const mongoose = require('mongoose');
// aditional fields required by sir - bmi calculated,systolic,dysclic and sugarlevel graph
const medicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  height: Number, // in cm
  weight: Number, // in kg
  bp: {
    systolic: Number,
    diastolic: Number
  },
  presentMedicalHistory: String,
  pastMedicalHistory: String,
  pastSurgicalHistory: String,
  bloodGroup: { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
  implantHistory: String,// now sir has said to add options like metalic,biomedical,pacemacker,dental or any other implants 
  allergies: {
    drug: String,
    air: String,
    food: String
  },
  otherConditions: String,

  diabetes: { type: Boolean, default: false },
  bloodSugar: {
    fasting: Number,
    random: Number
  },

  vaccinationSchedule: [String] // will populate from Universal Immunization Program
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
