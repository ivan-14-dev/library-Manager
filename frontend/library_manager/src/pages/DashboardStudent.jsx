import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiBook, FiClock, FiAlertTriangle, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
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

  &.danger {
    background: #f8d7da;
    border: 1px solid #f5c6cb;

    .icon {
      color: #e74c3c;
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

  .count {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 0.5rem;
  }

  .description {
    color: #6c757d;
    font-size: 0.9rem;
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

const DashboardStudent = () => {
  const { data, isLoading, error } = useQuery(
    'student-dashboard',
    () => reportsAPI.getStudentDashboard(),
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
        <h1>Tableau de Bord Étudiant</h1>
        <p>Gérez vos emprunts et découvrez de nouveaux livres</p>
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
          <h2>Livres Populaires</h2>
        </SectionHeader>
        
        {data?.popular_books?.length > 0 ? (
          <BooksGrid>
            {data.popular_books.map((book, index) => (
              <BookCard key={index}>
                <h3>{book.title}</h3>
                <div className="count">{book.borrow_count} emprunts</div>
                <div className="description">
                  Populaire parmi les étudiants
                </div>
              </BookCard>
            ))}
          </BooksGrid>
        ) : (
          <div className="text--center text--muted">
            Aucune donnée disponible pour le moment
          </div>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h2>Recommandations</h2>
        </SectionHeader>
        
        <div className="text--center text--muted">
          <FiTrendingUp size={48} />
          <p className="mt-3">
            Nos recommandations personnalisées seront bientôt disponibles !
          </p>
          <p>En attendant, explorez notre catalogue pour découvrir de nouveaux livres.</p>
        </div>
      </Section>
    </DashboardContainer>
  );
};

export default DashboardStudent;