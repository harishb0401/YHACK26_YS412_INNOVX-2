import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { registerValidationRules, loginValidationRules } from '../validators/authValidator.js';

const router = express.Router();

// Strict rate limiter for authentication endpoints to prevent brute-force attacks
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authRateLimiter, registerValidationRules, validateRequest, register);
router.post('/login', authRateLimiter, loginValidationRules, validateRequest, login);
router.get('/me', authMiddleware, getMe);
router.post('/logout', logout);

export default router;
