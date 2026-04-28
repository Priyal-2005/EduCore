import { CheckSquare, BookOpen, Users } from 'lucide-react';

export const ParentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Users className="text-blue-500 mb-2" size={32} />
          <h3 className="text-lg font-bold">Child Overview</h3>
          <p className="text-sm text-gray-500">View information about your children.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CheckSquare className="text-green-500 mb-2" size={32} />
          <h3 className="text-lg font-bold">Attendance</h3>
          <p className="text-sm text-gray-500">Check your child's attendance record.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <BookOpen className="text-purple-500 mb-2" size={32} />
          <h3 className="text-lg font-bold">Grades</h3>
          <p className="text-sm text-gray-500">View your child's academic performance.</p>
        </div>
      </div>
    </div>
  );
};
