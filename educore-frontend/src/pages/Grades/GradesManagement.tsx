import React, { useState } from 'react';
import { useGrades } from '../../context/GradeContext';
import { useClasses } from '../../context/ClassContext';
import { useStudents } from '../../context/StudentContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const GradesManagement = () => {
  const { addGrade, loading } = useGrades();
  const { classes } = useClasses();
  const { students, fetchStudents } = useStudents();
  
  const [selectedClass, setSelectedClass] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    maxScore: '100',
    examDate: new Date().toISOString().split('T')[0]
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // When class changes, we should ideally fetch students for that class.
  // We'll just filter the existing fetched students for now if they're loaded,
  // or you could call fetchStudentsByClass.
  const classStudents = students.filter(s => selectedClass ? s.classId === parseInt(selectedClass) : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.studentId || !formData.subject || !formData.score || !formData.examDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await addGrade({
        studentId: parseInt(formData.studentId),
        subject: formData.subject,
        score: parseFloat(formData.score),
        maxScore: parseFloat(formData.maxScore),
        examDate: formData.examDate,
      });
      setSuccess('Grade added successfully!');
      setFormData({ ...formData, score: '' }); // Reset score
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add grade');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Grades Management</h1>
        <p className="text-gray-500 text-sm mt-1">Record student exam grades.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
          {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded">{success}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Class</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
              <select
                value={formData.studentId}
                onChange={e => setFormData({...formData, studentId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Select a student...</option>
                {classStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <Input 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="e.g. Mathematics"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score *</label>
              <Input 
                type="number"
                step="0.1"
                value={formData.score}
                onChange={e => setFormData({...formData, score: e.target.value})}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
              <Input 
                type="number"
                value={formData.maxScore}
                onChange={e => setFormData({...formData, maxScore: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date *</label>
              <Input 
                type="date"
                value={formData.examDate}
                onChange={e => setFormData({...formData, examDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Grade'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
