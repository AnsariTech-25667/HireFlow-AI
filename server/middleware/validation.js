import Joi from 'joi';

// User registration validation
export const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional(),
  location: Joi.string().max(100).optional(),
});

// User login validation
export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Job posting validation
export const jobValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(50).max(2000).required(),
  requirements: Joi.array().items(Joi.string()).min(1).required(),
  location: Joi.string().max(100).required(),
  jobType: Joi.string()
    .valid('full-time', 'part-time', 'contract', 'internship')
    .required(),
  experience: Joi.string()
    .valid('entry', '1-2', '3-5', '5-10', '10+')
    .required(),
  salary: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(Joi.ref('min')).required(),
    currency: Joi.string().valid('USD', 'EUR', 'INR', 'GBP').default('USD'),
  }).required(),
  skills: Joi.array().items(Joi.string()).min(1).required(),
  companyId: Joi.string().required(),
});

// Job application validation
export const applicationValidation = Joi.object({
  jobId: Joi.string().required(),
  coverLetter: Joi.string().min(100).max(1000).optional(),
  resume: Joi.string().uri().required(),
  expectedSalary: Joi.number().min(0).optional(),
});

// Profile update validation
export const profileUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional(),
  location: Joi.string().max(100).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  experience: Joi.number().min(0).max(50).optional(),
  bio: Joi.string().max(500).optional(),
});
