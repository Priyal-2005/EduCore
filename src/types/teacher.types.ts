/**
 * Teacher domain interfaces.
 */

export interface ITeacher {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  subject: string;
  hireDate: Date;
}

/** Teacher with their class assignments */
export interface ITeacherDetail extends ITeacher {
  email: string;
  classes: {
    classId: number;
    className: string;
    subject: string;
  }[];
}

export interface CreateTeacherDTO {
  firstName: string;
  lastName: string;
  subject: string;
}

export interface UpdateTeacherDTO {
  firstName?: string;
  lastName?: string;
  subject?: string;
}
