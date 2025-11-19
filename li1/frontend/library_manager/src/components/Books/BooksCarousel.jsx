// src/components/Books/BooksCarousel.jsx
import React, { useState, useRef } from 'react';
import BookCard from './BooksCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  CarouselContainer,
  CarouselHeader,
  CarouselTitle,
  CarouselNav,
  NavButton,
  CarouselTrack,
  CarouselItem
} from './Books.styles';

const BooksCarousel = ({ books, loading, title = "Tendances" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  if (loading) {
    return (
      <CarouselContainer>
        <CarouselHeader>
          <CarouselTitle>{title}</CarouselTitle>
        </CarouselHeader>
        <div>Chargement...</div>
      </CarouselContainer>
    );
  }

  if (!books || books.length === 0) {
    return (
      <CarouselContainer>
        <CarouselHeader>
          <CarouselTitle>{title}</CarouselTitle>
        </CarouselHeader>
        <div>Aucun livre disponible</div>
      </CarouselContainer>
    );
  }

  const itemsPerView = 4;
  const maxIndex = Math.max(0, books.length - itemsPerView);

  const next = () => {
    setCurrentIndex(current => Math.min(current + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex(current => Math.max(current - 1, 0));
  };

  return (
    <CarouselContainer>
      <CarouselHeader>
        <CarouselTitle>{title}</CarouselTitle>
        <CarouselNav>
          <NavButton 
            onClick={prev} 
            disabled={currentIndex === 0}
          >
            <FiChevronLeft />
          </NavButton>
          <NavButton 
            onClick={next} 
            disabled={currentIndex >= maxIndex}
          >
            <FiChevronRight />
          </NavButton>
        </CarouselNav>
      </CarouselHeader>

      <CarouselTrack 
        ref={trackRef}
        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
      >
        {books.map((book, index) => (
          <CarouselItem key={book.id}>
            <BookCard 
              book={book}
              index={index}
            />
          </CarouselItem>
        ))}
      </CarouselTrack>
    </CarouselContainer>
  );
};

export default BooksCarousel;