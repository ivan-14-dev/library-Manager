import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiBook, FiUsers, FiAlertTriangle, FiClock, FiBarChart2, FiDollarSign } from 'react-icons/fi';
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

const AdminSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const RoleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const RoleStat = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;

  .count {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 0.5rem;
  }

  .role {
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

const DashboardAdmin = () => {
  const { data, isLoading, error } = useQuery(
    'admin-dashboard',
    () => reportsAPI.getAdminDashboard(),
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

  const getRoleDisplay = (role) => {
    const roleMap = {
      'STUDENT': 'Étudiants',
      'PROFESSOR': 'Professeurs',
      'LIBRARIAN': 'Bibliothécaires',
      'ADMIN': 'Administrateurs',
      'VISITOR': 'Visiteurs'
    };
    return roleMap[role] || role;
  };

  return (
    <DashboardContainer className="container">
      <DashboardHeader>
        <h1>Tableau de Bord Administrateur</h1>
        <p>Supervisez l'ensemble du système de bibliothèque</p>
      </DashboardHeader>

      <StatsGrid>
        <StatCard className="primary">
          <div className="icon">
            <FiUsers />
          </div>
          <div className="number">{data?.admin_stats?.total_users || 0}</div>
          <div className="label">Utilisateurs total</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiUsers />
          </div>
          <div className="number">{data?.admin_stats?.new_users_this_month || 0}</div>
          <div className="label">Nouveaux utilisateurs</div>
        </StatCard>

        <StatCard className="success">
          <div className="icon">
            <FiBook />
          </div>
          <div className="number">{data?.stats?.total_books || 0}</div>
          <div className="label">Livres total</div>
        </StatCard>

        <StatCard>
          <div className="icon">
            <FiClock />
          </div>
          <div className="number">{data?.stats?.current_borrows || 0}</div>
          <div className="label">Emprunts en cours</div>
        </StatCard>

        <StatCard className="warning">
          <div className="icon">
            <FiAlertTriangle />
          </div>
          <div className="number">{data?.stats?.overdue_borrows || 0}</div>
          <div className="label">Retards</div>
        </StatCard>

        <StatCard className="danger">
          <div className="icon">
            <FiDollarSign />
          </div>
          <div className="number">{data?.admin_stats?.fine_revenue || 0}€</div>
          <div className="label">Revenus des amendes</div>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <h2>Répartition des Utilisateurs</h2>
        </SectionHeader>
        
        <AdminSection>
          <h3>Par rôle</h3>
          <RoleStats>
            {data?.admin_stats?.users_by_role?.map((roleStat, index) => (
              <RoleStat key={index}>
                <div className="count">{roleStat.count}</div>
                <div className="role">{getRoleDisplay(roleStat.role)}</div>
              </RoleStat>
            ))}
          </RoleStats>
        </AdminSection>
      </Section>

      <Section>
        <SectionHeader>
          <h2>Statistiques de la Bibliothèque</h2>
        </SectionHeader>
        
        <div className="grid grid--2">
          <AdminSection>
            <h3>
              <FiBook /> Collection
            </h3>
            <div className="mt-3">
              <p><strong>Total:</strong> {data?.stats?.total_books || 0} livres</p>
              <p><strong>Disponibles:</strong> {data?.stats?.available_books || 0}</p>
              <p><strong>Empruntés:</strong> {data?.stats?.borrowed_books || 0}</p>
              <p><strong>Réservés:</strong> {data?.stats?.reserved_books || 0}</p>
            </div>
          </AdminSection>

          <AdminSection>
            <h3>
              <FiUsers /> Activité
            </h3>
            <div className="mt-3">
              <p><strong>Utilisateurs actifs:</strong> {data?.stats?.active_users || 0}</p>
              <p><strong>Emprunts ce mois:</strong> {data?.stats?.current_borrows || 0}</p>
              <p><strong>Retards:</strong> {data?.stats?.overdue_borrows || 0}</p>
              <p><strong>Réservations:</strong> {data?.stats?.pending_reservations || 0}</p>
            </div>
          </AdminSection>
        </div>
      </Section>

      <Section>
        <SectionHeader>
          <h2>Outils d'Administration</h2>
        </SectionHeader>
        
        <div className="grid grid--2">
          <AdminSection>
            <h3>Gestion des Utilisateurs</h3>
            <div className="mt-3">
              <button className="btn btn--primary mb-2">
                Voir tous les utilisateurs
              </button>
              <button className="btn btn--secondary mb-2">
                Créer un nouvel utilisateur
              </button>
              <button className="btn btn--outline">
                Exporter les données
              </button>
            </div>
          </AdminSection>

          <AdminSection>
            <h3>Maintenance Système</h3>
            <div className="mt-3">
              <button className="btn btn--primary mb-2">
                Sauvegarder la base de données
              </button>
              <button className="btn btn--secondary mb-2">
                Voir les logs système
              </button>
              <button className="btn btn--outline">
                Paramètres avancés
              </button>
            </div>
          </AdminSection>
        </div>
      </Section>
    </DashboardContainer>
  );
};

export default DashboardAdmin;