// src/pages/PopularBooksPage.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksAPI } from '../api/books';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BooksGrid from '../components/Books/BooksGrid';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const PopularBooksPage = () => {
  const { user } = useAuth();

  const { data: popularBooks, isLoading } = useQuery({
    queryKey: ['popularBooks'],
    queryFn: () => booksAPI.getPopularBooks(),
  });

  return (
    <PageContainer>
      <Header user={user} />
      <MainContent>
        <Section>
          <SectionTitle>Livres Populaires</SectionTitle>
          <BooksGrid books={popularBooks} loading={isLoading} />
        </Section>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fefefe 0%, #f3f4f6 100%);
  color: #1a202c;
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.section`
  margin: 4rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

export default PopularBooksPage;
