/**
 * Grade domain interfaces.
 */

export interface IGrade {
  id: number;
  studentId: number;
  subject: string;
  score: number;
  maxScore: number;
  examDate: Date;
}

/** Grade with student name for display */
export interface IGradeWithStudent extends IGrade {
  studentName: string;
}

export interface CreateGradeDTO {
  studentId: number;
  subject: string;
  score: number;
  maxScore?: number;
  examDate: Date;
}

export interface UpdateGradeDTO {
  score?: number;
  maxScore?: number;
}

/** Computed average for a student */
export interface StudentGradeAverage {
  studentId: number;
  studentName: string;
  overallAverage: number;
  subjectAverages: {
    subject: string;
    average: number;
    totalExams: number;
  }[];
}
