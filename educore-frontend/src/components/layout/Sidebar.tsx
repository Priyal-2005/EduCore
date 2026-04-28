import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  CheckSquare, 
  BookOpen
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || '';

  let links = [{ to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' }];

  if (role === 'ADMIN') {
    links.push(
      { to: '/students', icon: <Users size={20} />, label: 'Students' },
      { to: '/teachers', icon: <GraduationCap size={20} />, label: 'Teachers' },
      { to: '/timetables', icon: <Calendar size={20} />, label: 'Timetables' },
      { to: '/grades', icon: <BookOpen size={20} />, label: 'Grades' },
      { to: '/attendance', icon: <CheckSquare size={20} />, label: 'Attendance' }
    );
  } else if (role === 'TEACHER') {
    links.push(
      { to: '/timetables', icon: <Calendar size={20} />, label: 'My Timetable' },
      { to: '/attendance', icon: <CheckSquare size={20} />, label: 'Mark Attendance' },
      { to: '/grades', icon: <BookOpen size={20} />, label: 'Add Grades' }
    );
  } else if (role === 'STUDENT') {
    links.push(
      { to: '/grades', icon: <BookOpen size={20} />, label: 'My Grades' },
      { to: '/attendance', icon: <CheckSquare size={20} />, label: 'My Attendance' },
      { to: '/timetables', icon: <Calendar size={20} />, label: 'My Timetable' }
    );
  } else if (role === 'PARENT') {
    links.push(
      { to: '/grades', icon: <BookOpen size={20} />, label: 'Child Grades' },
      { to: '/attendance', icon: <CheckSquare size={20} />, label: 'Child Attendance' }
    );
  }

  return (
    <aside className="w-64 border-r bg-white min-h-screen flex flex-col">
      <div className="p-4 flex-1">
        <div className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};
