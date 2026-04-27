import { TeacherRepository } from '../repositories/teacher.repository';
import {
  ITeacher,
  ITeacherDetail,
  CreateTeacherDTO,
  UpdateTeacherDTO,
} from '../types/teacher.types';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger.util';

/**
 * Teacher Service — Business logic for teacher operations.
 */
export class TeacherService {
  private teacherRepo: TeacherRepository;

  constructor() {
    this.teacherRepo = new TeacherRepository();
  }

  async createTeacher(data: CreateTeacherDTO, userId: number): Promise<ITeacher> {
    const teacher = await this.teacherRepo.create(data, userId);
    logger.info(`Teacher created: ${data.firstName} ${data.lastName} (ID: ${teacher.id})`);
    return teacher;
  }

  async getTeacherById(id: number): Promise<ITeacherDetail> {
    const teacher = await this.teacherRepo.findById(id);
    if (!teacher) {
      throw new NotFoundError(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async getAllTeachers(): Promise<ITeacher[]> {
    return this.teacherRepo.findAll();
  }

  async updateTeacher(id: number, data: UpdateTeacherDTO): Promise<ITeacher> {
    const existing = await this.teacherRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Teacher with ID ${id} not found`);
    }

    const updated = await this.teacherRepo.update(id, data);
    logger.info(`Teacher updated: ID ${id}`);
    return updated;
  }

  async deleteTeacher(id: number): Promise<void> {
    const existing = await this.teacherRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Teacher with ID ${id} not found`);
    }

    await this.teacherRepo.delete(id);
    logger.info(`Teacher deleted: ID ${id}`);
  }
}
