import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAccessToken } from '../services/api.js';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check for active session on load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const hasSession = await api.checkSession();
        if (hasSession) {
          const token = getAccessToken();
          const decoded = decodeToken(token);
          if (decoded) {
            setUser({
              id: decoded.id,
              username: decoded.username,
              email: decoded.email
            });
          }
        }
      } catch (err) {
        console.error('Session initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for custom logout events from the API client (e.g. if refresh token expires)
    const handleForceLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth-logout', handleForceLogout);
    return () => window.removeEventListener('auth-logout', handleForceLogout);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      setUser(response.user);
      return response.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      return await api.register(username, email, password);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
