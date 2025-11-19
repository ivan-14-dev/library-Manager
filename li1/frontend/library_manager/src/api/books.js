// export const booksAPI = {
//   // ... fonctions existantes
//   // Export pour pouvoir l'importer directement depuis le fichier index
//   getBooks: (params) => api.get('/books/', { params }),
//   getBook: (id) => api.get(`/books/${id}/`),
//   createBook: (bookData) => api.post('/books/create/', bookData),
//   updateBook: (id, bookData) => api.put(`/books/${id}/update/`, bookData),
//   deleteBook: (id) => api.delete(`/books/${id}/delete/`),
//   getAuthors: () => api.get('/books/authors/'),
//   getCategories: () => api.get('/books/categories/'),
  
//   // Livres personnels
//   getPersonalBooks: () => api.get('/books/personal/'),
//   getPersonalBook: (id) => api.get(`/books/personal/${id}/`),
//   createPersonalBook: (bookData) => api.post('/books/personal/', bookData),
//   updatePersonalBook: (id, bookData) => api.put(`/books/personal/${id}/`, bookData),
//   deletePersonalBook: (id) => api.delete(`/books/personal/${id}/`),
//   getPublicPersonalBooks: (params) => api.get('/books/personal/public/', { params }),
//   getPublicPersonalBook: (id) => api.get(`/books/personal/public/${id}/`),
// };


// src/api/books.js
export const booksAPI = {
  // Récupérer les livres les mieux notés
  getHighRatedBooks: async () => {
    try {
      const response = await fetch('/api/books/high-rated');
      if (!response.ok) throw new Error('Failed to fetch high rated books');
      return await response.json();
    } catch (error) {
      console.error('Error fetching high rated books:', error);
      // Données de démonstration
      return Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Livre Excellent ${i + 1}`,
        author: `Auteur ${i + 1}`,
        coverUrl: `/api/placeholder/200/300?text=Livre+${i + 1}`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        year: 2023 - Math.floor(Math.random() * 5),
        category: ['Informatique', 'Science', 'Management'][i % 3],
        isLiked: Math.random() > 0.7
      }));
    }
  },

  // Récupérer les livres tendances
  getTrendingBooks: async () => {
    try {
      const response = await fetch('/api/books/trending');
      if (!response.ok) throw new Error('Failed to fetch trending books');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending books:', error);
      return Array.from({ length: 12 }, (_, i) => ({
        id: i + 100,
        title: `Livre Tendance ${i + 1}`,
        author: `Expert ${i + 1}`,
        coverUrl: `https://5livres.fr/wp-content/uploads/2024/03/10-livres-de-reference-pour-sinitier-au-hacking-sur-de-bonnes-bases.jpg`,
        rating: (4.0 + Math.random() * 1.0).toFixed(1),
        year: 2024 - Math.floor(Math.random() * 3),
        category: ['Électronique', 'Physique', 'Chimie'][i % 3],
        isLiked: Math.random() > 0.8
      }));
    }
  },

  // Récupérer les livres populaires
  getPopularBooks: async () => {
    try {
      const response = await fetch('/api/books/popular');
      if (!response.ok) throw new Error('Failed to fetch popular books');
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular books:', error);
      return Array.from({ length: 8 }, (_, i) => ({
        id: i + 200,
        title: `Livre Populaire ${i + 1}`,
        author: `Auteur Célèbre ${i + 1}`,
        coverUrl: `/api/placeholder/200/300?text=Populaire+${i + 1}`,
        rating: (4.2 + Math.random() * 0.8).toFixed(1),
        year: 2024 - Math.floor(Math.random() * 2),
        category: ['BMS', 'Marketing', 'Finance'][i % 3],
        isLiked: Math.random() > 0.6
      }));
    }
  },

  // Récupérer les détails d'un livre
  getBookDetails: async (id) => {
    try {
      const response = await fetch(`/api/books/${id}`);
      if (!response.ok) throw new Error('Failed to fetch book details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      return {
        id,
        title: `Livre Détail ${id}`,
        author: `Auteur Principal`,
        coverUrl: `/api/placeholder/400/600?text=Livre+${id}`,
        rating: '4.5',
        year: 2024,
        category: 'Informatique',
        description: 'Description détaillée du livre...',
        pages: 350,
        language: 'Français',
        isbn: '978-3-16-148410-0'
      };
    }
  },

  // Récupérer les commentaires d'un livre
  getBookComments: async (id) => {
    try {
      const response = await fetch(`/api/books/${id}/comments`);
      if (!response.ok) throw new Error('Failed to fetch book comments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching book comments:', error);
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        user: `Utilisateur ${i + 1}`,
        rating: 4 + (i % 2),
        comment: `Excellent livre ! Très instructif. ${i + 1}`,
        date: new Date(Date.now() - i * 86400000).toISOString()
      }));
    }
  },

  // Ajouter un commentaire
  addComment: async (bookId, commentData) => {
    try {
      const response = await fetch(`/api/books/${bookId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
};