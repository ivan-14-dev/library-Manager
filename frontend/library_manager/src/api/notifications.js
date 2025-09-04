import api from './index';

export const notificationsAPI = {
  // Récupérer toutes les notifications de l'utilisateur
  getMyNotifications: () => api.get('/notifications/my/'),
  
  // Récupérer les notifications non lues
  getUnreadNotifications: () => api.get('/notifications/my/unread/'),
  
  // Marquer une notification comme lue
  markAsRead: (notificationId) => 
    api.post('/notifications/mark-as-read/', { notification_id: notificationId }),
  
  // Marquer toutes les notifications comme lues
  markAllAsRead: () => api.post('/notifications/mark-all-as-read/'),
  
  // Envoyer une notification (admin/librarian seulement)
  sendNotification: (notificationData) => api.post('/notifications/send/', notificationData),
  
  // Supprimer une notification
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}/`),
};