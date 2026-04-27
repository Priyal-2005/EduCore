/**
 * Custom Error Hierarchy
 *
 * All application errors extend AppError, which carries an HTTP status code.
 * The global error middleware maps these to consistent JSON responses.
 *
 * Why custom errors?
 * - Controllers never set status codes manually.
 * - Services throw domain-specific errors; the middleware handles serialisation.
 * - Makes it trivial to add new error types (just extend AppError).
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Preserve correct prototype chain (TS class extends built-in)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/** 400 — Client sent invalid data */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/** 401 — Missing or invalid authentication */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/** 403 — Authenticated but lacks permission */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/** 404 — Resource does not exist */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/** 409 — Conflicting state (e.g., timetable double-booking) */
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/** 422 — Validation failure */
export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(message = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, 422);
    this.errors = errors;
  }
}
