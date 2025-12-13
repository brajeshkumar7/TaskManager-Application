import { create } from 'zustand';

// Initialize from localStorage if available
const getStoredAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null, isAuthenticated: false };

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    user,
    token,
    isAuthenticated: !!(token && user),
  };
};

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
