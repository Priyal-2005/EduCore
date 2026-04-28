import { CheckSquare, BookOpen, Calendar } from 'lucide-react';

export const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Calendar className="text-blue-500 mb-2" size={32} />
          <h3 className="text-lg font-bold">My Classes</h3>
          <p className="text-sm text-gray-500">View your class schedule and students.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CheckSquare className="text-green-500 mb-2" size={32} />
          <h3 className="text-lg font-bold">Mark Attendance</h3>
          <p className="text-sm text-gray-500">Record daily attendance.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <BookOpen className="text-purple-500 mb-2" size={32} />
          <h3 className="text-lg font-bold">Add Grades</h3>
          <p className="text-sm text-gray-500">Submit and update student grades.</p>
        </div>
      </div>
    </div>
  );
};
