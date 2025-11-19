import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { notificationsAPI } from '../api/notifications.js';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, token]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getMyNotifications(token);
      setNotifications(response.data);
      
      const unread = response.data.filter(notif => notif.status === 'UNREAD').length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId, token);
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, status: 'READ', read_at: new Date().toISOString() } : notif
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead(token);
      setNotifications(prev => prev.map(notif => 
        ({ ...notif, status: 'READ', read_at: new Date().toISOString() })
      ));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de tous comme lus:', error);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (notification.status === 'UNREAD') {
      setUnreadCount(prev => prev + 1);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};