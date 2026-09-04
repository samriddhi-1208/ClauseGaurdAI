import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('clauseguard_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('[Auth Check Error]', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('clauseguard_token', newToken);
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('clauseguard_token', newToken);
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('clauseguard_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
