import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  loginUser,
  setStoredToken,
} from '@/api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (accessToken) => {
    const userData = await getCurrentUser(accessToken);
    setUser(userData);
    return userData;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        await fetchUser(storedToken);
      } catch {
        clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUser]);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setStoredToken(data.access_token);
    setToken(data.access_token);
    const userData = await fetchUser(data.access_token);
    return { ...data, user: userData };
  }, [fetchUser]);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    return fetchUser(token);
  }, [fetchUser, token]);

  const updateUserLocal = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      login,
      logout,
      refreshUser,
      updateUserLocal,
    }),
    [token, user, loading, login, logout, refreshUser, updateUserLocal],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
