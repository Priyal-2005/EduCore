import prisma from '../config/database';
import { IGrade, IGradeWithStudent, CreateGradeDTO, UpdateGradeDTO } from '../types/grade.types';

/**
 * Grade Repository — All Prisma operations for Grades.
 */
export class GradeRepository {
  async create(data: CreateGradeDTO): Promise<IGrade> {
    return prisma.grade.create({
      data: {
        studentId: data.studentId,
        subject: data.subject,
        score: data.score,
        maxScore: data.maxScore ?? 100,
        examDate: data.examDate,
      },
    });
  }

  async findById(id: number): Promise<IGradeWithStudent | null> {
    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student: { select: { firstName: true, lastName: true } },
      },
    });

    if (!grade) return null;

    return {
      ...grade,
      studentName: `${grade.student.firstName} ${grade.student.lastName}`,
    };
  }

  async findByStudentId(studentId: number): Promise<IGrade[]> {
    return prisma.grade.findMany({
      where: { studentId },
      orderBy: { examDate: 'desc' },
    });
  }

  async findByStudentAndSubject(studentId: number, subject: string): Promise<IGrade[]> {
    return prisma.grade.findMany({
      where: { studentId, subject },
      orderBy: { examDate: 'desc' },
    });
  }

  async update(id: number, data: UpdateGradeDTO): Promise<IGrade> {
    return prisma.grade.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.grade.delete({ where: { id } });
  }
}
