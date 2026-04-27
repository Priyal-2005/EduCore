export interface Student {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  enrollmentDate: string;
  classId: number | null;
  parentId: number | null;
}

export interface StudentDetail extends Student {
  className: string | null;
  parentName: string | null;
  email: string;
}

export interface Teacher {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  subject: string;
  hireDate: string;
}

export interface Timetable {
  id: number;
  classId: number;
  teacherId: number;
  subject: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface TimetableDetail extends Timetable {
  className: string;
  teacherName: string;
}

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
