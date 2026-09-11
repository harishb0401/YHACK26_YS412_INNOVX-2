import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ecolink-production-jwt-super-secret-key-2026';

/**
 * Authentication Middleware
 * Validates the JWT Bearer token and attaches user identity to req.user
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.userId || decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
}

export default authMiddleware;
