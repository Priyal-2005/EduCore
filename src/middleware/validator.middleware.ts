import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Zod Validation Middleware Factory
 *
 * Usage:
 *   router.post('/', validateRequest(createStudentSchema), controller.method)
 *
 * Validates req.body against the provided Zod schema.
 * On failure, throws a ValidationError with field-level details.
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        for (const issue of error.issues) {
          const field = issue.path.join('.');
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(issue.message);
        }

        next(new ValidationError('Validation failed', fieldErrors));
        return;
      }

      next(error);
    }
  };
}

/**
 * Validates query parameters against a Zod schema.
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        for (const issue of error.issues) {
          const field = issue.path.join('.');
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(issue.message);
        }

        next(new ValidationError('Invalid query parameters', fieldErrors));
        return;
      }

      next(error);
    }
  };
}
