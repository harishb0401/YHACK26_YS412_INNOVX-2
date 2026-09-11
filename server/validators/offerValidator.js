import { body } from 'express-validator';

export const createOfferValidationRules = [
  body('lotId')
    .notEmpty()
    .withMessage('Waste Lot ID is required'),
  body('ratePerKg')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Rate per kg must be greater than 0'),
  body('pricePerUnit')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price per unit must be greater than 0'),
  body('pickupDate')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim()
];
