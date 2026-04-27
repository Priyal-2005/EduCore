import React, { useState } from 'react';
import { useStudents } from '../../context/StudentContext';
import { useClasses } from '../../context/ClassContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const AddStudent = () => {
  const { addStudent, loading, error } = useStudents();
  const { classes } = useClasses();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    classId: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    try {
      await addStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        classId: formData.classId ? parseInt(formData.classId) : null,
      });
      navigate('/students');
    } catch (err: any) {
      // Error is handled by context, but we can catch it here if needed
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Student</h1>
        <p className="text-gray-500 text-sm mt-1">Enroll a new student in the system.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || validationError) && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
              {error || validationError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <Input 
                value={formData.firstName} 
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <Input 
                value={formData.lastName} 
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <Input 
                type="date"
                value={formData.dateOfBirth} 
                onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={formData.classId}
                onChange={e => setFormData({...formData, classId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a class (Optional)</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/students')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Add Student'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
