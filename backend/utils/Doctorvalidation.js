const Joi = require('joi');

const doctorValidationSchema = Joi.object({
  personalInfo: Joi.object({
    fullName: Joi.string()
      .required()
      .min(3)
      .max(50)
      .trim()
      .messages({
        'string.empty': 'Full name is required',
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

    phoneNumber: Joi.string()
      .required()
      .pattern(/^\d{10,15}$/)
      .messages({
        'string.pattern.base': 'Please enter a valid phone number',
        'string.empty': 'Phone number is required'
      })
  }).required(),

  professionalInfo: Joi.object({
    licenseNumber: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Medical license number is required'
      }),

    specialization: Joi.string()
      .required()
      .valid(
        "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology",
        "General Surgery", "Neurology", "Oncology", "Orthopedics",
        "Pediatrics", "Psychiatry", "Radiology", "Urology", "Other"
      )
      .messages({
        'any.only': 'Please select a valid specialization'
      }),

    experience: Joi.number()
      .required()
      .min(0)
      .messages({
        'number.base': 'Experience must be a number',
        'number.min': 'Experience cannot be negative'
      }),

    currentAffiliation: Joi.string()
      .allow('')
      .trim()
  }).required(),

  documents: Joi.object({
    licenseFile: Joi.object({
      data: Joi.binary().required(),
      contentType: Joi.string().valid('image/jpeg', 'image/png', 'application/pdf').required()
    }).required(),
    
    profilePhoto: Joi.object({
      data: Joi.binary(),
      contentType: Joi.string().valid('image/jpeg', 'image/png')
    })
  }).required(),

  authentication: Joi.object({
    password: Joi.string()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, lowercase letter, number and special character',
        'string.min': 'Password must be at least 8 characters long'
      })
  }).required(),

  consent: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must agree to the terms and conditions'
    })
});

module.exports = {
  validateDoctor: (data) => doctorValidationSchema.validate(data, { abortEarly: false })
};