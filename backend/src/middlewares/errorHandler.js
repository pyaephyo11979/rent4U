const { ZodError } = require('zod');
const { AppError, ValidationError } = require('../utils/errors');
const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    logger.warn(`Validation error: ${JSON.stringify(errors)}`);
    return res.status(400).json(errorResponse('Validation failed', errors));
  }

  if (err instanceof AppError) {
    logger.warn(`[${err.code}] ${err.message}`);
    const body = errorResponse(err.message);
    if (err.errors && err.errors.length) body.errors = err.errors;
    return res.status(err.statusCode).json(body);
  }

  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  return res.status(500).json(errorResponse('Internal server error'));
}

module.exports = errorHandler;
