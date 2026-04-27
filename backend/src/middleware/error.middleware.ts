import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { errorResponse } from '../utils/response.util';
import logger from '../utils/logger.util';

/**
 * Global Error Handling Middleware
 *
 * Why a centralised handler?
 * - Controllers just call next(error) — zero duplication.
 * - Consistent JSON shape for every failure.
 * - Operational vs. programmer errors are handled differently.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ── Known application error ──
  if (err instanceof ValidationError) {
    logger.warn(`Validation error: ${err.message}`, { errors: err.errors });
    res.status(err.statusCode).json({
      ...errorResponse(err.message),
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    logger.warn(`App error [${err.statusCode}]: ${err.message}`);
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }

  // ── Unknown / programmer error ──
  logger.error('Unexpected error', err);
  res.status(500).json(errorResponse('Internal server error'));
}
