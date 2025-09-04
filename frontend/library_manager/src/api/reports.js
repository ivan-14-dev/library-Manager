import api from './index';

export const reportsAPI = {
  // Dashboard étudiant
  getStudentDashboard: () => api.get('/reports/student/'),
  
  // Dashboard professeur
  getProfessorDashboard: () => api.get('/reports/professor/'),
  
  // Dashboard bibliothécaire
  getLibrarianDashboard: () => api.get('/reports/librarian/'),
  
  // Dashboard administrateur
  getAdminDashboard: () => api.get('/reports/admin/'),
  
  // Statistiques générales (pour les admins)
  getGeneralStats: (params) => api.get('/reports/stats/', { params }),
  
  // Rapports d'emprunts
  getBorrowReports: (params) => api.get('/reports/borrows/', { params }),
  
  // Rapports de réservations
  getReservationReports: (params) => api.get('/reports/reservations/', { params }),
  
  // Rapports financiers (amendes)
  getFinancialReports: (params) => api.get('/reports/financial/', { params }),
  
  // Export des données (CSV, Excel, etc.)
  exportData: (format, params) => 
    api.get(`/reports/export/${format}/`, { 
      params,
      responseType: 'blob' // Important pour les téléchargements de fichiers
    }),
};