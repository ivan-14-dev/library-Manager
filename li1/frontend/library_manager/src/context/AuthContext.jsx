// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔄 Vérification auth au chargement');

      try {
        console.log('🔍 Appel de /auth/me/...');
        const response = await authAPI.getProfile();
        console.log('✅ /auth/me/ réponse:', response.data);
        setUser(response.data);
      } catch (error) {
        console.log('❌ /auth/me/ a échoué:', error.response?.status);
        // Ne pas nettoyer le localStorage ici, laisser l'utilisateur se déconnecter manuellement
        // Si on est sur la page login, éviter de rediriger inutilement
        if (window.location.pathname !== '/login') {
          // Optionnel: rediriger vers login seulement si nécessaire
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      console.log('🔐 TENTATIVE DE CONNEXION avec /auth/login/');

      const response = await authAPI.login(credentials);
      console.log('✅ RÉPONSE LOGIN COMPLÈTE:', response.data);

      // VOTRE API RETOURNE PROBABLEMENT :
      // { user: {...}, access: 'token', refresh: 'token' } 
      // OU juste { user: {...} } si vous n'utilisez pas JWT
      
      const responseData = response.data;
      
      // Gestion flexible selon la structure de réponse
      if (responseData.access && responseData.refresh) {
        // Structure JWT
        console.log('🎯 Structure JWT détectée');
        localStorage.setItem('access_token', responseData.access);
        localStorage.setItem('refresh_token', responseData.refresh);
      } else {
        console.log('🎯 Structure sans JWT détectée');
        // Nettoyer les tokens JWT si existants
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }

      // L'utilisateur peut être dans user ou directement dans response.data
      const userData = responseData.user || responseData;
      console.log('👤 Données utilisateur:', userData);

      // Stocker les infos utilisateur dans localStorage pour persistance
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
      
      console.log('🎉 Connexion réussie!');
      return { success: true, user: userData };

    } catch (error) {
      console.error('❌ ERREUR DE CONNEXION:', error);
      
      let errorMessage = 'Erreur de connexion';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Erreur réseau. Vérifiez votre connexion.';
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else {
          errorMessage = 'Identifiants incorrects';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    console.log('🚪 DÉCONNEXION');

    try {
      await authAPI.logout();
      console.log('✅ Déconnexion serveur réussie');
    } catch (error) {
      console.log('⚠️ Erreur déconnexion serveur:', error.response?.status);
    }

    // Nettoyage côté client
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setError(null);

    console.log('✅ Déconnexion client réussie');
  };

  const loginWithProvider = async (provider) => {
    try {
      setError(null);
      console.log(`🔐 TENTATIVE DE CONNEXION avec ${provider}`);

      // Redirect to backend OAuth endpoint
      window.location.href = `http://127.0.0.1:8000/api/auth/${provider}/login/`;
    } catch (error) {
      console.error(`❌ ERREUR DE CONNEXION ${provider}:`, error);
      setError(`Erreur lors de la connexion avec ${provider}`);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    loginWithProvider,
    clearError: () => setError(null),
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;