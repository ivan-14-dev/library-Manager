// src/hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  booksAPI, 
  borrowAPI, 
  notificationsAPI,
  dashboardAPI,
  reportsAPI
} from '../api/auth';

export const useDashboardData = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentBooks: [],
    myBorrows: [],
    notifications: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !token) {
        setDashboardData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));

        // Récupérer les données selon le rôle
        let statsData = {};
        let booksData = [];
        let borrowsData = [];
        let notificationsData = [];

        // Données communes à tous les rôles
        const [booksResponse, notificationsResponse] = await Promise.all([
          booksAPI.getBooks().catch(err => {
            console.error('Error fetching books:', err);
            return { data: [] };
          }),
          notificationsAPI.getNotifications().catch(err => {
            console.error('Error fetching notifications:', err);
            return { data: [] };
          })
        ]);

        booksData = booksResponse.data || [];
        notificationsData = notificationsResponse.data || [];

        // Données spécifiques au rôle avec les endpoints existants
        switch (user.role) {
          case 'STUDENT':
            const [studentDashboardResponse, borrowsResponse] = await Promise.all([
              reportsAPI.getStudentDashboard().catch(err => {
                console.error('Error fetching student dashboard:', err);
                return { data: {} };
              }),
              borrowAPI.getMyBorrows().catch(err => {
                console.error('Error fetching borrows:', err);
                return { data: [] };
              })
            ]);

            statsData = studentDashboardResponse.data || {};
            borrowsData = borrowsResponse.data || [];
            break;

          case 'PROFESSOR':
            const professorDashboardResponse = await reportsAPI.getProfessorDashboard().catch(err => {
              console.error('Error fetching professor dashboard:', err);
              return { data: {} };
            });
            statsData = professorDashboardResponse.data || {};
            break;

          case 'LIBRARIAN':
            const librarianDashboardResponse = await reportsAPI.getLibrarianDashboard().catch(err => {
              console.error('Error fetching librarian dashboard:', err);
              return { data: {} };
            });
            statsData = librarianDashboardResponse.data || {};
            break;

          case 'ADMIN':
            const adminDashboardResponse = await reportsAPI.getAdminDashboard().catch(err => {
              console.error('Error fetching admin dashboard:', err);
              return { data: {} };
            });
            statsData = adminDashboardResponse.data || {};
            break;

          case 'VISITOR':
          default:
            // Stats par défaut pour les visiteurs
            statsData = {
              totalBooks: booksData.length,
              availableBooks: booksData.filter(book => book.available).length,
              featuredBooks: booksData.filter(book => book.featured).length
            };
            break;
        }

        // Calculer les stats finales
        const finalStats = calculateStats(user.role, {
          ...statsData,
          books: booksData,
          borrows: borrowsData,
          notifications: notificationsData
        });

        setDashboardData({
          stats: finalStats,
          recentBooks: booksData.slice(0, 6), // Limiter à 6 livres récents
          myBorrows: borrowsData,
          notifications: notificationsData,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || 'Erreur lors du chargement des données'
        }));
      }
    };

    fetchDashboardData();
  }, [user, token]);

  return dashboardData;
};

// Fonction helper pour calculer les statistiques
const calculateStats = (role, data) => {
  const baseStats = {
    totalBooks: data.totalBooks || data.books?.length || 0,
    unreadNotifications: data.notifications?.filter(n => !n.read).length || 0,
    totalNotifications: data.notifications?.length || 0
  };

  switch (role) {
    case 'STUDENT':
      return {
        ...baseStats,
        activeBorrows: data.activeBorrows || data.borrows?.filter(b => 
          b.status === 'ACTIVE' || b.status === 'BORROWED'
        ).length || 0,
        pendingReturns: data.pendingReturns || data.borrows?.filter(b => 
          b.status === 'OVERDUE'
        ).length || 0,
        readingProgress: data.readingProgress || 0,
        ...data // Inclure toutes les données spécifiques de l'API
      };

    case 'VISITOR':
      return {
        ...baseStats,
        availableBooks: data.availableBooks || data.books?.filter(b => b.available).length || 0,
        featuredBooks: data.featuredBooks || data.books?.filter(b => b.featured).length || 0,
        newArrivals: data.newArrivals || data.books?.filter(b => b.is_new).length || 0
      };

    case 'PROFESSOR':
      return {
        ...baseStats,
        myPublications: data.myPublications || 0,
        courseMaterials: data.courseMaterials || 0,
        studentsCount: data.studentsCount || 0,
        ...data
      };

    case 'LIBRARIAN':
      return {
        ...baseStats,
        pendingApprovals: data.pendingApprovals || 0,
        totalBorrows: data.totalBorrows || data.borrows?.length || 0,
        overdueBooks: data.overdueBooks || data.borrows?.filter(b => b.status === 'OVERDUE').length || 0,
        activeReaders: data.activeReaders || 0,
        ...data
      };

    case 'ADMIN':
      return {
        ...baseStats,
        totalUsers: data.totalUsers || 0,
        totalRevenue: data.totalRevenue || 0,
        systemHealth: data.systemHealth || 'Good',
        activeSessions: data.activeSessions || 0,
        ...data
      };

    default:
      return baseStats;
  }
};

// Hook spécifique pour les livres
export const useBooksData = (params = {}) => {
  const [booksData, setBooksData] = useState({
    books: [],
    loading: true,
    error: null,
    pagination: null
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksData(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await booksAPI.getBooks(params);
        const books = response.data || [];
        
        setBooksData({
          books,
          loading: false,
          error: null,
          pagination: null
        });
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooksData({
          books: [],
          loading: false,
          error: error.response?.data?.message || 'Erreur lors du chargement des livres',
          pagination: null
        });
      }
    };

    fetchBooks();
  }, [JSON.stringify(params)]);

  return booksData;
};

// Hook pour les emprunts
export const useBorrowsData = () => {
  const { user, token } = useAuth();
  const [borrowsData, setBorrowsData] = useState({
    borrows: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchBorrows = async () => {
      if (!user || !token) return;

      try {
        setBorrowsData(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await borrowAPI.getMyBorrows();
        setBorrowsData({
          borrows: response.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching borrows:', error);
        setBorrowsData({
          borrows: [],
          loading: false,
          error: error.response?.data?.message || 'Erreur lors du chargement des emprunts'
        });
      }
    };

    fetchBorrows();
  }, [user, token]);

  // Fonctions pour gérer les emprunts
  const borrowBook = async (bookId) => {
    try {
      await borrowAPI.borrowBook({ book: bookId });
      // Recharger les données après l'emprunt
      const response = await borrowAPI.getMyBorrows();
      setBorrowsData(prev => ({
        ...prev,
        borrows: response.data || []
      }));
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  };

  const returnBook = async (borrowId) => {
    try {
      await borrowAPI.returnBook({ borrow_id: borrowId });
      // Recharger les données après le retour
      const response = await borrowAPI.getMyBorrows();
      setBorrowsData(prev => ({
        ...prev,
        borrows: response.data || []
      }));
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  };

  return {
    ...borrowsData,
    borrowBook,
    returnBook
  };
};

// Hook pour les notifications
export const useNotificationsData = () => {
  const { user, token } = useAuth();
  const [notificationsData, setNotificationsData] = useState({
    notifications: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !token) return;

      try {
        setNotificationsData(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await notificationsAPI.getNotifications();
        setNotificationsData({
          notifications: response.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotificationsData({
          notifications: [],
          loading: false,
          error: error.response?.data?.message || 'Erreur lors du chargement des notifications'
        });
      }
    };

    fetchNotifications();
  }, [user, token]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markNotificationAsRead(notificationId);
      setNotificationsData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllNotificationsAsRead();
      setNotificationsData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true }))
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  return {
    ...notificationsData,
    markAsRead,
    markAllAsRead
  };
};

// Hook générique pour les APIs
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiFunction();
        setData({
          data: response.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('API Error:', error);
        setData({
          data: null,
          loading: false,
          error: error.response?.data || error.message
        });
      }
    };

    fetchData();
  }, dependencies);

  return data;
};

export default useDashboardData;