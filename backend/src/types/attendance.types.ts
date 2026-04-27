import { AttendanceStatus } from './common.types';

/**
 * Attendance domain interfaces.
 */

export interface IAttendance {
  id: number;
  studentId: number;
  date: Date;
  status: AttendanceStatus;
}

/** Attendance record with student name for display */
export interface IAttendanceWithStudent extends IAttendance {
  studentName: string;
}

export interface CreateAttendanceDTO {
  studentId: number;
  date: Date;
  status: AttendanceStatus;
}

/** Bulk attendance for marking an entire class at once */
export interface BulkAttendanceDTO {
  classId: number;
  date: Date;
  records: {
    studentId: number;
    status: AttendanceStatus;
  }[];
}

export interface UpdateAttendanceDTO {
  status: AttendanceStatus;
}
