import { StudentRepository } from '../repositories/student.repository';
import { ClassRepository } from '../repositories/class.repository';
import {
  IStudent,
  IStudentDetail,
  CreateStudentDTO,
  UpdateStudentDTO,
} from '../types/student.types';
import { BadRequestError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger.util';

/** Maximum students per class — business rule */
const MAX_CLASS_CAPACITY = 40;

/**
 * Student Service — All business logic for student operations.
 *
 * Demonstrates:
 * - Class capacity validation (business rule)
 * - Clean delegation to repository
 * - Proper error handling with domain-specific messages
 */
export class StudentService {
  private studentRepo: StudentRepository;
  private classRepo: ClassRepository;

  constructor() {
    this.studentRepo = new StudentRepository();
    this.classRepo = new ClassRepository();
  }

  async enrollStudent(data: CreateStudentDTO, userId: number): Promise<IStudent> {
    // Business rule: validate class capacity before enrollment
    if (data.classId) {
      await this.validateClassCapacity(data.classId);
    }

    const student = await this.studentRepo.create(data, userId);
    logger.info(`Student enrolled: ${data.firstName} ${data.lastName} (ID: ${student.id})`);
    return student;
  }

  async getStudentById(id: number): Promise<IStudentDetail> {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }
    return student;
  }

  async getAllStudents(): Promise<IStudent[]> {
    return this.studentRepo.findAll();
  }

  async getStudentsByClass(classId: number): Promise<IStudent[]> {
    // Verify class exists
    const cls = await this.classRepo.findById(classId);
    if (!cls) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    return this.studentRepo.findByClassId(classId);
  }

  async updateStudent(id: number, data: UpdateStudentDTO): Promise<IStudent> {
    // Verify student exists
    const existing = await this.studentRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }

    // If changing class, validate capacity
    if (data.classId && data.classId !== existing.classId) {
      await this.validateClassCapacity(data.classId);
    }

    const updated = await this.studentRepo.update(id, data);
    logger.info(`Student updated: ID ${id}`);
    return updated;
  }

  async deleteStudent(id: number): Promise<void> {
    const existing = await this.studentRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Student with ID ${id} not found`);
    }

    await this.studentRepo.delete(id);
    logger.info(`Student deleted: ID ${id}`);
  }

  // ── Private business logic ──

  private async validateClassCapacity(classId: number): Promise<void> {
    const cls = await this.classRepo.findById(classId);
    if (!cls) {
      throw new NotFoundError(`Class with ID ${classId} not found`);
    }

    const currentCount = await this.studentRepo.countByClassId(classId);
    if (currentCount >= MAX_CLASS_CAPACITY) {
      throw new BadRequestError(
        `Class "${cls.name}" is full (${currentCount}/${MAX_CLASS_CAPACITY} students)`
      );
    }
  }
}
