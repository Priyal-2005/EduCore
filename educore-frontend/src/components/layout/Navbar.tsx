import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white px-6 py-3 flex items-center justify-between">
      <div className="font-bold text-xl text-primary flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">E</div>
        EduCore
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border">
          <UserIcon size={16} />
          <span>{user?.email}</span>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold ml-2">
            {user?.role}
          </span>
        </div>
        
        <button 
          onClick={logout}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};
