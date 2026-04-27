/**
 * Timetable domain interfaces.
 */

export interface ITimetable {
  id: number;
  classId: number;
  teacherId: number;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/** Timetable entry with resolved names for display */
export interface ITimetableDetail extends ITimetable {
  className: string;
  teacherName: string;
}

export interface CreateTimetableDTO {
  classId: number;
  teacherId: number;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/** Represents a scheduling conflict found during validation */
export interface TimetableConflict {
  conflictType: 'TEACHER_BUSY' | 'CLASS_OCCUPIED';
  existingEntry: ITimetableDetail;
  message: string;
}
