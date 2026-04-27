import prisma from '../config/database';
import {
  ITeacher,
  ITeacherDetail,
  CreateTeacherDTO,
  UpdateTeacherDTO,
} from '../types/teacher.types';

/**
 * Teacher Repository — All Prisma operations for Teachers.
 */
export class TeacherRepository {
  async create(data: CreateTeacherDTO, userId: number): Promise<ITeacher> {
    return prisma.teacher.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        subject: data.subject,
      },
    });
  }

  async findById(id: number): Promise<ITeacherDetail | null> {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        classes: {
          include: {
            class: { select: { name: true } },
          },
        },
      },
    });

    if (!teacher) return null;

    return {
      id: teacher.id,
      userId: teacher.userId,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      subject: teacher.subject,
      hireDate: teacher.hireDate,
      email: teacher.user.email,
      classes: teacher.classes.map((tc) => ({
        classId: tc.classId,
        className: tc.class.name,
        subject: tc.subject,
      })),
    };
  }

  async findAll(): Promise<ITeacher[]> {
    return prisma.teacher.findMany({
      orderBy: { lastName: 'asc' },
    });
  }

  async update(id: number, data: UpdateTeacherDTO): Promise<ITeacher> {
    return prisma.teacher.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.teacher.delete({ where: { id } });
  }

  async findByUserId(userId: number): Promise<ITeacher | null> {
    return prisma.teacher.findUnique({ where: { userId } });
  }
}
