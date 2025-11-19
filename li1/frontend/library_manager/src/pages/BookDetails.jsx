import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FiArrowLeft, FiBook, FiUser, FiCalendar, FiHash, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { booksAPI, borrowAPI } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

const BookDetailContainer = styled.div`
  padding: 2rem 0;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  color: #007bff;
  font-weight: 500;
  margin-bottom: 2rem;
  padding: 0.5rem 0;

  &:hover {
    color: #0056b3;
  }
`;

const BookDetailCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const BookHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const BookCover = styled.div`
  width: 200px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;

  @media (max-width: 768px) {
    width: 150px;
    height: 225px;
    margin: 0 auto;
  }
`;

const BookInfo = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`;

const BookMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  margin-top: 1rem;

  ${props => {
    switch (props.status) {
      case 'AVAILABLE':
        return 'background: #d4edda; color: #155724;';
      case 'BORROWED':
        return 'background: #f8d7da; color: #721c24;';
      case 'RESERVED':
        return 'background: #fff3cd; color: #856404;';
      case 'MAINTENANCE':
        return 'background: #e2e3e5; color: #383d41;';
      default:
        return 'background: #e9ecef; color: #495057;';
    }
  }}
`;

const BookContent = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const BookDescription = styled.div`
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  p {
    line-height: 1.8;
    color: #495057;
    margin-bottom: 1.5rem;
  }
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;

  strong {
    min-width: 120px;
    color: #495057;
  }

  span {
    color: #6c757d;
  }
`;

const ActionSection = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AvailabilityInfo = styled.div`
  padding: 1rem;
  background: ${props => props.available ? '#d4edda' : '#fff3cd'};
  color: ${props => props.available ? '#155724' : '#856404'};
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState(false);

  const { data: book, isLoading, error } = useQuery(
    ['book', id],
    () => booksAPI.getBook(id),
    {
      enabled: !!id,
    }
  );

  const borrowMutation = useMutation(
    () => borrowAPI.borrowBook(id),
    {
      onSuccess: () => {
        toast.success('Livre emprunté avec succès!');
        queryClient.invalidateQueries(['book', id]);
        queryClient.invalidateQueries('my-borrows');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Erreur lors de l\'emprunt');
      },
      onSettled: () => {
        setActionLoading(false);
      }
    }
  );

  const reserveMutation = useMutation(
    () => borrowAPI.reserveBook(id),
    {
      onSuccess: () => {
        toast.success('Livre réservé avec succès!');
        queryClient.invalidateQueries(['book', id]);
        queryClient.invalidateQueries('my-reservations');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Erreur lors de la réservation');
      },
      onSettled: () => {
        setActionLoading(false);
      }
    }
  );

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour emprunter un livre');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    borrowMutation.mutate();
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour réserver un livre');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    reserveMutation.mutate();
  };

  const getStatusText = (status) => {
    const statusMap = {
      'AVAILABLE': 'Disponible',
      'BORROWED': 'Emprunté',
      'RESERVED': 'Réservé',
      'MAINTENANCE': 'En maintenance'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <BookDetailContainer className="container">
        <div className="loading">Chargement...</div>
      </BookDetailContainer>
    );
  }

  if (error) {
    return (
      <BookDetailContainer className="container">
        <div className="text--center">
          <h2>Livre non trouvé</h2>
          <p>Le livre que vous recherchez n'existe pas ou a été supprimé.</p>
          <button onClick={() => navigate('/books')} className="btn btn--primary mt-3">
            Retour au catalogue
          </button>
        </div>
      </BookDetailContainer>
    );
  }

  if (!book || Object.keys(book).length === 0) {
    return (
      <BookDetailContainer className="container">
        <div className="text--center">
          <h2>Aucun livre disponible</h2>
          <p>La base de données ne contient actuellement aucun livre.</p>
          <button onClick={() => navigate('/books')} className="btn btn--primary mt-3">
            Retour au catalogue
          </button>
        </div>
      </BookDetailContainer>
    );
  }


  return (
    <BookDetailContainer className="container">
      <BackButton onClick={() => navigate('/books')}>
        <FiArrowLeft /> Retour au catalogue
      </BackButton>

      {book && (
        <BookDetailCard>
          <BookHeader>
            <BookCover>
              <FiBook />
            </BookCover>
            
            <BookInfo>
              <h1>{book.title}</h1>
              
              <BookMeta>
                <MetaItem>
                  <FiHash /> ISBN: {book.isbn}
                </MetaItem>
                
                {book.publication_date && (
                  <MetaItem>
                    <FiCalendar /> {new Date(book.publication_date).getFullYear()}
                  </MetaItem>
                )}
                
                {book.pages && (
                  <MetaItem>
                    <FiBook /> {book.pages} pages
                  </MetaItem>
                )}
                
                {book.language && (
                  <MetaItem>
                    <FiUser /> {book.language}
                  </MetaItem>
                )}
              </BookMeta>
              
              <StatusBadge status={book.status}>
                {getStatusText(book.status)}
              </StatusBadge>
            </BookInfo>
          </BookHeader>

          <BookContent>
            <BookDescription>
              <h2>Description</h2>
              <p>{book.description || 'Aucune description disponible pour ce livre.'}</p>
              
              <h2>Détails</h2>
              <DetailsList>
                <DetailItem>
                  <strong>Auteur(s):</strong>
                  <span>
                    {book.authors?.map(author => 
                      `${author.first_name} ${author.last_name}`
                    ).join(', ') || 'Inconnu'}
                  </span>
                </DetailItem>
                
                <DetailItem>
                  <strong>Catégorie(s):</strong>
                  <span>
                    {book.categories?.map(category => category.name).join(', ') || 'Non catégorisé'}
                  </span>
                </DetailItem>
                
                <DetailItem>
                  <strong>Éditeur:</strong>
                  <span>{book.publisher || 'Inconnu'}</span>
                </DetailItem>
                
                <DetailItem>
                  <strong>Langue:</strong>
                  <span>{book.language || 'Non spécifié'}</span>
                </DetailItem>
                
                <DetailItem>
                  <strong>Pages:</strong>
                  <span>{book.pages || 'Non spécifié'}</span>
                </DetailItem>
                
                <DetailItem>
                  <strong>Exemplaires:</strong>
                  <span>{book.available_copies} disponible(s) sur {book.total_copies}</span>
                </DetailItem>
                
                <DetailItem>
                  <strong>Date d'ajout:</strong>
                  <span>{new Date(book.created_at).toLocaleDateString('fr-FR')}</span>
                </DetailItem>
              </DetailsList>
            </BookDescription>

            <ActionSection>
              <h3>Actions</h3>
              
              {book.status === 'AVAILABLE' && book.available_copies > 0 ? (
                <AvailabilityInfo available>
                  <FiClock /> Disponible pour emprunt
                </AvailabilityInfo>
              ) : book.status === 'RESERVED' ? (
                <AvailabilityInfo>
                  <FiAlertCircle /> Réservé - En attente de disponibilité
                </AvailabilityInfo>
              ) : (
                <AvailabilityInfo>
                  <FiAlertCircle /> Indisponible pour le moment
                </AvailabilityInfo>
              )}
              
              <ActionButtons>
                {book.status === 'AVAILABLE' && book.available_copies > 0 && (
                  <button
                    onClick={handleBorrow}
                    disabled={actionLoading}
                    className="btn btn--primary"
                  >
                    {actionLoading ? 'Traitement...' : 'Emprunter ce livre'}
                  </button>
                )}
                
                {book.status !== 'AVAILABLE' && (
                  <button
                    onClick={handleReserve}
                    disabled={actionLoading || book.status === 'RESERVED'}
                    className="btn btn--secondary"
                  >
                    {actionLoading ? 'Traitement...' : 
                     book.status === 'RESERVED' ? 'Déjà réservé' : 'Réserver ce livre'}
                  </button>
                )}
                
                {(user?.isLibrarian() || user?.isAdmin()) && (
                  <>
                    <button className="btn btn--outline">
                      Modifier le livre
                    </button>
                    <button className="btn btn--danger">
                      Supprimer le livre
                    </button>
                  </>
                )}
              </ActionButtons>
            </ActionSection>
          </BookContent>
        </BookDetailCard>
      )}
    </BookDetailContainer>
  );
};

export default BookDetails;