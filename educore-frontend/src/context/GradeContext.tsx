import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

export interface Grade {
  id: number;
  studentId: number;
  subject: string;
  score: number;
  maxScore: number;
  examDate: string;
}

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

interface GradeContextType {
  grades: Grade[];
  averages: Record<number, StudentGradeAverage>;
  loading: boolean;
  error: string | null;
  fetchGradesByStudent: (studentId: number) => Promise<void>;
  fetchAverageByStudent: (studentId: number) => Promise<void>;
  addGrade: (data: Partial<Grade>) => Promise<void>;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export const GradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [averages, setAverages] = useState<Record<number, StudentGradeAverage>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGradesByStudent = useCallback(async (studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/grades/student/${studentId}`);
      setGrades(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAverageByStudent = useCallback(async (studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/grades/student/${studentId}/average`);
      setAverages(prev => ({ ...prev, [studentId]: response.data.data }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch averages');
    } finally {
      setLoading(false);
    }
  }, []);

  const addGrade = async (data: Partial<Grade>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/grades', data);
      setGrades(prev => [...prev, response.data.data]);
    } catch (err: any) {
      setError(err.message || 'Failed to add grade');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradeContext.Provider value={{ grades, averages, loading, error, fetchGradesByStudent, fetchAverageByStudent, addGrade }}>
      {children}
    </GradeContext.Provider>
  );
};

export const useGrades = () => {
  const context = useContext(GradeContext);
  if (context === undefined) {
    throw new Error('useGrades must be used within a GradeProvider');
  }
  return context;
};
