'use client';
import { set } from 'nprogress';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true); // Prevent early rendering
  const [totalclientlength, setTotalClientLength] = useState(0);
  const [jaa, setJaa] = useState(false);
const [showModal, setShowModal] = useState(false); // For viewData modal
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        setToken(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // Finished initializing
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userInfo);
    setJaa(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    totalclientlength,
    setTotalClientLength,
    jaa,
    setJaa,
    setShowModal,
    showModal,
  }), [user, token, totalclientlength, jaa]);

  // ✅ Wait until token/user are checked
  if (loading) return null;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
