// utils/validateSignup.js
const Joi = require('joi');

const phoneRegex = /^\+\d{6,15}$/; // +countrycode + number
const documentSchema = Joi.object({
  type: Joi.string().required(),
  number: Joi.string().required(),
  file: Joi.any() // optional file upload
});
const addressSchema = Joi.object({
  houseNo: Joi.string().required(),
  vpo: Joi.string().allow(''),
  block: Joi.string().allow(''),
  district: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.string().required()
});

const emergencyContactSchema = Joi.object({
  name: Joi.string().required(),
  relation: Joi.string().required(),
  contactNumber: Joi.string().pattern(phoneRegex).required()
});

const signupSchema = Joi.object({
  name: Joi.string().required(),
  dob: Joi.date().iso().required(), // ISO date string expected (YYYY-MM-DD)
  sex: Joi.string().valid('Male','Female','Other').required(),
  presentAddress: addressSchema.required(),
  permanentAddress: addressSchema.required(),
  maritalStatus: Joi.string().valid('Single','Married','Divorced','Widowed').required(),
  guardianName: Joi.string().required(),
  guardianRelation: Joi.string().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be alphanumeric and 8-16 characters long.'
    }),
  occupation: Joi.string().allow(''),
  educationLevel: Joi.string().allow(''),
  uniqueId: Joi.object({
    country: Joi.string().required(),
    type: Joi.string().required(),
    number: Joi.string().required()
  }).required(),
  emergencyContacts: Joi.array().items(emergencyContactSchema).length(3).required(),
 //document: documentSchema.required(),
//  documentType: Joi.string().required(),
//  documentNumber: Joi.string().required(),
 documentFile: Joi.any(),
  // profileImage is optional as user may skip
 uniqueCode: Joi.string(),
   // file upload
  email: Joi.string().email().required(),
  useBiometric: Joi.boolean(),
  mobile: Joi.string().pattern(phoneRegex).required()
});

module.exports = signupSchema;
