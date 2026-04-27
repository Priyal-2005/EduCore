/**
 * Class (as in classroom/section) domain interfaces.
 */

export interface IClass {
  id: number;
  name: string;
  section: string;
  grade: number;
}

/** Class with student count and assigned teachers */
export interface IClassDetail extends IClass {
  studentCount: number;
  teachers: {
    teacherId: number;
    teacherName: string;
    subject: string;
  }[];
}

export interface CreateClassDTO {
  name: string;
  section: string;
  grade: number;
}

export interface UpdateClassDTO {
  name?: string;
  section?: string;
  grade?: number;
}

/** DTO for assigning a teacher to a class */
export interface AssignTeacherDTO {
  teacherId: number;
  classId: number;
  subject: string;
}
