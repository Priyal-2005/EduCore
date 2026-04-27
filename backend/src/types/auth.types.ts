import { UserRole } from './common.types';

/**
 * Auth domain interfaces.
 */

export interface IUser {
  id: number;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/** What the client sends for registration */
export interface RegisterDTO {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  // Role-specific optional fields
  subject?: string;       // Teacher
  dateOfBirth?: string;   // Student
  phoneNumber?: string;   // Parent
}

/** What the client sends for login */
export interface LoginDTO {
  email: string;
  password: string;
}

/** What the server returns after successful auth */
export interface AuthResponse {
  user: IUser;
  token: string;
}
