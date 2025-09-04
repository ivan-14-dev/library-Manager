export const booksAPI = {
  // ... fonctions existantes
  // Export pour pouvoir l'importer directement depuis le fichier index
  getBooks: (params) => api.get('/books/', { params }),
  getBook: (id) => api.get(`/books/${id}/`),
  createBook: (bookData) => api.post('/books/create/', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}/update/`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}/delete/`),
  getAuthors: () => api.get('/books/authors/'),
  getCategories: () => api.get('/books/categories/'),
  
  // Livres personnels
  getPersonalBooks: () => api.get('/books/personal/'),
  getPersonalBook: (id) => api.get(`/books/personal/${id}/`),
  createPersonalBook: (bookData) => api.post('/books/personal/', bookData),
  updatePersonalBook: (id, bookData) => api.put(`/books/personal/${id}/`, bookData),
  deletePersonalBook: (id) => api.delete(`/books/personal/${id}/`),
  getPublicPersonalBooks: (params) => api.get('/books/personal/public/', { params }),
  getPublicPersonalBook: (id) => api.get(`/books/personal/public/${id}/`),
};