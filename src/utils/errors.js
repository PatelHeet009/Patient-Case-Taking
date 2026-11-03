export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const notFound = (msg = 'Resource not found') => new ApiError(404, msg);
export const badRequest = (msg = 'Bad request', details) => new ApiError(400, msg, details);
export const unauthorized = (msg = 'Unauthorized') => new ApiError(401, msg);
export const forbidden = (msg = 'Forbidden') => new ApiError(403, msg);
export const conflict = (msg = 'Conflict') => new ApiError(409, msg);

// Wraps an async route handler so thrown/rejected errors reach the
// centralized error-handling middleware instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
