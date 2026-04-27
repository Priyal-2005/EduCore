/**
 * Shared types used across multiple domains.
 */

/** Standard pagination parameters from query string */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** Sort direction */
export type SortOrder = 'asc' | 'desc';

/** Generic ID parameter */
export interface IdParam {
  id: number;
}

/** User roles (mirrors Prisma enum but decouples from ORM) */
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

/** Attendance status (mirrors Prisma enum) */
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

/** Days of week mapping */
export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}
