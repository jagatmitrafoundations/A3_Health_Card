const Joi = require('joi');

const pharmacyValidationSchema = Joi.object({
    uniqueId: Joi.string()
        .length(16)
        .required()
        .messages({
            'string.empty': 'Unique ID is required',
            'string.length': 'Unique ID must be exactly 16 characters long'
        }),

    pharmacyInfo: Joi.object({
        pharmacyName: Joi.string()
            .required()
            .min(3)
            .max(100)
            .trim()
            .messages({
                'string.empty': 'Pharmacy name is required',
                'string.min': 'Pharmacy name must be at least 3 characters long',
                'string.max': 'Pharmacy name cannot exceed 100 characters'
            }),

        drugLicenseNumber: Joi.string()
            .required()
            .pattern(/^[A-Z0-9-]+$/)
            .trim()
            .messages({
                'string.empty': 'Drug license number is required',
                'string.pattern.base': 'Invalid drug license number format'
            }),

        gstin: Joi.string()
            .required()
            .length(15)
            .pattern(/^[0-9A-Z]{15}$/)
            .messages({
                'string.empty': 'GSTIN is required',
                'string.length': 'GSTIN must be exactly 15 characters long',
                'string.pattern.base': 'Invalid GSTIN format'
            })
    }).required(),

    officialAddress: Joi.object({
        fullAddress: Joi.string()
            .required()
            .min(10)
            .max(200)
            .trim()
            .messages({
                'string.empty': 'Full address is required',
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
                'string.empty': 'Pincode is required',
                'string.pattern.base': 'Invalid pincode format'
            })
    }).required(),

    administrator: Joi.object({
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

        workEmail: Joi.string()
            .required()
            .email()
            .lowercase()
            .trim()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Invalid email format'
            }),

        contactPhone: Joi.string()
            .required()
            .pattern(/^[6-9]\d{9}$/)
            .messages({
                'string.empty': 'Phone number is required',
                'string.pattern.base': 'Invalid Indian phone number format'
            }),

        password: Joi.string()
            .required()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
            })
    }).required(),

    compliance: Joi.object({
        drugLicenseFile: Joi.object({
            data: Joi.binary().required(),
            contentType: Joi.string().valid('image/jpeg', 'image/png', 'application/pdf').required()
        }).required(),

        twoFactorEnabled: Joi.boolean().default(true),

        termsAccepted: Joi.boolean()
            .valid(true)
            .required()
            .messages({
                'any.only': 'You must accept the terms and conditions'
            })
    }).required()
});

// Validation function
const validatePharmacy = (data) => {
    return pharmacyValidationSchema.validate(data, { abortEarly: false });
};

module.exports = validatePharmacy;