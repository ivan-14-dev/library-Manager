import api from './index.js';

// API pour l'intelligence artificielle
export const aiAPI = {
  // Conversations AI
  getConversations: () => api.get('/ai/conversations/'),
  createConversation: (data) => api.post('/ai/conversations/', data),
  getConversation: (id) => api.get(`/ai/conversations/${id}/`),
  updateConversation: (id, data) => api.put(`/ai/conversations/${id}/`, data),
  deleteConversation: (id) => api.delete(`/ai/conversations/${id}/`),

  // Messages AI
  getMessages: () => api.get('/ai/messages/'),
  createMessage: (data) => api.post('/ai/messages/', data),
  getMessage: (id) => api.get(`/ai/messages/${id}/`),
  updateMessage: (id, data) => api.put(`/ai/messages/${id}/`, data),
  deleteMessage: (id) => api.delete(`/ai/messages/${id}/`),

  // Suivi d'utilisation AI
  getUsageTracking: () => api.get('/ai/usage-tracking/'),
  createUsageTracking: (data) => api.post('/ai/usage-tracking/', data),
  getUsageTrackingItem: (id) => api.get(`/ai/usage-tracking/${id}/`),
  updateUsageTracking: (id, data) => api.put(`/ai/usage-tracking/${id}/`, data),
  deleteUsageTracking: (id) => api.delete(`/ai/usage-tracking/${id}/`),

  // Aide AI
  getAIHelp: () => api.get('/ai/help/'),

  // Assistant d'écriture AI
  getWritingAssistant: (data) => api.post('/ai/writing-assistant/', data),
};