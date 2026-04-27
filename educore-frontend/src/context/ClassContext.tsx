import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

export interface ClassData {
  id: number;
  name: string;
  section: string;
  grade: number;
}

interface ClassContextType {
  classes: ClassData[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/classes');
      setClasses(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ClassContext.Provider value={{ classes, loading, error, fetchClasses }}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
};
