import { validationResult } from 'express-validator';

/**
 * Validation Middleware
 * Checks express-validator results and returns standard 400 error if validation fails
 */
export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg || 'Invalid request parameters'
    });
  }
  next();
}

export default validateRequest;
