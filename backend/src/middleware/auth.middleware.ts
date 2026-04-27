import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

/**
 * JWT Payload shape after verification.
 */
export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Extend Express Request to carry authenticated user data.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication Middleware
 *
 * Extracts and verifies the Bearer token from the Authorization header.
 * On success, attaches the decoded payload to req.user for downstream use.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed authorization header');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

/**
 * Role-Based Authorization Middleware Factory
 *
 * Usage: router.get('/admin-only', authMiddleware, authorizeRoles('ADMIN'), handler)
 */
export function authorizeRoles(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError(`Role '${req.user.role}' is not authorized for this resource`));
      return;
    }

    next();
  };
}
