import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { StudentRepository } from '../repositories/student.repository';
import { TeacherRepository } from '../repositories/teacher.repository';
import { RegisterDTO, LoginDTO, AuthResponse, IUser } from '../types/auth.types';
import { UserRole } from '../types/common.types';
import { env } from '../config/env';
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../utils/errors';
import logger from '../utils/logger.util';

/**
 * Auth Service — Business logic for authentication & registration.
 *
 * Handles:
 * - Password hashing (bcrypt, 12 rounds)
 * - JWT generation & validation
 * - Role-based user creation (creates User + role-specific profile)
 */
export class AuthService {
  private userRepo: UserRepository;
  private studentRepo: StudentRepository;
  private teacherRepo: TeacherRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.studentRepo = new StudentRepository();
    this.teacherRepo = new TeacherRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    // Create role-specific profile
    await this.createRoleProfile(user, data);

    // Generate JWT
    const token = this.generateToken(user);

    logger.info(`New ${data.role} registered: ${data.email}`);

    return { user, token };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by email (include password for comparison)
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    console.log("INPUT PASSWORD:", data.password);
    console.log("HASHED PASSWORD:", user.password);

    // Compare password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Strip password from response
    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword as IUser);

    logger.info(`User logged in: ${data.email}`);

    return { user: userWithoutPassword as IUser, token };
  }

  async getProfile(userId: number): Promise<IUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  // ── Private helpers ──

  private generateToken(user: IUser): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn as any }
    );
  }

  private async createRoleProfile(user: IUser, data: RegisterDTO): Promise<void> {
    switch (data.role) {
      case UserRole.STUDENT:
        await this.studentRepo.create(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
          },
          user.id
        );
        break;

      case UserRole.TEACHER:
        await this.teacherRepo.create(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            subject: data.subject || 'General',
          },
          user.id
        );
        break;

      // PARENT and ADMIN profiles can be created separately
      default:
        break;
    }
  }
}
