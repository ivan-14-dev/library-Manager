import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiSearch, FiBook, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

import { useQuery } from '@tanstack/react-query';
import { booksAPI } from '../api/books';
import {Header} from '../components/Layout/Header.jsx';
import {Footer} from '../components/Layout/Footer.jsx';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const FeatureSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: #f8f9fa;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  svg {
    font-size: 3rem;
    color: #667eea;
    margin-bottom: 1rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatItem = styled.div`
  padding: 2rem;

  .number {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .label {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const Home = () => {
  const { isAuthenticated, isStudent, isProfessor, isLibrarian, isAdmin } = useAuth();


  const getDashboardPath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isLibrarian) return '/dashboard/librarian';
    if (isProfessor) return '/dashboard/professor';
    if (isStudent) return '/dashboard/student';
    return '/login';
  };

  // Requête pour vérifier s'il y a des livres
  const { data: booksData, isLoading, error } = useQuery({
  queryKey: ['books-home'],
  queryFn: () => booksAPI.getBooks({ page: 1, limit: 1 }),
});


  if (isLoading) {
    return <div className="container">Chargement des informations...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <h2>Erreur lors du chargement des livres</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  const hasBooks = booksData?.count > 0;
  return (
    <>
      <Header />
      <HeroSection>
        <div className="container">
          <HeroTitle>Bienvenue à la Bibliothèque</HeroTitle>
          <HeroSubtitle>
            {hasBooks
              ? 'Découvrez, empruntez et explorez notre vaste collection de livres'
              : 'La bibliothèque est actuellement vide, revenez bientôt pour découvrir nos livres !'}
          </HeroSubtitle>
          <HeroButtons>
            {hasBooks && (
              <Link to="/books" className="btn btn--primary btn--lg">
                <FiSearch /> Explorer le catalogue
              </Link>
            )}
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="btn btn--outline btn--lg">
                Mon dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn btn--outline btn--lg">
                Créer un compte
              </Link>
            )}
          </HeroButtons>
        </div>
      </HeroSection>

      {hasBooks && (
        <>
          <FeatureSection>
            <div className="container">
              <h2 className="text--center">Pourquoi choisir notre bibliothèque ?</h2>
              <FeatureGrid>
                <FeatureCard>
                  <FiBook />
                  <FeatureTitle>Collection Complète</FeatureTitle>
                  <FeatureDescription>
                    Accédez à des milliers de livres couvrant tous les genres et sujets,
                    des classiques aux dernières publications.
                  </FeatureDescription>
                </FeatureCard>

                <FeatureCard>
                  <FiSearch />
                  <FeatureTitle>Recherche Avancée</FeatureTitle>
                  <FeatureDescription>
                    Trouvez rapidement le livre parfait grâce à notre système de recherche
                    intuitive et nos filtres avancés.
                  </FeatureDescription>
                </FeatureCard>

                <FeatureCard>
                  <FiUsers />
                  <FeatureTitle>Communauté Active</FeatureTitle>
                  <FeatureDescription>
                    Rejoignez une communauté de lecteurs passionnés, participez à des
                    événements et découvrez de nouvelles recommandations.
                  </FeatureDescription>
                </FeatureCard>

                <FeatureCard>
                  <FiBarChart2 />
                  <FeatureTitle>Gestion Simplifiée</FeatureTitle>
                  <FeatureDescription>
                    Gérez vos emprunts, réservations et préférences en quelques clics
                    depuis votre espace personnel.
                  </FeatureDescription>
                </FeatureCard>
              </FeatureGrid>
            </div>
          </FeatureSection>

          <StatsSection>
            <div className="container">
              <StatsGrid>
                <StatItem>
                  <div className="number">10,000+</div>
                  <div className="label">Livres disponibles</div>
                </StatItem>
                <StatItem>
                  <div className="number">5,000+</div>
                  <div className="label">Membres actifs</div>
                </StatItem>
                <StatItem>
                  <div className="number">500+</div>
                  <div className="label">Nouveautés mensuelles</div>
                </StatItem>
                <StatItem>
                  <div className="number">99%</div>
                  <div className="label">Satisfaction des membres</div>
                </StatItem>
              </StatsGrid>
            </div>
          </StatsSection>
        </>
      )}

      {!hasBooks && (
        <div className="container text--center mt-5">
          <h2>Aucun livre disponible pour le moment</h2>
          <p>La bibliothèque ne contient actuellement aucun livre. Revenez plus tard !</p>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Home;