import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { successResponse } from '../utils/response.util';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  async mark(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await this.attendanceService.markAttendance(req.body);
      res.status(201).json(successResponse(record, 'Attendance marked'));
    } catch (error) {
      next(error);
    }
  }

  async markBulk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await this.attendanceService.markBulkAttendance(req.body);
      res.status(201).json(successResponse({ count }, `${count} attendance records created`));
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await this.attendanceService.getAttendanceByStudent(
        Number(req.params.studentId)
      );
      res.status(200).json(successResponse(records, 'Attendance retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getByClassAndDate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { classId } = req.params;
      const { date } = req.query;
      const records = await this.attendanceService.getAttendanceByClassAndDate(
        Number(classId),
        new Date(date as string)
      );
      res.status(200).json(successResponse(records, 'Attendance retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await this.attendanceService.updateAttendance(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(successResponse(record, 'Attendance updated'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.attendanceService.deleteAttendance(Number(req.params.id));
      res.status(200).json(successResponse(null, 'Attendance deleted'));
    } catch (error) {
      next(error);
    }
  }
}
