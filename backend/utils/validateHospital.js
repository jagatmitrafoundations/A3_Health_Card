const Joi = require('joi');

const hospitalValidationSchema = Joi.object({
  hospitalInfo: Joi.object({
    hospitalName: Joi.string()
      .required()
      .min(3)
      .max(100)
      .trim()
      .messages({
        'string.empty': 'Hospital name is required',
        'string.min': 'Hospital name must be at least 3 characters long',
        'string.max': 'Hospital name cannot exceed 100 characters'
      }),

    hospitalType: Joi.string()
      .required()
      .valid('Private', 'Government', 'Trust', 'Charitable')
      .messages({
        'any.only': 'Please select a valid hospital type'
      }),

    registrationNumber: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Registration number is required'
      })
  }).required(),

  contactInfo: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .lowercase()
      .messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required'
      }),

    phoneNumber: Joi.string()
      .required()
      .pattern(/^[6-9]\d{9}$/)
      .messages({
        'string.pattern.base': 'Please enter a valid Indian phone number',
        'string.empty': 'Phone number is required'
      })
  }).required(),

  location: Joi.object({
    fullAddress: Joi.string()
      .required()
      .min(1)
      .max(200)
      .messages({
        'string.empty': 'Address is required',
        'string.min': 'Address must be at least 10 characters long',
        'string.max': 'Address cannot exceed 200 characters'
      }),

    city: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'City is required'
      }),

    state: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'State is required'
      }),

    pincode: Joi.string()
      .required()
      .pattern(/^[1-9][0-9]{5}$/)
      .messages({
        'string.pattern.base': 'Please enter a valid 6-digit pincode'
      }),

    country: Joi.string()
      .default('India')
  }).required(),

  administrator: Joi.object({
    fullName: Joi.string()
      .required()
      .min(3)
      .max(50)
      .messages({
        'string.empty': 'Administrator name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters'
      }),

    email: Joi.string()
      .required()
      .email()
      .lowercase()
      .messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required'
      }),

    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        'string.min': 'Password must be at least 8 characters long'
      })
  }).required(),

  documents: Joi.object({
    registrationCertificate: Joi.object({
      data: Joi.binary().required(),
      contentType: Joi.string().valid('image/jpeg', 'image/png', 'application/pdf').required()
    }).required(),
    
    otherLicense: Joi.object({
      data: Joi.binary(),
      contentType: Joi.string().valid('image/jpeg', 'image/png', 'application/pdf')
    })
  }).required(),

  settings: Joi.object({
    twoFactorEnabled: Joi.boolean().default(true),
    termsAccepted: Joi.boolean().valid(true).required()
      .messages({
        'any.only': 'You must accept the terms and conditions'
      })
  }).required()
});

module.exports = {
  validateHospital: (data) => hospitalValidationSchema.validate(data, { abortEarly: false })
};