import { body } from 'express-validator';

export const createWasteLotValidationRules = [
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ gt: 0 })
    .withMessage('Quantity must be a positive number greater than 0'),
  body('unit')
    .optional()
    .trim(),
  body('material')
    .optional()
    .trim(),
  body('condition')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim(),
  body('locationText')
    .optional()
    .trim(),
  body('latitude')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];
