import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response.util';

/**
 * Auth Controller — HTTP request handling ONLY.
 * All business logic (hashing, JWT, etc.) lives in AuthService.
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(successResponse(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({ success: true, token: result.token, user: result.user });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.authService.getProfile(req.user!.userId);
      res.status(200).json(successResponse(user, 'Profile retrieved'));
    } catch (error) {
      next(error);
    }
  }
}
