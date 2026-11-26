import { createContext, useState, useCallback, useMemo } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const SESSION_KEY = 'sga_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setUser(data);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const updateUserSession = useCallback((partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      isStudent: user?.role === 'STUDENT',
      login,
      register,
      logout,
      updateUserSession,
    }),
    [user, login, register, logout, updateUserSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
