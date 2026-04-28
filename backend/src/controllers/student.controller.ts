import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { successResponse } from '../utils/response.util';

/**
 * Student Controller — HTTP request handling ONLY.
 * NO business logic. NO Prisma imports.
 */
export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  async enroll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.studentService.enrollStudent(req.body, req.user!.userId);
      res.status(201).json(successResponse(student, 'Student enrolled successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const students = await this.studentService.getAllStudents();
      res.status(200).json(successResponse(students, 'Students retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.studentService.getStudentById(Number(req.params.id));
      res.status(200).json(successResponse(student, 'Student retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getByClass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const students = await this.studentService.getStudentsByClass(Number(req.params.classId));
      res.status(200).json(successResponse(students, 'Students retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await this.studentService.updateStudent(Number(req.params.id), req.body);
      res.status(200).json(successResponse(student, 'Student updated'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.studentService.deleteStudent(Number(req.params.id));
      res.status(200).json(successResponse(null, 'Student deleted'));
    } catch (error) {
      next(error);
    }
  }
}
