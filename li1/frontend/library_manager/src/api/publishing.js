import api from './index.js';

// API pour la publication et communautés
export const publishingAPI = {
  // Demandes de publication
  getPublicationRequests: () => api.get('/publishing/publication-requests/'),
  createPublicationRequest: (data) => api.post('/publishing/publication-requests/', data),
  getPublicationRequest: (id) => api.get(`/publishing/publication-requests/${id}/`),
  updatePublicationRequest: (id, data) => api.put(`/publishing/publication-requests/${id}/`, data),
  deletePublicationRequest: (id) => api.delete(`/publishing/publication-requests/${id}/`),

  // Reviews
  getReviews: () => api.get('/publishing/reviews/'),
  createReview: (data) => api.post('/publishing/reviews/', data),
  getReview: (id) => api.get(`/publishing/reviews/${id}/`),
  updateReview: (id, data) => api.put(`/publishing/reviews/${id}/`, data),
  deleteReview: (id) => api.delete(`/publishing/reviews/${id}/`),

  // Statuts de publication
  getPublicationStatuses: () => api.get('/publishing/publication-status/'),
  createPublicationStatus: (data) => api.post('/publishing/publication-status/', data),
  getPublicationStatus: (id) => api.get(`/publishing/publication-status/${id}/`),
  updatePublicationStatus: (id, data) => api.put(`/publishing/publication-status/${id}/`, data),
  deletePublicationStatus: (id) => api.delete(`/publishing/publication-status/${id}/`),

  // Communautés
  getCommunities: () => api.get('/publishing/communities/'),
  createCommunity: (data) => api.post('/publishing/communities/', data),
  getCommunity: (id) => api.get(`/publishing/communities/${id}/`),
  updateCommunity: (id, data) => api.put(`/publishing/communities/${id}/`, data),
  deleteCommunity: (id) => api.delete(`/publishing/communities/${id}/`),

  // Cercles d'amis
  getFriendCircles: () => api.get('/publishing/friend-circles/'),
  createFriendCircle: (data) => api.post('/publishing/friend-circles/', data),
  getFriendCircle: (id) => api.get(`/publishing/friend-circles/${id}/`),
  updateFriendCircle: (id, data) => api.put(`/publishing/friend-circles/${id}/`, data),
  deleteFriendCircle: (id) => api.delete(`/publishing/friend-circles/${id}/`),

  // Adhésions aux cercles
  getCircleMemberships: () => api.get('/publishing/circle-memberships/'),
  createCircleMembership: (data) => api.post('/publishing/circle-memberships/', data),
  getCircleMembership: (id) => api.get(`/publishing/circle-memberships/${id}/`),
  updateCircleMembership: (id, data) => api.put(`/publishing/circle-memberships/${id}/`, data),
  deleteCircleMembership: (id) => api.delete(`/publishing/circle-memberships/${id}/`),
};