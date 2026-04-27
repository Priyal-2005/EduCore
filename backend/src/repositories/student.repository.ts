import prisma from '../config/database';
import {
  IStudent,
  IStudentDetail,
  CreateStudentDTO,
  UpdateStudentDTO,
} from '../types/student.types';

/**
 * Student Repository — All Prisma operations for Students.
 *
 * Rule: NO business logic here. Only data access.
 */
export class StudentRepository {
  async create(data: CreateStudentDTO, userId: number): Promise<IStudent> {
    const student = await prisma.student.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        classId: data.classId ?? null,
        parentId: data.parentId ?? null,
      },
    });
    return student;
  }

  async findById(id: number): Promise<IStudentDetail | null> {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: { select: { name: true } },
        parent: { select: { firstName: true, lastName: true } },
        user: { select: { email: true } },
      },
    });

    if (!student) return null;

    return {
      id: student.id,
      userId: student.userId,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      enrollmentDate: student.enrollmentDate,
      classId: student.classId,
      parentId: student.parentId,
      className: student.class?.name ?? null,
      parentName: student.parent
        ? `${student.parent.firstName} ${student.parent.lastName}`
        : null,
      email: student.user.email,
    };
  }

  async findAll(): Promise<IStudent[]> {
    return prisma.student.findMany({
      orderBy: { lastName: 'asc' },
    });
  }

  async findByClassId(classId: number): Promise<IStudent[]> {
    return prisma.student.findMany({
      where: { classId },
      orderBy: { lastName: 'asc' },
    });
  }

  async countByClassId(classId: number): Promise<number> {
    return prisma.student.count({ where: { classId } });
  }

  async update(id: number, data: UpdateStudentDTO): Promise<IStudent> {
    return prisma.student.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.student.delete({ where: { id } });
  }

  async findByUserId(userId: number): Promise<IStudent | null> {
    return prisma.student.findUnique({ where: { userId } });
  }
}
