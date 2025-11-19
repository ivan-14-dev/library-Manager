import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiBook, FiUser, FiClock, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { booksAPI } from '../api/auth.js';

const PublicationsContainer = styled.div`
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
`;

const PublicationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PublicationCard = styled(Link)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CoverImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const BookTitle = styled.h3`
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const BookSummary = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
`;

const AuthorName = styled.span`
  color: #495057;
  font-weight: 500;
`;

const BookStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #6c757d;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #6c757d;
`;

const Error = styled.div`
  text-align: center;
  padding: 3rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 0.5rem;
  margin: 2rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const PublicPublications = () => {
  const { data: publications, isLoading, error } = useQuery(
    'public-publications',
    () => booksAPI.getPublicPersonalBooks(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  if (isLoading) {
    return (
      <PublicationsContainer className="container">
        <Loading>Chargement des publications...</Loading>
      </PublicationsContainer>
    );
  }

  if (error) {
    return (
      <PublicationsContainer className="container">
        <Error>
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger les publications publiques.</p>
        </Error>
      </PublicationsContainer>
    );
  }

  return (
    <PublicationsContainer className="container">
      <Header>
        <Title>Publications Publiques</Title>
        <Subtitle>
          Découvrez les livres personnels partagés par notre communauté d'auteurs et d'écrivains.
        </Subtitle>
      </Header>

      {publications && publications.length > 0 ? (
        <PublicationsGrid>
          {publications.map((publication) => (
            <PublicationCard
              key={publication.id}
              to={`/library/personal/${publication.id}`}
            >
              <CoverImage image={publication.cover_image}>
                {!publication.cover_image && <FiBook />}
              </CoverImage>

              <CardContent>
                <BookTitle>{publication.title}</BookTitle>

                {publication.summary && (
                  <BookSummary>{publication.summary}</BookSummary>
                )}

                <AuthorInfo>
                  <AuthorAvatar>
                    <FiUser />
                  </AuthorAvatar>
                  <AuthorName>
                    {publication.user?.first_name} {publication.user?.last_name}
                  </AuthorName>
                </AuthorInfo>

                <BookStats>
                  <StatItem>
                    <FiClock />
                    {publication.reading_time || 0} min
                  </StatItem>
                  <StatItem>
                    <FiEye />
                    {publication.word_count || 0} mots
                  </StatItem>
                  <StatItem>
                    <FiHeart />
                    {publication.likes_count || 0}
                  </StatItem>
                </BookStats>
              </CardContent>
            </PublicationCard>
          ))}
        </PublicationsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <FiBook />
          </EmptyIcon>
          <h3>Aucune publication trouvée</h3>
          <p>Il n'y a pas encore de publications publiques disponibles.</p>
        </EmptyState>
      )}
    </PublicationsContainer>
  );
};

export default PublicPublications;