import { Request, Response, NextFunction } from 'express';
import { TimetableService } from '../services/timetable.service';
import { successResponse } from '../utils/response.util';

export class TimetableController {
  private timetableService: TimetableService;

  constructor() {
    this.timetableService = new TimetableService();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entry = await this.timetableService.createEntry(req.body);
      res.status(201).json(successResponse(entry, 'Timetable entry created'));
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entries = await this.timetableService.getAll();
      res.status(200).json(successResponse(entries, 'Timetable retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entry = await this.timetableService.getEntryById(Number(req.params.id));
      res.status(200).json(successResponse(entry, 'Timetable entry retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getByClass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entries = await this.timetableService.getByClassId(Number(req.params.classId));
      res.status(200).json(successResponse(entries, 'Class timetable retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.timetableService.deleteEntry(Number(req.params.id));
      res.status(200).json(successResponse(null, 'Timetable entry deleted'));
    } catch (error) {
      next(error);
    }
  }
}
