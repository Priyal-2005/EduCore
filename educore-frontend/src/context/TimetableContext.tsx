import React, { createContext, useContext, useState, useCallback } from 'react';
import { TimetableDetail } from '../types';
import api from '../services/api';

interface TimetableContextType {
  entries: TimetableDetail[];
  loading: boolean;
  error: string | null;
  fetchTimetables: () => Promise<void>;
  addTimetable: (data: any) => Promise<void>;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<TimetableDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/timetables');
      setEntries(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timetables');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTimetable = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/timetables', data);
      setEntries(prev => [...prev, response.data.data]);
    } catch (err: any) {
      setError(err.message || 'Failed to create timetable entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TimetableContext.Provider value={{ entries, loading, error, fetchTimetables, addTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
