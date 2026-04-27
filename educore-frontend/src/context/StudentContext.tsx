import React, { createContext, useContext, useState, useCallback } from 'react';
import { Student } from '../types';
import api from '../services/api';

interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  addStudent: (data: Partial<Student>) => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/students');
      setStudents(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  const addStudent = async (data: Partial<Student>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/students', data);
      setStudents(prev => [...prev, response.data.data]);
    } catch (err: any) {
      setError(err.message || 'Failed to add student');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentContext.Provider value={{ students, loading, error, fetchStudents, addStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
