import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiBook, FiClock, FiAlertTriangle, FiBarChart2, FiBookOpen } from 'react-icons/fi';
import { reportsAPI } from '../api/auth.js';

const DashboardContainer = styled.div`
  padding: 2rem 0;
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .number {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .label {
    color: #6c757d;
    font-size: 0.9rem;
  }

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .number, .label {
      color: white;
    }
  }

  &.warning {
    background: #fff3cd;
    border: 1px solid #ffeaa7;

    .icon {
      color: #f39c12;
    }
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.8rem;
    color: #2c3e50;
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const BookCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .authors {
    color: #6c757d;
    font-style: italic;
    margin-bottom: 0.5rem;
  }

  .year {
    color: #667eea;
    font-weight: 500;
  }
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

const DashboardProfessor = () => {
  const { data, isLoading, error } = useQuery(
    'professor-dashboard',
    () => reportsAPI.getProfessorDashboard(),
    {
      retry: 1,
    }
  );

  if (isLoading) {
    return (
      <DashboardContainer className="container">
        <Loading>Chargement du dashboard...</Loading>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer className="container">
        <Error>
          <h2>Erreur lors du chargement du dashboard</h2>
          <p>{error.message}</p>
        </Error>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer className="container">
      <DashboardHeader>
        <h1>Tableau de Bord Professeur</h1>
        <p>Gérez vos emprunts et restez informé des nouveautés</p>
      </DashboardHeader>

      <StatsGrid>
        <StatCard className="primary">
          <div className="icon">
            <FiBook />
          </div>
          <div className="number">{data?.stats?.current_borrows || 0}</div>
          <div className="label">Emprunts en cours</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiClock />
          </div>
          <div className="number">{data?.stats?.reservations || 0}</div>
          <div className="label">Réservations</div>
        </StatCard>

        <StatCard className="warning">
          <div className="icon">
            <FiAlertTriangle />
          </div>
          <div className="number">{data?.stats?.overdue_borrows || 0}</div>
          <div className="label">Retards</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiBarChart2 />
          </div>
          <div className="number">{data?.stats?.borrow_history || 0}</div>
          <div className="label">Historique d'emprunts</div>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <h2>Nouveautés</h2>
        </SectionHeader>
        
        {data?.recent_books?.length > 0 ? (
          <BooksGrid>
            {data.recent_books.map((book, index) => (
              <BookCard key={index}>
                <h3>{book.title}</h3>
                <div className="authors">
                  {book.authors?.join(', ') || 'Auteur inconnu'}
                </div>
                {book.publication_date && (
                  <div className="year">
                    {new Date(book.publication_date).getFullYear()}
                  </div>
                )}
              </BookCard>
            ))}
          </BooksGrid>
        ) : (
          <div className="text--center text--muted">
            Aucune nouveauté pour le moment
          </div>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h2>Outils de Recherche</h2>
        </SectionHeader>
        
        <div className="grid grid--2">
          <div className="card">
            <div className="card__header">
              <h3>
                <FiBookOpen /> Bases de données académiques
              </h3>
            </div>
            <div className="card__body">
              <p>Accédez à nos ressources académiques et bases de données spécialisées.</p>
              <button className="btn btn--primary mt-3">
                Accéder aux ressources
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>
                <FiBook /> Suggestions d'acquisition
              </h3>
            </div>
            <div className="card__body">
              <p>Proposez de nouveaux ouvrages pour enrichir notre collection.</p>
              <button className="btn btn--primary mt-3">
                Faire une suggestion
              </button>
            </div>
          </div>
        </div>
      </Section>
    </DashboardContainer>
  );
};

export default DashboardProfessor;