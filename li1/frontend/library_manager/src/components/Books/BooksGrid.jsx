// src/components/Books/BooksGrid.jsx
import React from 'react';
import BookCard from './BooksCard';
import { BooksGridContainer, LoadingMessage, EmptyMessage } from './Books.styles';

// Styles locaux
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 2px solid rgba(37, 99, 235, 0.3);
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const BooksGrid = ({ books, loading }) => {
  if (loading) {
    return (
      <LoadingMessage>
        <Spinner />
        Chargement des livres...
      </LoadingMessage>
    );
  }

  if (!books || books.length === 0) {
    return (
      <EmptyMessage>
        📚 Aucun livre disponible pour le moment
      </EmptyMessage>
    );
  }

  return (
    <BooksGridContainer>
      {books.map((book, index) => (
        <BookCard 
          key={book.id} 
          book={book}
          index={index}
        />
      ))}
    </BooksGridContainer>
  );
};

export default BooksGrid;