import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: (() => {
    try { return JSON.parse(localStorage.getItem('tf_user')); } catch { return null; }
  })(),
  token: localStorage.getItem('tf_token') || null,
  isAuthenticated: !!localStorage.getItem('tf_token'),

  setAuth: (user, token) => {
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (user) => {
    localStorage.setItem('tf_user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
