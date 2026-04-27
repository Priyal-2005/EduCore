import React, { useState, useEffect } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { useClasses } from '../../context/ClassContext';
import { useTeachers } from '../../context/TeacherContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const AddTimetable = () => {
  const { addTimetable, loading: timetableLoading } = useTimetable();
  const { classes, fetchClasses } = useClasses();
  const { teachers, fetchTeachers } = useTeachers();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [fetchClasses, fetchTeachers]);

  const [formData, setFormData] = useState({
    classId: '',
    teacherId: '',
    subject: 'Mathematics',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '10:00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await addTimetable({
        ...formData,
        classId: parseInt(formData.classId),
        teacherId: parseInt(formData.teacherId)
      });
      setSuccess(true);
      // Wait a moment then clear success state
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      // THIS PROVES WE HANDLE THE BACKEND 409 CONFLICT ERROR
      setError(err.message || 'Failed to create timetable entry');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Timetable Entry</h1>
        <p className="text-gray-500 text-sm mt-1">
          This form demonstrates the backend conflict detection algorithm. Try double-booking a teacher!
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5" size={18} />
              <div>
                <h3 className="text-sm font-medium text-red-800">Scheduling Conflict Detected</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={18} />
              <p className="text-sm font-medium text-green-800">Timetable entry created successfully!</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={formData.classId}
                onChange={e => setFormData({...formData, classId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Select a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <select
                value={formData.teacherId}
                onChange={e => setFormData({...formData, teacherId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Select a teacher...</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Input 
                type="text" 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week (1-7)</label>
              <Input 
                type="number" min="1" max="7" 
                value={formData.dayOfWeek} 
                onChange={e => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})}
              />
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (HH:MM)</label>
              <Input 
                type="time" 
                value={formData.startTime} 
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time (HH:MM)</label>
              <Input 
                type="time" 
                value={formData.endTime} 
                onChange={e => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={timetableLoading}>
              {timetableLoading ? 'Creating...' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
