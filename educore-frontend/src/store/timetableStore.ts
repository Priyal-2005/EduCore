import { create } from 'zustand';
import { TimetableDetail } from '../types';
import api from '../services/api';

interface TimetableState {
  entries: TimetableDetail[];
  loading: boolean;
  error: string | null;
  fetchTimetables: () => Promise<void>;
  addTimetable: (data: any) => Promise<void>;
}

export const useTimetableStore = create<TimetableState>((set) => ({
  entries: [],
  loading: false,
  error: null,

  fetchTimetables: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/timetables');
      set({ entries: response.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addTimetable: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/timetables', data);
      set((state) => ({
        entries: [...state.entries, response.data.data],
        loading: false,
      }));
    } catch (error: any) {
      // We explicitly capture the 409 conflict message here
      set({ error: error.message, loading: false });
      throw error; // Let UI catch it to show the toast/alert
    }
  },
}));
