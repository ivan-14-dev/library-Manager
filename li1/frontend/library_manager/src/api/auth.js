import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CORRECTION : Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    // Récupérer le token à chaque requête
    const token = localStorage.getItem('access_token');
    console.log('🔐 Token utilisé:', token ? 'PRÉSENT' : 'ABSENT');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token ajouté aux headers');
    } else {
      console.log('❌ Aucun token trouvé');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erreur intercepteur request:', error);
    return Promise.reject(error);
  }
);

// CORRECTION : Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.log(`❌ ${error.response?.status || 'NETWORK'} ${error.config?.url}`);
    
    if (error.response?.status === 401) {
      console.log('🔐 Token expiré ou invalide');
      
      // Tentative de rafraîchissement du token
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && error.config.url !== '/auth/login/') {
        try {
          console.log('🔄 Tentative de rafraîchissement du token...');
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const newToken = response.data.access;
          localStorage.setItem('access_token', newToken);
          console.log('✅ Nouveau token obtenu');
          
          // Retry la requête originale avec le nouveau token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
          
        } catch (refreshError) {
          console.error('❌ Échec rafraîchissement token:', refreshError);
          // Déconnexion forcée
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
          // Déconnexion si pas de refresh token ou sur la page login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Éviter la boucle de redirection si déjà sur la page login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
    }
    
    return Promise.reject(error);
  }
);
// ============================================================================
// API D'AUTHENTIFICATION
// ============================================================================

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/me/'),
  updateProfile: (data) => api.post('/auth/me/update/', data),
};

// ============================================================================
// API DES LIVRES
// ============================================================================

export const booksAPI = {
  getBooks: (params) => api.get('/books/', { params }),
  getBook: (id) => api.get(`/books/${id}/`),
  createBook: (bookData) => api.post('/books/create/', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}/update/`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}/delete/`),
  getAuthors: () => api.get('/books/authors/'),
  getCategories: () => api.get('/books/categories/'),
  getSubcategories: () => api.get('/books/subcategories/'),
  getPersonalBooks: () => api.get('/books/personal/'),
  getPublicPersonalBooks: () => api.get('/books/personal/public/'),
  getPublicPersonalBook: (id) => api.get(`/books/personal/public/${id}/`),

  // Fonctions simulées pour les endpoints qui n'existent pas
  getHighRatedBooks: () => Promise.resolve({ data: [] }),
  getPopularBooks: () => Promise.resolve({ data: [] }),
  getTrendingBooks: () => Promise.resolve({ data: [] }),
};

// ============================================================================
// API DES EMPRUNTS
// ============================================================================

export const borrowAPI = {
  getMyBorrows: () => api.get('/borrow/my/'),
  getAllBorrows: () => api.get('/borrow/all/'),
  borrowBook: (data) => api.post('/borrow/borrow/', data),
  returnBook: (data) => api.post('/borrow/return/', data),
  getMyReservations: () => api.get('/borrow/reservations/my/'),
  getAllReservations: () => api.get('/borrow/reservations/all/'),
  reserveBook: (data) => api.post('/borrow/reserve/', data),
  cancelReservation: (reservationId) => api.post(`/borrow/reservations/${reservationId}/cancel/`),
};

// ============================================================================
// API DES NOTIFICATIONS
// ============================================================================

export const notificationsAPI = {
  getNotifications: () => api.get('/notifications/notifications/'),
  getMessages: () => api.get('/notifications/messages/'),
  getBookRatings: () => api.get('/notifications/book-ratings/'),
  getReadingReports: () => api.get('/notifications/reading-reports/'),
  markNotificationAsRead: (id) => api.post(`/notifications/notifications/${id}/mark_as_read/`),
  markAllNotificationsAsRead: () => api.post('/notifications/notifications/mark_all_as_read/'),
  markMessageAsRead: (id) => api.post(`/notifications/messages/${id}/mark_as_read/`),
};

// ============================================================================
// API DES RAPPORTS/DASHBOARDS
// ============================================================================

export const reportsAPI = {
  getAdminDashboard: () => api.get('/reports/admin/'),
  getStudentDashboard: () => api.get('/reports/student/'),
  getProfessorDashboard: () => api.get('/reports/professor/'),
  getLibrarianDashboard: () => api.get('/reports/librarian/'),
};

// ============================================================================
// API DES PAIEMENTS
// ============================================================================

export const paymentsAPI = {
  getMyPayments: () => api.get('/payments/my/'),
  getAllPayments: () => api.get('/payments/all/'),
  createPayment: (data) => api.post('/payments/create/', data),
  createStripeIntent: (data) => api.post('/payments/stripe/create-intent/', data),
  confirmStripePayment: (data) => api.post('/payments/stripe/confirm/', data),
};

// ============================================================================
// API FONCTIONNALITÉS AVANCÉES
// ============================================================================

export const userAPI = {
  // Abonnements
  getMySubscription: () => api.get('/auth/subscriptions/my_subscription/'),
  activateSubscription: (id) => api.post(`/auth/subscriptions/${id}/activate/`),
  deactivateSubscription: (id) => api.post(`/auth/subscriptions/${id}/deactivate/`),
  
  // Configuration IA
  getAIConfig: () => api.get('/auth/ai-configurations/my_config/'),
  updateAIConfig: (data) => api.put('/auth/ai-configurations/my_config/', data),
  toggleAIActive: (id) => api.post(`/auth/ai-configurations/${id}/toggle_active/`),
  resetAIUsage: (id) => api.post(`/auth/ai-configurations/${id}/reset_usage/`),
  
  // Sessions de collaboration
  getCollaborationSessions: () => api.get('/auth/collaboration-sessions/'),
  joinSession: (id) => api.post(`/auth/collaboration-sessions/${id}/join/`),
  leaveSession: (id) => api.post(`/auth/collaboration-sessions/${id}/leave/`),
  updateCursor: (id, data) => api.post(`/auth/collaboration-sessions/${id}/update_cursor/`, data),
  
  // Versions de documents
  getDocumentVersions: () => api.get('/auth/document-versions/'),
  restoreDocumentVersion: (id) => api.post(`/auth/document-versions/${id}/restore/`),
  
  // Jobs d'export
  getExportJobs: () => api.get('/auth/export-jobs/'),
  downloadExport: (id) => api.get(`/auth/export-jobs/${id}/download/`),
};

// ============================================================================
// API DASHBOARD UNIFIÉE
// ============================================================================

export const dashboardAPI = {
  getDashboard: (role = 'student') => {
    switch (role) {
      case 'admin':
        return api.get('/reports/admin/');
      case 'professor':
        return api.get('/reports/professor/');
      case 'librarian':
        return api.get('/reports/librarian/');
      case 'student':
      default:
        return api.get('/reports/student/');
    }
  },

  getAdminDashboard: () => api.get('/reports/admin/'),
  getStudentDashboard: () => api.get('/reports/student/'),
  getProfessorDashboard: () => api.get('/reports/professor/'),
  getLibrarianDashboard: () => api.get('/reports/librarian/'),

  getCombinedDashboard: async (role = 'student') => {
    try {
      const dashboardPromises = [dashboardAPI.getDashboard(role)];

      switch (role) {
        case 'student':
          dashboardPromises.push(
            borrowAPI.getMyBorrows().catch(() => ({ data: [] })),
            booksAPI.getPersonalBooks().catch(() => ({ data: [] })),
            borrowAPI.getMyReservations().catch(() => ({ data: [] })),
            notificationsAPI.getNotifications().catch(() => ({ data: [] }))
          );
          break;

        case 'admin':
          dashboardPromises.push(
            borrowAPI.getAllBorrows().catch(() => ({ data: [] })),
            paymentsAPI.getAllPayments().catch(() => ({ data: [] })),
            borrowAPI.getAllReservations().catch(() => ({ data: [] })),
            booksAPI.getBooks().catch(() => ({ data: [] }))
          );
          break;

        case 'librarian':
          dashboardPromises.push(
            borrowAPI.getAllBorrows().catch(() => ({ data: [] })),
            borrowAPI.getAllReservations().catch(() => ({ data: [] })),
            booksAPI.getBooks().catch(() => ({ data: [] }))
          );
          break;

        case 'professor':
          dashboardPromises.push(
            booksAPI.getPublicPersonalBooks().catch(() => ({ data: [] })),
            borrowAPI.getAllBorrows().catch(() => ({ data: [] }))
          );
          break;
      }

      const results = await Promise.all(dashboardPromises);
      
      const combinedData = {
        ...results[0].data,
      };

      switch (role) {
        case 'student':
          combinedData.myBorrows = results[1]?.data || [];
          combinedData.personalBooks = results[2]?.data || [];
          combinedData.myReservations = results[3]?.data || [];
          combinedData.notifications = results[4]?.data || [];
          break;

        case 'admin':
          combinedData.allBorrows = results[1]?.data || [];
          combinedData.allPayments = results[2]?.data || [];
          combinedData.allReservations = results[3]?.data || [];
          combinedData.allBooks = results[4]?.data || [];
          break;

        case 'librarian':
          combinedData.allBorrows = results[1]?.data || [];
          combinedData.allReservations = results[2]?.data || [];
          combinedData.allBooks = results[3]?.data || [];
          break;

        case 'professor':
          combinedData.publicBooks = results[1]?.data || [];
          combinedData.allBorrows = results[2]?.data || [];
          break;
      }

      return combinedData;

    } catch (error) {
      console.error('Erreur dans getCombinedDashboard:', error);
      throw error;
    }
  },
};

// ============================================================================
// ALIAS POUR LA COMPATIBILITÉ (supprime les doublons)
// ============================================================================

// Alias pour aiServiceAPI (utilise userAPI)
export const aiServiceAPI = {
  getAIConfig: userAPI.getAIConfig,
  updateAIConfig: userAPI.updateAIConfig,
  toggleAIActive: userAPI.toggleAIActive,
  resetAIUsage: userAPI.resetAIUsage,
  getCollaborationSessions: userAPI.getCollaborationSessions,
  joinSession: userAPI.joinSession,
  leaveSession: userAPI.leaveSession,
  updateCursor: userAPI.updateCursor,
  getDocumentVersions: userAPI.getDocumentVersions,
  restoreDocumentVersion: userAPI.restoreDocumentVersion,
  getExportJobs: userAPI.getExportJobs,
  downloadExport: userAPI.downloadExport,
};

// Alias pour la compatibilité (supprime les doublons)
export const subscriptionAPI = {
  getMySubscription: userAPI.getMySubscription,
  activateSubscription: userAPI.activateSubscription,
  deactivateSubscription: userAPI.deactivateSubscription,
};

// Export par défaut
export default api;

