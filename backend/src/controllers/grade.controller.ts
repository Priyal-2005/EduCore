import { Request, Response, NextFunction } from 'express';
import { GradeService } from '../services/grade.service';
import { successResponse } from '../utils/response.util';

export class GradeController {
  private gradeService: GradeService;

  constructor() {
    this.gradeService = new GradeService();
  }

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const grade = await this.gradeService.addGrade(req.body);
      res.status(201).json(successResponse(grade, 'Grade added'));
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const grades = await this.gradeService.getGradesByStudent(Number(req.params.studentId));
      res.status(200).json(successResponse(grades, 'Grades retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getAverage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const average = await this.gradeService.getStudentAverage(Number(req.params.studentId));
      res.status(200).json(successResponse(average, 'Grade average calculated'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const grade = await this.gradeService.updateGrade(Number(req.params.id), req.body);
      res.status(200).json(successResponse(grade, 'Grade updated'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.gradeService.deleteGrade(Number(req.params.id));
      res.status(200).json(successResponse(null, 'Grade deleted'));
    } catch (error) {
      next(error);
    }
  }
}
