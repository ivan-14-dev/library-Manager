import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiBook, FiUser, FiCalendar, FiHash } from 'react-icons/fi';

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const BookImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
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

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;

  svg {
    flex-shrink: 0;
  }
`;

const AuthorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const AuthorTag = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;

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

const ActionButton = styled(Link)`
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const BookCard = ({ book }) => {
  const getStatusText = (status) => {
    const statusMap = {
      'AVAILABLE': 'Disponible',
      'BORROWED': 'Emprunté',
      'RESERVED': 'Réservé',
      'MAINTENANCE': 'Maintenance'
    };
    return statusMap[status] || status;
  };

  return (
    <Card>
      <BookImage>
        <FiBook />
      </BookImage>
      
      <BookContent>
        <BookTitle>{book.title}</BookTitle>
        
        <BookInfo>
          <InfoItem>
            <FiHash />
            ISBN: {book.isbn}
          </InfoItem>
          
          {book.publication_date && (
            <InfoItem>
              <FiCalendar />
              Publié: {new Date(book.publication_date).getFullYear()}
            </InfoItem>
          )}
          
          {book.pages && (
            <InfoItem>
              <FiBook />
              {book.pages} pages
            </InfoItem>
          )}
        </BookInfo>
        
        {book.authors && book.authors.length > 0 && (
          <>
            <InfoItem>
              <FiUser />
              Auteur(s):
            </InfoItem>
            <AuthorsList>
              {book.authors.map(author => (
                <AuthorTag key={author.id}>
                  {author.first_name} {author.last_name}
                </AuthorTag>
              ))}
            </AuthorsList>
          </>
        )}
        
        <StatusBadge status={book.status}>
          {getStatusText(book.status)}
        </StatusBadge>
        
        <InfoItem>
          Exemplaires: {book.available_copies}/{book.total_copies}
        </InfoItem>
        
        <ActionButton to={`/books/${book.id}`}>
          Voir détails
        </ActionButton>
      </BookContent>
    </Card>
  );
};

export default BookCard;