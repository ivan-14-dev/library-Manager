// src/components/Books/Books.styles.js
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const cardHover = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
  100% {
    transform: translateY(-8px) rotate(0deg);
  }
`;

const imageZoom = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1.03);
  }
`;

const likePulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

// BookCard Styles
export const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: ${fadeInUp} 0.6s ease-out both;
  backdrop-filter: blur(10px);
  position: relative;

  &:hover {
    animation: ${cardHover} 0.6s ease-out forwards;
    border-color: rgba(37, 99, 235, 0.3);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(37, 99, 235, 0.1);
  }
`;

export const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

export const CoverContainer = styled.div`
  position: relative;
  padding-bottom: 150%;
  overflow: hidden;
  background: #f9fafb;
`;

export const BookImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
`;

export const BookOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(31, 41, 55, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

export const BookActions = styled.div`
  display: flex;
  gap: 0.8rem;
`;

export const ActionButton = styled.button`
  background: ${props => props.liked ? '#ea580c' : 'rgba(255, 255, 255, 0.9)'};
  border: none;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.liked ? 'white' : '#1f2937'};

  &:hover {
    background: ${props => props.liked ? '#dc2626' : 'white'};
    transform: scale(1.1);
    
    ${props => props.liked && css`
      animation: ${likePulse} 0.3s ease-in-out;
    `}
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

export const BookRating = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  background: rgba(31, 41, 55, 0.9);
  color: #fbbf24;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: 'Inter', sans-serif;
`;

export const BookInfo = styled.div`
  padding: 1.5rem;
`;

export const BookTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Playfair Display', serif;
`;

export const BookAuthor = styled.p`
  font-size: 0.9rem;
  color: #2563eb;
  margin-bottom: 0.8rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

export const BookMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6b7280;
  font-family: 'Inter', sans-serif;
`;

export const BookYear = styled.span``;
export const BookCategory = styled.span``;

// BooksGrid Styles
export const BooksGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1.5rem;
  }
`;

export const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
  font-size: 1.1rem;
  font-family: 'Inter', sans-serif;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
`;

// BooksCarousel Styles
export const CarouselContainer = styled.div`
  position: relative;
  margin: 2rem 0;
  overflow: hidden;
`;

export const CarouselHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const CarouselTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Playfair Display', serif;
`;

export const CarouselNav = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const NavButton = styled.button`
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: rgba(37, 99, 235, 0.2);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: 1.5rem;
  transition: transform 0.5s ease;
  padding: 0.5rem 0;
`;

export const CarouselItem = styled.div`
  flex: 0 0 calc(25% - 1.5rem);
  min-width: 0;

  @media (max-width: 1024px) {
    flex: 0 0 calc(33.333% - 1.5rem);
  }

  @media (max-width: 768px) {
    flex: 0 0 calc(50% - 1.5rem);
  }

  @media (max-width: 480px) {
    flex: 0 0 calc(100% - 1.5rem);
  }
`;

// Composant wrapper pour gérer l'animation d'image - CORRIGÉ
export const BookCardWrapper = styled.div`
  &:hover ${BookImage} {
    ${css`animation: ${imageZoom} 0.6s ease-out forwards;`}
  }
`;