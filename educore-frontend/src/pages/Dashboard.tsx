import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, GraduationCap, Calendar, CheckSquare } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Students', value: '150', icon: <Users size={24} />, color: 'bg-blue-500' },
    { title: 'Total Teachers', value: '12', icon: <GraduationCap size={24} />, color: 'bg-green-500' },
    { title: 'Classes', value: '8', icon: <Calendar size={24} />, color: 'bg-purple-500' },
    { title: "Today's Attendance", value: '96%', icon: <CheckSquare size={24} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.email}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`p-4 rounded-lg text-white ${stat.color} mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <p className="text-gray-500 mb-4">You are logged in as <span className="font-semibold text-primary">{user?.role}</span>. Use the sidebar to navigate to management pages.</p>
        <div className="p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
          <strong>Backend Connected:</strong> The frontend successfully authenticated via the Express REST API and received a JWT token.
        </div>
      </div>
    </div>
  );
};
