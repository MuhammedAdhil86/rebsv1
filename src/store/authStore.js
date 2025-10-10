import { create } from 'zustand';

// Zustand store for authentication
export const useAuthStore = create((set) => ({
  // --- Initial State ---
  isAuthenticated: !!localStorage.getItem('authToken'),
  user: (() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  })(),

  // --- Actions ---
  login: (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('lastAuthUpdate', Date.now().toString());
    set({
      isAuthenticated: true,
      user: userData,
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('lastAuthUpdate');
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));
