import { Request, Response, NextFunction } from 'express';
import { TeacherService } from '../services/teacher.service';
import { successResponse } from '../utils/response.util';

export class TeacherController {
  private teacherService: TeacherService;

  constructor() {
    this.teacherService = new TeacherService();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teacher = await this.teacherService.createTeacher(req.body, req.user!.userId);
      res.status(201).json(successResponse(teacher, 'Teacher created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teachers = await this.teacherService.getAllTeachers();
      res.status(200).json(successResponse(teachers, 'Teachers retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teacher = await this.teacherService.getTeacherById(Number(req.params.id));
      res.status(200).json(successResponse(teacher, 'Teacher retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teacher = await this.teacherService.updateTeacher(Number(req.params.id), req.body);
      res.status(200).json(successResponse(teacher, 'Teacher updated'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.teacherService.deleteTeacher(Number(req.params.id));
      res.status(200).json(successResponse(null, 'Teacher deleted'));
    } catch (error) {
      next(error);
    }
  }
}
