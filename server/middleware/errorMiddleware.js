/**
 * Centralized Error Handling Middleware
 * Ensures all errors produce a consistent response format:
 * { success: false, message: "Human readable message" }
 */
export function errorMiddleware(err, req, res, next) {
  // Determine appropriate HTTP status code
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  // Log error details securely on server
  console.error(`[API Error ${statusCode}] ${req.method} ${req.originalUrl}:`, err.message);

  // Return clean JSON without exposing internal stack traces
  res.status(statusCode).json({
    success: false,
    message
  });
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundMiddleware(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

export default errorMiddleware;
