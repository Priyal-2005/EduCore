import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem('educore_token');
  const savedUser = localStorage.getItem('educore_user');
  
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken,
    isAuthenticated: !!savedToken,
    
    login: (user, token) => {
      localStorage.setItem('educore_token', token);
      localStorage.setItem('educore_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    
    logout: () => {
      localStorage.removeItem('educore_token');
      localStorage.removeItem('educore_user');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
