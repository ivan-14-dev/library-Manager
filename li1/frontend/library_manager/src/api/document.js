
export const documentsAPI = {
  // Récupérer un document spécifique
  getDocument: (documentId) =>
    api.get(`/documents/${documentId}`).then(res => res.data),

  // Récupérer les documents de l'utilisateur
  getUserDocuments: (params = {}) =>
    api.get('/user/documents', { params }).then(res => res.data),

  // Ajouter/retirer des favoris
  toggleFavorite: (documentId) =>
    api.post(`/documents/${documentId}/favorite`).then(res => res.data),

  // Télécharger un document (si autorisé)
  downloadDocument: (documentId) =>
    api.get(`/documents/${documentId}/download`, { 
      responseType: 'blob' 
    }).then(res => res.data),

  // Obtenir les documents récents
  getRecentDocuments: () =>
    api.get('/documents/recent').then(res => res.data),

  // Rechercher des documents
  searchDocuments: (query, filters = {}) =>
    api.get('/documents/search', { 
      params: { q: query, ...filters } 
    }).then(res => res.data),
};

// API pour la gestion de la lecture
export const readingAPI = {
  // Démarrer une session de lecture
  startReadingSession: (documentId) =>
    api.post(`/reading/sessions`, { documentId }).then(res => res.data),

  // Sauvegarder la progression
  saveReadingProgress: (documentId, progress) =>
    api.post(`/reading/progress`, { documentId, progress }).then(res => res.data),

  // Récupérer la session de lecture
  getReadingSession: (documentId) =>
    api.get(`/reading/sessions/${documentId}`).then(res => res.data),

  // Marquer comme terminé
  markAsCompleted: (documentId) =>
    api.post(`/reading/complete`, { documentId }).then(res => res.data),

  // Obtenir l'historique de lecture
  getReadingHistory: (params = {}) =>
    api.get('/reading/history', { params }).then(res => res.data),
};