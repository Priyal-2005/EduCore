import { z } from 'zod';

/**
 * Zod validation schemas for all API endpoints.
 * Centralised here to keep validators separate from route definitions.
 */

// ━━━ Auth ━━━

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  subject: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// ━━━ Student ━━━

export const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).transform((val) => new Date(val)),
  classId: z.number().int().positive().optional(),
  parentId: z.number().int().positive().optional(),
});

export const updateStudentSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).transform((val) => new Date(val)).optional(),
  classId: z.number().int().positive().nullable().optional(),
  parentId: z.number().int().positive().nullable().optional(),
});

// ━━━ Teacher ━━━

export const createTeacherSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  subject: z.string().min(1, 'Subject is required').max(100),
});

export const updateTeacherSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  subject: z.string().min(1).max(100).optional(),
});

// ━━━ Class ━━━

export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(50),
  section: z.string().min(1, 'Section is required').max(10),
  grade: z.number().int().min(1).max(12),
});

export const updateClassSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  section: z.string().min(1).max(10).optional(),
  grade: z.number().int().min(1).max(12).optional(),
});

export const assignTeacherSchema = z.object({
  teacherId: z.number().int().positive('Teacher ID is required'),
  classId: z.number().int().positive('Class ID is required'),
  subject: z.string().min(1, 'Subject is required'),
});

// ━━━ Timetable ━━━

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTimetableSchema = z.object({
  classId: z.number().int().positive('Class ID is required'),
  teacherId: z.number().int().positive('Teacher ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  dayOfWeek: z.number().int().min(1, 'Day must be 1-7').max(7, 'Day must be 1-7'),
  startTime: z.string().regex(timeRegex, 'Time must be in HH:MM format'),
  endTime: z.string().regex(timeRegex, 'Time must be in HH:MM format'),
}).refine((data) => data.startTime < data.endTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

// ━━━ Attendance ━━━

export const createAttendanceSchema = z.object({
  studentId: z.number().int().positive('Student ID is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).transform((val) => new Date(val)),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
});

export const bulkAttendanceSchema = z.object({
  classId: z.number().int().positive('Class ID is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).transform((val) => new Date(val)),
  records: z.array(z.object({
    studentId: z.number().int().positive(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
  })).min(1, 'At least one record is required'),
});

export const updateAttendanceSchema = z.object({
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
});

// ━━━ Grade ━━━

export const createGradeSchema = z.object({
  studentId: z.number().int().positive('Student ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  score: z.number().min(0, 'Score must be >= 0'),
  maxScore: z.number().positive().optional(),
  examDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).transform((val) => new Date(val)),
});

export const updateGradeSchema = z.object({
  score: z.number().min(0).optional(),
  maxScore: z.number().positive().optional(),
});
