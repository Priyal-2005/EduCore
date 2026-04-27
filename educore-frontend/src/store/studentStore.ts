import { create } from 'zustand';
import { Student } from '../types';
import api from '../services/api';

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  addStudent: (data: Partial<Student>) => Promise<void>;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/students');
      set({ students: response.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addStudent: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/students', data);
      set((state) => ({
        students: [...state.students, response.data.data],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error; // Rethrow to let UI handle it
    }
  },
}));
