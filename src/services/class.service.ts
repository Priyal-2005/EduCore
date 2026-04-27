import { ClassRepository } from '../repositories/class.repository';
import {
  IClass,
  IClassDetail,
  CreateClassDTO,
  UpdateClassDTO,
  AssignTeacherDTO,
} from '../types/class.types';
import { TeacherRepository } from '../repositories/teacher.repository';
import { ConflictError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger.util';

/**
 * Class Service — Business logic for classroom operations.
 */
export class ClassService {
  private classRepo: ClassRepository;
  private teacherRepo: TeacherRepository;

  constructor() {
    this.classRepo = new ClassRepository();
    this.teacherRepo = new TeacherRepository();
  }

  async createClass(data: CreateClassDTO): Promise<IClass> {
    // Check for duplicate class name
    const existing = await this.classRepo.findByName(data.name);
    if (existing) {
      throw new ConflictError(`Class "${data.name}" already exists`);
    }

    const cls = await this.classRepo.create(data);
    logger.info(`Class created: ${data.name} (ID: ${cls.id})`);
    return cls;
  }

  async getClassById(id: number): Promise<IClassDetail> {
    const cls = await this.classRepo.findById(id);
    if (!cls) {
      throw new NotFoundError(`Class with ID ${id} not found`);
    }
    return cls;
  }

  async getAllClasses(): Promise<IClass[]> {
    return this.classRepo.findAll();
  }

  async updateClass(id: number, data: UpdateClassDTO): Promise<IClass> {
    const existing = await this.classRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Class with ID ${id} not found`);
    }

    // If renaming, check for duplicates
    if (data.name && data.name !== existing.name) {
      const duplicate = await this.classRepo.findByName(data.name);
      if (duplicate) {
        throw new ConflictError(`Class "${data.name}" already exists`);
      }
    }

    const updated = await this.classRepo.update(id, data);
    logger.info(`Class updated: ID ${id}`);
    return updated;
  }

  async deleteClass(id: number): Promise<void> {
    const existing = await this.classRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Class with ID ${id} not found`);
    }

    await this.classRepo.delete(id);
    logger.info(`Class deleted: ID ${id}`);
  }

  async assignTeacher(data: AssignTeacherDTO): Promise<void> {
    // Verify teacher exists
    const teacher = await this.teacherRepo.findById(data.teacherId);
    if (!teacher) {
      throw new NotFoundError(`Teacher with ID ${data.teacherId} not found`);
    }

    // Verify class exists
    const cls = await this.classRepo.findById(data.classId);
    if (!cls) {
      throw new NotFoundError(`Class with ID ${data.classId} not found`);
    }

    await this.classRepo.assignTeacher(data);
    logger.info(
      `Teacher ${teacher.firstName} ${teacher.lastName} assigned to ${cls.name} for ${data.subject}`
    );
  }

  async removeTeacher(teacherId: number, classId: number, subject: string): Promise<void> {
    await this.classRepo.removeTeacher(teacherId, classId, subject);
    logger.info(`Teacher ${teacherId} removed from class ${classId} for ${subject}`);
  }
}
