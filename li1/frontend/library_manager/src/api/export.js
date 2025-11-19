import api from './index.js';

// API pour l'export
export const exportAPI = {
  // Jobs d'export
  getExportJobs: () => api.get('/export/jobs/'),
  createExportJob: (data) => api.post('/export/jobs/', data),
  getExportJob: (id) => api.get(`/export/jobs/${id}/`),
  updateExportJob: (id, data) => api.put(`/export/jobs/${id}/`, data),
  deleteExportJob: (id) => api.delete(`/export/jobs/${id}/`),

  // Téléchargement d'export
  downloadExport: (jobId) => api.get(`/export/download/${jobId}/`, {
    responseType: 'blob'
  }),

  // Progression d'export
  getExportProgress: (jobId) => api.get(`/export/progress/${jobId}/`),
};