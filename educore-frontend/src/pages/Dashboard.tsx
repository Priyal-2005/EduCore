import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { StudentDashboard } from './dashboards/StudentDashboard';
import { ParentDashboard } from './dashboards/ParentDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.email} <span className="font-semibold px-2 py-1 bg-gray-100 rounded ml-2">{user?.role}</span>
        </div>
      </div>

      {user?.role === 'ADMIN' && <AdminDashboard />}
      {user?.role === 'TEACHER' && <TeacherDashboard />}
      {user?.role === 'STUDENT' && <StudentDashboard />}
      {user?.role === 'PARENT' && <ParentDashboard />}
      {!user?.role && <div>Access Denied</div>}
    </div>
  );
};
