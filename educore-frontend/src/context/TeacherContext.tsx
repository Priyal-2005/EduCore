import React, { createContext, useContext, useState, useCallback } from 'react';
import { Teacher } from '../types';
import api from '../services/api';

interface TeacherContextType {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  fetchTeachers: () => Promise<void>;
  addTeacher: (data: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: number) => Promise<void>;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/teachers');
      setTeachers(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTeacher = async (data: Partial<Teacher>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/teachers', data);
      setTeachers(prev => [...prev, response.data.data]);
    } catch (err: any) {
      setError(err.message || 'Failed to add teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/teachers/${id}`);
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete teacher');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherContext.Provider value={{ teachers, loading, error, fetchTeachers, addTeacher, deleteTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeachers = () => {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error('useTeachers must be used within a TeacherProvider');
  }
  return context;
};
