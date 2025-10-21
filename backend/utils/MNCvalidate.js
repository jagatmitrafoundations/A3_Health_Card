const Joi = require('joi');

const mncValidationSchema = Joi.object({
  companyInfo: Joi.object({
    companyName: Joi.string()
      .required()
      .min(3)
      .max(100)
      .trim()
      .messages({
        'string.empty': 'Company name is required',
        'string.min': 'Company name must be at least 3 characters long'
      }),

    registrationNumber: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Registration number is required'
      }),

    industry: Joi.string()
      .allow('')
      .trim()
  }).required(),

  administrator: Joi.object({
    adminName: Joi.string()
      .required()
      .min(3)
      .max(50)
      .trim()
      .messages({
        'string.empty': 'Administrator name is required',
        'string.min': 'Name must be at least 3 characters long'
      }),

    adminEmail: Joi.string()
      .required()
      .email()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required'
      }),

    adminPhone: Joi.string()
      .required()
      .pattern(/^\d{10,15}$/)
      .messages({
        'string.pattern.base': 'Please enter a valid phone number',
        'string.empty': 'Phone number is required'
      }),

    password: Joi.string()
      .required()
      .min(8)
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.empty': 'Password is required'
      })
  }).required()
});

module.exports = {
  validateMNC: (data) => mncValidationSchema.validate(data, { abortEarly: false })
};