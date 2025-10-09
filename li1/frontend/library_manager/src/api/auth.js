import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: (data) => api.post('/auth/logout/', data),
  getProfile: (token) => api.get('/auth/me/', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateProfile: (profileData, token) => api.put('/auth/me/update/', profileData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

export const booksAPI = {
  getBooks: (params) => api.get('/books/', { params }),
  getBook: (id) => api.get(`/books/${id}/`),
  createBook: (bookData) => api.post('/books/create/', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}/update/`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}/delete/`),
  getAuthors: () => api.get('/books/authors/'),
  getCategories: () => api.get('/books/categories/'),

  getPersonalBooks: () => api.get('/books/personal/'),
  getPersonalBook: (id) => api.get(`/books/personal/${id}/`),
  createPersonalBook: (bookData) => api.post('/books/personal/', bookData),
  updatePersonalBook: (id, bookData) => api.put(`/books/personal/${id}/`, bookData),
  deletePersonalBook: (id) => api.delete(`/books/personal/${id}/`),
  getPublicPersonalBooks: (params) => api.get('/books/personal/public/', { params }),
  getPublicPersonalBook: (id) => api.get(`/books/personal/public/${id}/`),

};

export const borrowAPI = {
  getMyBorrows: () => api.get('/borrow/my/'),
  getAllBorrows: () => api.get('/borrow/all/'),
  borrowBook: (bookId) => api.post('/borrow/borrow/', { book: bookId }),
  returnBook: (borrowId) => api.post('/borrow/return/', { borrow_id: borrowId }),
  getMyReservations: () => api.get('/borrow/reservations/my/'),
  getAllReservations: () => api.get('/borrow/reservations/all/'),
  reserveBook: (bookId) => api.post('/borrow/reserve/', { book: bookId }),
  cancelReservation: (reservationId) => api.post(`/borrow/reservations/${reservationId}/cancel/`),
};

export const notificationsAPI = {
  getMyNotifications: () => api.get('/notifications/my/'),
  getUnreadNotifications: () => api.get('/notifications/my/unread/'),
  markAsRead: (notificationId) => api.post('/notifications/mark-as-read/', { notification_id: notificationId }),
  markAllAsRead: () => api.post('/notifications/mark-all-as-read/'),
  sendNotification: (notificationData) => api.post('/notifications/send/', notificationData),
};

export const reportsAPI = {
  getStudentDashboard: () => api.get('/reports/student/'),
  getProfessorDashboard: () => api.get('/reports/professor/'),
  getLibrarianDashboard: () => api.get('/reports/librarian/'),
  getAdminDashboard: () => api.get('/reports/admin/'),
};

export const paymentsAPI = {
  getMyPayments: () => api.get('/payments/my/'),
  getAllPayments: () => api.get('/payments/all/'),
  createPayment: (paymentData) => api.post('/payments/create/', paymentData),
  createStripeIntent: (paymentId) => api.post('/payments/stripe/create-intent/', { payment_id: paymentId }),
  confirmStripePayment: (paymentId, paymentIntentId) => api.post('/payments/stripe/confirm/', {
    payment_id: paymentId,
    payment_intent_id: paymentIntentId
  }),
};

export default api;