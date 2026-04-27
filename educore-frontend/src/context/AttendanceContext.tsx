import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

export interface Attendance {
  id: number;
  studentId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface AttendanceWithStudent extends Attendance {
  studentName: string;
}

interface AttendanceContextType {
  records: AttendanceWithStudent[];
  loading: boolean;
  error: string | null;
  fetchByClassAndDate: (classId: number, date: string) => Promise<void>;
  markAttendance: (data: any) => Promise<void>;
  markBulkAttendance: (data: any) => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<AttendanceWithStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByClassAndDate = useCallback(async (classId: number, date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/attendance/class/${classId}?date=${date}`);
      setRecords(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAttendance = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/attendance', data);
      // We don't necessarily append to records here because the view might be for a different date/class
    } catch (err: any) {
      setError(err.message || 'Failed to mark attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markBulkAttendance = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/attendance/bulk', data);
    } catch (err: any) {
      setError(err.message || 'Failed to mark bulk attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider value={{ records, loading, error, fetchByClassAndDate, markAttendance, markBulkAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
