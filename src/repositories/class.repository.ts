import prisma from '../config/database';
import {
  IClass,
  IClassDetail,
  CreateClassDTO,
  UpdateClassDTO,
  AssignTeacherDTO,
} from '../types/class.types';

/**
 * Class Repository — All Prisma operations for Classes.
 */
export class ClassRepository {
  async create(data: CreateClassDTO): Promise<IClass> {
    return prisma.class.create({ data });
  }

  async findById(id: number): Promise<IClassDetail | null> {
    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: { select: { students: true } },
        teachers: {
          include: {
            teacher: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!cls) return null;

    return {
      id: cls.id,
      name: cls.name,
      section: cls.section,
      grade: cls.grade,
      studentCount: cls._count.students,
      teachers: cls.teachers.map((tc) => ({
        teacherId: tc.teacherId,
        teacherName: `${tc.teacher.firstName} ${tc.teacher.lastName}`,
        subject: tc.subject,
      })),
    };
  }

  async findAll(): Promise<IClass[]> {
    return prisma.class.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async update(id: number, data: UpdateClassDTO): Promise<IClass> {
    return prisma.class.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.class.delete({ where: { id } });
  }

  async findByName(name: string): Promise<IClass | null> {
    return prisma.class.findUnique({ where: { name } });
  }

  async assignTeacher(data: AssignTeacherDTO): Promise<void> {
    await prisma.teacherOnClass.create({
      data: {
        teacherId: data.teacherId,
        classId: data.classId,
        subject: data.subject,
      },
    });
  }

  async removeTeacher(teacherId: number, classId: number, subject: string): Promise<void> {
    await prisma.teacherOnClass.delete({
      where: {
        teacherId_classId_subject: { teacherId, classId, subject },
      },
    });
  }
}
