import { body } from 'express-validator';

export const registerValidationRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[+]?[0-9\s-]{8,20}$/)
    .withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['collector', 'recycler'])
    .withMessage('Role must be either collector or recycler. Public admin signup is disabled.'),
  body('organizationName')
    .optional()
    .trim()
];

export const loginValidationRules = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('identifier')
    .optional()
    .trim(),
  body('email')
    .optional()
    .trim()
];
