import { Request, Response, NextFunction } from 'express';
import { ClassService } from '../services/class.service';
import { successResponse } from '../utils/response.util';

export class ClassController {
  private classService: ClassService;

  constructor() {
    this.classService = new ClassService();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cls = await this.classService.createClass(req.body);
      res.status(201).json(successResponse(cls, 'Class created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classes = await this.classService.getAllClasses();
      res.status(200).json(successResponse(classes, 'Classes retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cls = await this.classService.getClassById(Number(req.params.id));
      res.status(200).json(successResponse(cls, 'Class retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cls = await this.classService.updateClass(Number(req.params.id), req.body);
      res.status(200).json(successResponse(cls, 'Class updated'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.classService.deleteClass(Number(req.params.id));
      res.status(200).json(successResponse(null, 'Class deleted'));
    } catch (error) {
      next(error);
    }
  }

  async assignTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.classService.assignTeacher(req.body);
      res.status(201).json(successResponse(null, 'Teacher assigned to class'));
    } catch (error) {
      next(error);
    }
  }

  async removeTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { teacherId, classId, subject } = req.params;
      await this.classService.removeTeacher(Number(teacherId), Number(classId), subject);
      res.status(200).json(successResponse(null, 'Teacher removed from class'));
    } catch (error) {
      next(error);
    }
  }
}
