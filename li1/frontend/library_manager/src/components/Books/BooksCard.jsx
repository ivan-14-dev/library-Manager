// src/components/Books/BookCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiHeart, FiStar } from 'react-icons/fi';
import { 
  Card, 
  CardLink, 
  CoverContainer, 
  BookImage, 
  BookOverlay,
  BookActions,
  ActionButton,
  BookRating,
  BookInfo,
  BookTitle,
  BookAuthor,
  BookMeta,
  BookYear,
  BookCategory,
  BookCardWrapper
} from './Books.styles';

const BookCard = ({ book, index }) => {
  const [isLiked, setIsLiked] = useState(book.isLiked || false);

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    
    switch(action) {
      case 'like':
        setIsLiked(!isLiked);
        break;
      default:
        break;
    }
  };

  return (
    <BookCardWrapper>
      <Card style={{ animationDelay: `${index * 0.1}s` }}>
        <CardLink to={`/book/${book.id}`}>
          <CoverContainer>
            <BookImage 
              src={book.coverUrl || `/api/placeholder/200/300?text=${encodeURIComponent(book.title)}`} 
              alt={book.title} 
            />
            <BookOverlay>
              <BookActions>
                <ActionButton 
                  onClick={(e) => handleAction(e, 'view')}
                  title="Voir les détails"
                >
                  <FiEye />
                </ActionButton>
                <ActionButton 
                  onClick={(e) => handleAction(e, 'like')}
                  $liked={isLiked}
                  title="Ajouter aux favoris"
                >
                  <FiHeart fill={isLiked ? 'currentColor' : 'none'} />
                </ActionButton>
              </BookActions>
            </BookOverlay>
            
            <BookRating>
              <FiStar fill="currentColor" />
              {book.rating || '4.5'}
            </BookRating>
          </CoverContainer>
          
          <BookInfo>
            <BookTitle>{book.title}</BookTitle>
            <BookAuthor>
              {book.author || 'Auteur inconnu'}
            </BookAuthor>
            <BookMeta>
              <BookYear>{book.year || '2024'}</BookYear>
              <BookCategory>{book.category || 'Littérature'}</BookCategory>
            </BookMeta>
          </BookInfo>
        </CardLink>
      </Card>
    </BookCardWrapper>
  );
};

export default BookCard;