// src/components/dashboard/LibrarianDashboard.jsx
import React, { useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { 
  DashboardContainer, 
  DashboardHeader, 
  DashboardTitle, 
  StatsGrid,
  ContentCard,
  TwoColumnGrid,
  Button 
} from '../common/StyledComponents';
import StatCard from '../common/StatCard';
import styled from 'styled-components';

/**
 * Dashboard Bibliothécaire - Gestion du catalogue et des emprunts
 */
const LibrarianDashboard = () => {
  const { dashboardData, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState('catalog');

  if (loading) return <LoadingState>Chargement du dashboard bibliothécaire...</LoadingState>;
  if (error) return <ErrorState>Erreur: {error}</ErrorState>;

  const { stats, recentBooks, borrowStats, pendingApprovals } = dashboardData;

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Espace Bibliothécaire</DashboardTitle>
        <ActionButtons>
          <Button variant="primary">
            📚 Gérer le Catalogue
          </Button>
          <Button variant="success">
            👥 Gérer les Utilisateurs
          </Button>
        </ActionButtons>
      </DashboardHeader>

      <TabNavigation>
        {['catalog', 'borrows', 'reservations', 'reports'].map((tab) => (
          <TabButton
            key={tab}
            $isActive={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {getTabIcon(tab)} {getTabLabel(tab)}
          </TabButton>
        ))}
      </TabNavigation>

      <TabContent>
        {activeTab === 'catalog' && (
          <CatalogTab 
            recentBooks={recentBooks}
            pendingApprovals={pendingApprovals}
          />
        )}

        {activeTab === 'borrows' && (
          <BorrowsTab borrowStats={borrowStats} />
        )}
      </TabContent>
    </DashboardContainer>
  );
};

const CatalogTab = ({ recentBooks, pendingApprovals }) => (
  <>
    <StatsGrid>
      <StatCard
        title="Livres au Catalogue"
        value="1,245"
        icon="📚"
        color="blue"
      />
      <StatCard
        title="En Attente de Validation"
        value={pendingApprovals || 0}
        icon="⏳"
        color="orange"
      />
      <StatCard
        title="Nouveaux cette Semaine"
        value="23"
        icon="🆕"
        color="green"
      />
      <StatCard
        title="Livres Numériques"
        value="567"
        icon="💻"
        color="purple"
      />
    </StatsGrid>

    <TwoColumnGrid>
      <ContentCard>
        <CardTitle>Livres Récemment Ajoutés</CardTitle>
        <BookList>
          {recentBooks?.map(book => (
            <BookItem key={book.id}>
              <BookInfo>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor>par {book.author}</BookAuthor>
              </BookInfo>
              <BookStatus $status={book.status}>
                {book.status}
              </BookStatus>
            </BookItem>
          ))}
        </BookList>
      </ContentCard>

      <ContentCard>
        <CardTitle>Actions Rapides</CardTitle>
        <QuickActions>
          <QuickActionButton>
            <ActionIcon>➕</ActionIcon>
            <ActionText>Ajouter un Livre</ActionText>
          </QuickActionButton>
          <QuickActionButton>
            <ActionIcon>📋</ActionIcon>
            <ActionText>Importer en Lot</ActionText>
          </QuickActionButton>
          <QuickActionButton>
            <ActionIcon>🔍</ActionIcon>
            <ActionText>Vérifier Stock</ActionText>
          </QuickActionButton>
          <QuickActionButton>
            <ActionIcon>📊</ActionIcon>
            <ActionText>Rapports</ActionText>
          </QuickActionButton>
        </QuickActions>
      </ContentCard>
    </TwoColumnGrid>
  </>
);

// Styles spécifiques au dashboard bibliothécaire
const BookList = styled.div`
  space-y: 1rem;
`;

const BookItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.gray[800]};
`;

const BookAuthor = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
  margin-top: 0.25rem;
`;

const BookStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'Disponible': return props.theme.colors.success + '20';
      case 'Emprunté': return props.theme.colors.warning + '20';
      case 'Réservé': return props.theme.colors.primary + '20';
      default: return props.theme.colors.gray[200];
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'Disponible': return props.theme.colors.success;
      case 'Emprunté': return props.theme.colors.warning;
      case 'Réservé': return props.theme.colors.primary;
      default: return props.theme.colors.gray[600];
    }
  }};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const QuickActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '10'};
  }
`;

const ActionIcon = styled.div`
  font-size: 1.5rem;
`;

const ActionText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
  text-align: center;
`;

// Fonctions utilitaires
const getTabIcon = (tab) => {
  const icons = {
    catalog: '📚',
    borrows: '📖',
    reservations: '⏰',
    reports: '📊'
  };
  return icons[tab] || '📁';
};

const getTabLabel = (tab) => {
  const labels = {
    catalog: 'Catalogue',
    borrows: 'Emprunts',
    reservations: 'Réservations',
    reports: 'Rapports'
  };
  return labels[tab] || tab;
};

export default LibrarianDashboard;