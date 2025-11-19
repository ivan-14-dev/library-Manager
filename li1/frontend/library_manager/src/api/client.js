import axios from 'axios';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Types d'erreurs personnalisés
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

export class NetworkError extends APIError {
  constructor(message = 'Erreur de connexion réseau') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message = 'Erreur d\'authentification') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends APIError {
  constructor(message = 'Erreur de validation', data = null) {
    super(message, 400, data);
    this.name = 'ValidationError';
  }
}

// Configuration du client Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 secondes
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter des métadonnées pour le débogage
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => {
    // Calculer le temps de réponse pour le monitoring
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Gestion des erreurs réseau
    if (!error.response) {
      throw new NetworkError(error.message || 'Erreur de connexion');
    }

    const { status, data } = error.response;

    // Gestion de l'expiration du token (refresh token)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Tentative de rafraîchissement du token
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const response = axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('token', access);
          
          // Réessayer la requête originale
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Échec du rafraîchissement, déconnexion
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
          throw new AuthenticationError('Session expirée');
        }
      } else {
        // Pas de refresh token, déconnexion
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new AuthenticationError('Token manquant');
      }
    }

    // Gestion des différents types d'erreurs
    switch (status) {
      case 400:
        throw new ValidationError(data.message || 'Données invalides', data);
      
      case 401:
        throw new AuthenticationError(data.message || 'Non autorisé');
      
      case 403:
        throw new APIError(data.message || 'Accès interdit', status, data);
      
      case 404:
        throw new APIError(data.message || 'Ressource non trouvée', status, data);
      
      case 422:
        throw new ValidationError(data.message || 'Erreur de validation', data);
      
