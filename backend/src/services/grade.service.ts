import { GradeRepository } from '../repositories/grade.repository';
import { StudentRepository } from '../repositories/student.repository';
import {
  IGrade,
  CreateGradeDTO,
  UpdateGradeDTO,
  StudentGradeAverage,
} from '../types/grade.types';
import { NotFoundError, BadRequestError } from '../utils/errors';
import logger from '../utils/logger.util';

/**
 * Grade Service — Business logic for grade management.
 *
 * Key feature: Average calculation is PURE business logic (not a DB aggregation).
 */
export class GradeService {
  private gradeRepo: GradeRepository;
  private studentRepo: StudentRepository;

  constructor() {
    this.gradeRepo = new GradeRepository();
    this.studentRepo = new StudentRepository();
  }

  async addGrade(data: CreateGradeDTO): Promise<IGrade> {
    const student = await this.studentRepo.findById(data.studentId);
    if (!student) {
      throw new NotFoundError(`Student with ID ${data.studentId} not found`);
    }

    if (data.score < 0 || data.score > (data.maxScore ?? 100)) {
      throw new BadRequestError(
        `Score must be between 0 and ${data.maxScore ?? 100}`
      );
    }

    const grade = await this.gradeRepo.create(data);
    logger.info(`Grade added: Student ${data.studentId}, ${data.subject}: ${data.score}`);
    return grade;
  }

  async getGradesByStudent(studentId: number): Promise<IGrade[]> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new NotFoundError(`Student with ID ${studentId} not found`);
    }
    return this.gradeRepo.findByStudentId(studentId);
  }

  /**
   * Calculate student's grade averages — BUSINESS LOGIC.
   * Computes both per-subject and overall averages as percentages.
   */
  async getStudentAverage(studentId: number): Promise<StudentGradeAverage> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new NotFoundError(`Student with ID ${studentId} not found`);
    }

    const grades = await this.gradeRepo.findByStudentId(studentId);

    if (grades.length === 0) {
      return {
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        overallAverage: 0,
        subjectAverages: [],
      };
    }

    // Group grades by subject
    const bySubject = new Map<string, IGrade[]>();
    for (const grade of grades) {
      const existing = bySubject.get(grade.subject) || [];
      existing.push(grade);
      bySubject.set(grade.subject, existing);
    }

    // Calculate per-subject averages (as percentage of maxScore)
    const subjectAverages = Array.from(bySubject.entries()).map(
      ([subject, subjectGrades]) => {
        const totalPercentage = subjectGrades.reduce(
          (sum, g) => sum + (g.score / g.maxScore) * 100,
          0
        );
        return {
          subject,
          average: Math.round((totalPercentage / subjectGrades.length) * 100) / 100,
          totalExams: subjectGrades.length,
        };
      }
    );

    // Overall average across all subjects
    const overallAverage =
      Math.round(
        (subjectAverages.reduce((sum, s) => sum + s.average, 0) /
          subjectAverages.length) *
          100
      ) / 100;

    return {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      overallAverage,
      subjectAverages,
    };
  }

  async updateGrade(id: number, data: UpdateGradeDTO): Promise<IGrade> {
    const existing = await this.gradeRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Grade with ID ${id} not found`);
    }
    return this.gradeRepo.update(id, data);
  }

  async deleteGrade(id: number): Promise<void> {
    const existing = await this.gradeRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Grade with ID ${id} not found`);
    }
    await this.gradeRepo.delete(id);
    logger.info(`Grade deleted: ID ${id}`);
  }
}
