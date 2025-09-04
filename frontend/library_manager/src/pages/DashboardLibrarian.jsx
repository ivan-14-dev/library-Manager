import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiBook, FiUsers, FiAlertTriangle, FiClock, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
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

  &.success {
    background: #d4edda;
    border: 1px solid #c3e6cb;

    .icon {
      color: #28a745;
    }
  }

  &.warning {
    background: #fff3cd;
    border: 1px solid #ffeaa7;

    .icon {
      color: #ffc107;
    }
  }

  &.danger {
    background: #f8d7da;
    border: 1px solid #f5c6cb;

    .icon {
      color: #dc3545;
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

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #667eea;
  }

  h3 {
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6c757d;
    font-size: 0.9rem;
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

const DashboardLibrarian = () => {
  const { data, isLoading, error } = useQuery(
    'librarian-dashboard',
    () => reportsAPI.getLibrarianDashboard(),
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
          <p>{error.message || "Une erreur est survenue"}</p>
        </Error>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer className="container">
      <DashboardHeader>
        <h1>Tableau de Bord Bibliothécaire</h1>
        <p>Gérez la bibliothèque et suivez les activités</p>
      </DashboardHeader>

      <StatsGrid>
        <StatCard className="primary">
          <div className="icon">
            <FiBook />
          </div>
          <div className="number">{data?.stats?.total_books || 0}</div>
          <div className="label">Livres total</div>
        </StatCard>

        <StatCard className="success">
          <div className="icon">
            <FiBook />
          </div>
          <div className="number">{data?.stats?.available_books || 0}</div>
          <div className="label">Livres disponibles</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiUsers />
          </div>
          <div className="number">{data?.stats?.active_users || 0}</div>
          <div className="label">Utilisateurs actifs</div>
        </StatCard>

        <StatCard className="warning">
          <div className="icon">
            <FiClock />
          </div>
          <div className="number">{data?.stats?.current_borrows || 0}</div>
          <div className="label">Emprunts en cours</div>
        </StatCard>

        <StatCard className="danger">
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
          <div className="number">{data?.stats?.pending_reservations || 0}</div>
          <div className="label">Réservations</div>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <h2>Actions Rapides</h2>
        </SectionHeader>
        
        <QuickActions>
          <ActionCard>
            <div className="icon">
              <FiBook />
            </div>
            <h3>Ajouter un livre</h3>
            <p>Ajouter un nouveau livre au catalogue</p>
          </ActionCard>

          <ActionCard>
            <div className="icon">
              <FiUsers />
            </div>
            <h3>Gérer les emprunts</h3>
            <p>Voir et gérer les emprunts en cours</p>
          </ActionCard>

          <ActionCard>
            <div className="icon">
              <FiClock />
            </div>
            <h3>Réservations</h3>
            <p>Gérer les réservations en attente</p>
          </ActionCard>

          <ActionCard>
            <div className="icon">
              <FiAlertTriangle />
            </div>
            <h3>Retards</h3>
            <p>Voir les retards et envoyer des rappels</p>
          </ActionCard>
        </QuickActions>
      </Section>

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
                <p>Ce mois-ci</p>
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
          <h2>Statistiques Mensuelles</h2>
        </SectionHeader>
        
        <div className="text--center">
          <FiTrendingUp size={48} color="#6c757d" />
          <p className="mt-3 text--muted">
            Les graphiques détaillés et statistiques avancées seront bientôt disponibles !
          </p>
        </div>
      </Section>
    </DashboardContainer>
  );
};

export default DashboardLibrarian;