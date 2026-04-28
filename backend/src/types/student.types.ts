export interface IStudent {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  classId: number | null;
  parentId: number | null;
}

export interface IStudentDetail extends IStudent {
  className: string | null;
  parentName: string | null;
  email: string;
}

export interface CreateStudentDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  classId?: number;
  parentId?: number;
}

export interface UpdateStudentDTO {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  classId?: number;
  parentId?: number;
}
