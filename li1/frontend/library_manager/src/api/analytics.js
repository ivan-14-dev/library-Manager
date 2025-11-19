import api from './index.js';

// API pour les analytics
export const analyticsAPI = {
  // Événements d'analytics
  getAnalyticsEvents: () => api.get('/analytics/events/'),
  createAnalyticsEvent: (data) => api.post('/analytics/events/', data),
  getAnalyticsEvent: (id) => api.get(`/analytics/events/${id}/`),
  updateAnalyticsEvent: (id, data) => api.put(`/analytics/events/${id}/`, data),
  deleteAnalyticsEvent: (id) => api.delete(`/analytics/events/${id}/`),

  // Activités utilisateurs
  getUserActivities: () => api.get('/analytics/user-activities/'),
  createUserActivity: (data) => api.post('/analytics/user-activities/', data),
  getUserActivity: (id) => api.get(`/analytics/user-activities/${id}/`),
  updateUserActivity: (id, data) => api.put(`/analytics/user-activities/${id}/`, data),
  deleteUserActivity: (id) => api.delete(`/analytics/user-activities/${id}/`),

  // Analytics des livres
  getBookAnalytics: () => api.get('/analytics/book-analytics/'),
  createBookAnalytics: (data) => api.post('/analytics/book-analytics/', data),
  getBookAnalyticsItem: (id) => api.get(`/analytics/book-analytics/${id}/`),
  updateBookAnalytics: (id, data) => api.put(`/analytics/book-analytics/${id}/`, data),
  deleteBookAnalytics: (id) => api.delete(`/analytics/book-analytics/${id}/`),

  // Analytics des ventes
  getSalesAnalytics: () => api.get('/analytics/sales-analytics/'),
  createSalesAnalytics: (data) => api.post('/analytics/sales-analytics/', data),
  getSalesAnalyticsItem: (id) => api.get(`/analytics/sales-analytics/${id}/`),
  updateSalesAnalytics: (id, data) => api.put(`/analytics/sales-analytics/${id}/`, data),
  deleteSalesAnalytics: (id) => api.delete(`/analytics/sales-analytics/${id}/`),

  // Tableau de bord analytics
  getDashboardAnalytics: () => api.get('/analytics/dashboard/'),

  // Analytics utilisateur spécifique
  getUserAnalytics: (userId) => api.get(`/analytics/users/${userId}/`),

  // Analytics livre spécifique
  getBookAnalyticsDetail: (bookId) => api.get(`/analytics/books/${bookId}/`),
};