// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log the full error server-side for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Determine error code and message
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  // Never leak stack traces or internal details to client
  res.status(statusCode).json({
    error: {
      message: statusCode === 500 ? 'Internal server error' : message,
      code: errorCode
    }
  });
};

// Custom error class for application errors
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}
