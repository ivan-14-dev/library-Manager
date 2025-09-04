import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.js';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Vérifier la validité du token et récupérer les infos utilisateur
      authAPI.getProfile(token)
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur de vérification du token:', error);
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, access } = response.data;
      
      setUser(userData);
      setToken(access);
      localStorage.setItem('token', access);
      
      toast.success('Connexion réussie!');
      return userData;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur de connexion');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, access } = response.data;
      
      setUser(newUser);
      setToken(access);
      localStorage.setItem('token', access);
      
      toast.success('Inscription réussie!');
      return newUser;
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur d'inscription");
      throw error;
    }
  };

  const logout = () => {
    if (token) {
      authAPI.logout({ refresh: localStorage.getItem('refresh') })
        .catch(error => console.error('Erreur lors de la déconnexion:', error));
    }
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    toast.info('Déconnexion réussie');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData, token);
      setUser(response.data);
      toast.success('Profil mis à jour avec succès!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur de mise à jour');
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isStudent: user?.role === 'STUDENT',
    isProfessor: user?.role === 'PROFESSOR',
    isLibrarian: user?.role === 'LIBRARIAN',
    isAdmin: user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};