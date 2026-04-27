import prisma from '../config/database';
import { IUser, RegisterDTO } from '../types/auth.types';
import { UserRole } from '../types/common.types';

/**
 * User Repository — Database operations for the User model.
 *
 * This is the ONLY place that imports Prisma for user-related queries.
 * Returns domain interfaces (IUser), never raw Prisma types.
 */
export class UserRepository {
  async create(data: {
    email: string;
    password: string;
    role: UserRole;
  }): Promise<IUser> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user as IUser;
  }

  async findByEmail(email: string): Promise<(IUser & { password: string }) | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return user as IUser & { password: string };
  }

  async findById(id: number): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user as IUser | null;
  }
}
