import api from './index.js';

// API pour les groupes de lecture
export const groupsAPI = {
  // Groupes de lecture
  getReadingGroups: () => api.get('/groups/reading-groups/'),
  createReadingGroup: (data) => api.post('/groups/reading-groups/', data),
  getReadingGroup: (id) => api.get(`/groups/reading-groups/${id}/`),
  updateReadingGroup: (id, data) => api.put(`/groups/reading-groups/${id}/`, data),
  deleteReadingGroup: (id) => api.delete(`/groups/reading-groups/${id}/`),
  joinReadingGroup: (groupId) => api.post(`/groups/reading-groups/${groupId}/join/`),
  leaveReadingGroup: (groupId) => api.post(`/groups/reading-groups/${groupId}/leave/`),

  // Clubs
  getClubs: () => api.get('/groups/clubs/'),
  createClub: (data) => api.post('/groups/clubs/', data),
  getClub: (id) => api.get(`/groups/clubs/${id}/`),
  updateClub: (id, data) => api.put(`/groups/clubs/${id}/`, data),
  deleteClub: (id) => api.delete(`/groups/clubs/${id}/`),
  joinClub: (clubId) => api.post(`/groups/clubs/${clubId}/join/`),
  leaveClub: (clubId) => api.post(`/groups/clubs/${clubId}/leave/`),
  getClubGroups: (clubId) => api.get(`/groups/clubs/${clubId}/groups/`),

  // Messages
  getMessages: () => api.get('/groups/messages/'),
  createMessage: (data) => api.post('/groups/messages/', data),
  getMessage: (id) => api.get(`/groups/messages/${id}/`),
  updateMessage: (id, data) => api.put(`/groups/messages/${id}/`, data),
  deleteMessage: (id) => api.delete(`/groups/messages/${id}/`),
};