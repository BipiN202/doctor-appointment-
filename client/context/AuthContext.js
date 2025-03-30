import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const handleAuthError = useCallback((error) => {
    console.error('Authentication Error:', error);
    logout();
    setError(error.response?.data?.error || 'Session expired. Please login again.');
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await api.get('/users/me');
          setUser(res.data);
        }
      } catch (error) {
        handleAuthError(error);
      } finally {
        setLoading(false);
      }
    };

    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          handleAuthError(error);
        }
        return Promise.reject(error);
      }
    );

    initializeAuth();

    return () => api.interceptors.response.eject(interceptor);
  }, [handleAuthError]);  // Added handleAuthError to dependencies

  const login = useCallback(async (credentials) => {
    try {
      setError(null);
      const { data } = await api.post('/users/login', credentials);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
      throw error;
    }
  }, [navigate]);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const { data } = await api.post('/users/register', userData);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
      throw error;
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      role: user?.role || null
    }}>
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