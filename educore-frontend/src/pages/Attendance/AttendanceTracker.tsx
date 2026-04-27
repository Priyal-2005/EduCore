import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useClasses } from '../../context/ClassContext';
import { useStudents } from '../../context/StudentContext';
import { Button } from '../../components/ui/button';

export const AttendanceTracker = () => {
  const { markBulkAttendance, loading } = useAttendance();
  const { classes, fetchClasses } = useClasses();
  const { students, fetchStudents } = useStudents();
  
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Local state to track attendance before submitting
  const [attendanceData, setAttendanceData] = useState<Record<number, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, [fetchClasses, fetchStudents]);

  const classStudents = students.filter(s => selectedClass && s.classId === parseInt(selectedClass));

  // Initialize attendance data to PRESENT by default when class changes
  useEffect(() => {
    if (classStudents.length > 0) {
      const initialData: Record<number, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
      classStudents.forEach(s => {
        initialData[s.id] = 'PRESENT'; // Default
      });
      setAttendanceData(initialData);
    } else {
      setAttendanceData({});
    }
  }, [selectedClass, students]);

  const handleStatusChange = (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedClass) {
      setError('Please select a class');
      return;
    }

    if (classStudents.length === 0) {
      setError('No students in this class');
      return;
    }

    try {
      const records = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status
      }));

      await markBulkAttendance({
        classId: parseInt(selectedClass),
        date: attendanceDate,
        records
      });
      
      setSuccess('Attendance recorded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to record attendance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">Record daily attendance for classes.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
          {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded">{success}</div>}

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Select a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              />
            </div>
          </div>

          {selectedClass && (
            <div className="mt-8">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3 text-center">Present</th>
                    <th className="px-6 py-3 text-center">Absent</th>
                    <th className="px-6 py-3 text-center">Late</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {classStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          checked={attendanceData[student.id] === 'PRESENT'}
                          onChange={() => handleStatusChange(student.id, 'PRESENT')}
                          className="w-4 h-4 text-primary"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          checked={attendanceData[student.id] === 'ABSENT'}
                          onChange={() => handleStatusChange(student.id, 'ABSENT')}
                          className="w-4 h-4 text-red-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="radio" 
                          name={`status-${student.id}`} 
                          checked={attendanceData[student.id] === 'LATE'}
                          onChange={() => handleStatusChange(student.id, 'LATE')}
                          className="w-4 h-4 text-yellow-500"
                        />
                      </td>
                    </tr>
                  ))}
                  {classStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No students enrolled in this class.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {classStudents.length > 0 && (
                <div className="flex justify-end pt-6">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Attendance'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
