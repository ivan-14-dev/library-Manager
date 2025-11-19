import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiPlus, FiBook, FiEye, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi';
import { booksAPI } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const BooksContainer = styled.div`
  padding: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
    border-color: ${props => props.active ? '#0056b3' : '#007bff'};
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const BookCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const BookCover = styled.div`
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;

  &:not([style]) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const BookContent = styled.div`
  padding: 1.5rem;
`;

const BookTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  line-height: 1.4;
`;

const BookSummary = styled.p`
  color: #6c757d;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6c757d;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;

  ${props => {
    switch (props.status) {
      case 'DRAFT':
        return 'background: #e2e3e5; color: #383d41;';
      case 'PUBLISHED':
        return 'background: #d4edda; color: #155724;';
      case 'ARCHIVED':
        return 'background: #f8d7da; color: #721c24;';
      default:
        return 'background: #e9ecef; color: #495057;';
    }
  }}
`;

const BookActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 0.25rem;
  background: white;
  color: #6c757d;
  transition: all 0.3s ease;

  &:hover {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  &.delete:hover {
    background: #dc3545;
    border-color: #dc3545;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;

  h3 {
    margin-bottom: 1rem;
    color: #6c757d;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #6c757d;
`;

const PersonalBooks = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all', 'draft', 'published', 'archived'

  const { data: books, isLoading, error, refetch } = useQuery(
    'personal-books',
    () => booksAPI.getPersonalBooks(),
    {
      enabled: isAuthenticated,
    }
  );

  const filteredBooks = books?.data?.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });

  const getStatusText = (status) => {
    const statusMap = {
      'DRAFT': 'Brouillon',
      'PUBLISHED': 'Publié',
      'ARCHIVED': 'Archivé'
    };
    return statusMap[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <BooksContainer className="container">
        <EmptyState>
          <h3>Connectez-vous pour accéder à vos livres</h3>
          <p>Vous devez être connecté pour créer et gérer vos livres personnels</p>
          <Link to="/login" className="btn btn--primary">
            Se connecter
          </Link>
        </EmptyState>
      </BooksContainer>
    );
  }

  if (isLoading) {
    return (
      <BooksContainer className="container">
        <Loading>Chargement de vos livres...</Loading>
      </BooksContainer>
    );
  }

  if (error) {
    return (
      <BooksContainer className="container">
        <div className="text--center">
          <h2>Erreur lors du chargement</h2>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn btn--primary mt-3">
            Réessayer
          </button>
        </div>
      </BooksContainer>
    );
  }

  return (
    <BooksContainer className="container">
      <Header>
        <Title>Mes Livres Personnels</Title>
        <Actions>
          <Link to="/personal-books/new" className="btn btn--primary">
            <FiPlus /> Nouveau livre
          </Link>
        </Actions>
      </Header>

      <FilterBar>
        <span>
          <FiFilter /> Filtrer:
        </span>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Tous
        </FilterButton>
        <FilterButton
          active={filter === 'DRAFT'}
          onClick={() => setFilter('DRAFT')}
        >
          Brouillons
        </FilterButton>
        <FilterButton
          active={filter === 'PUBLISHED'}
          onClick={() => setFilter('PUBLISHED')}
        >
          Publiés
        </FilterButton>
        <FilterButton
          active={filter === 'ARCHIVED'}
          onClick={() => setFilter('ARCHIVED')}
        >
          Archivés
        </FilterButton>
      </FilterBar>

      {filteredBooks?.length === 0 ? (
        <EmptyState>
          <FiBook size={48} />
          <h3>Aucun livre trouvé</h3>
          <p>
            {filter === 'all' 
              ? "Vous n'avez pas encore créé de livre personnel."
              : `Vous n'avez pas de livres avec le statut "${getStatusText(filter)}".`
            }
          </p>
          {filter === 'all' && (
            <Link to="/personal-books/new" className="btn btn--primary mt-3">
              Écrire mon premier livre
            </Link>
          )}
        </EmptyState>
      ) : (
        <>
          <BooksGrid>
            {filteredBooks?.map(book => (
              <BookCard key={book.id}>
                <BookCover image={book.cover_image}>
                  {!book.cover_image && <FiBook />}
                </BookCover>
                
                <BookContent>
                  <BookTitle>{book.title}</BookTitle>
                  
                  {book.summary && (
                    <BookSummary>{book.summary}</BookSummary>
                  )}
                  
                  <BookMeta>
                    <div>
                      {book.word_count} mots • {book.reading_time} min
                    </div>
                    <StatusBadge status={book.status}>
                      {getStatusText(book.status)}
                    </StatusBadge>
                  </BookMeta>
                  
                  <BookMeta>
                    <div>
                      {new Date(book.updated_at).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      {book.is_public ? 'Public' : 'Privé'}
                    </div>
                  </BookMeta>
                  
                  <BookActions>
                    <ActionButton
                      as={Link}
                      to={`/personal-books/${book.id}`}
                      title="Modifier"
                    >
                      <FiEdit />
                    </ActionButton>
                    
                    {book.status === 'PUBLISHED' && book.is_public && (
                      <ActionButton
                        as={Link}
                        to={`/library/personal/${book.id}`}
                        title="Voir en public"
                      >
                        <FiEye />
                      </ActionButton>
                    )}
                    
                    <ActionButton
                      className="delete"
                      title="Supprimer"
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
                          booksAPI.deletePersonalBook(book.id)
                            .then(() => {
                              toast.success('Livre supprimé avec succès');
                              refetch();
                            })
                            .catch(error => {
                              toast.error('Erreur lors de la suppression');
                            });
                        }
                      }}
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </BookActions>
                </BookContent>
              </BookCard>
            ))}
          </BooksGrid>
        </>
      )}
    </BooksContainer>
  );
};

export default PersonalBooks;