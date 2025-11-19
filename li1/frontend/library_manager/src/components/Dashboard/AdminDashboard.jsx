// src/components/dashboard/AdminDashboard.jsx
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
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import styled from 'styled-components';

/**
 * Dashboard Administrateur - Interface complète de gestion avec onglets
 * Accès à toutes les fonctionnalités système et analytiques
 */
const AdminDashboard = () => {
  const { dashboardData, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // États de chargement et d'erreur
  if (loading) return <LoadingState>Chargement des données administrateur...</LoadingState>;
  if (error) return <ErrorState>Erreur: {error}</ErrorState>;

  const { stats, recentActivities, systemHealth, financialOverview, pendingApprovals } = dashboardData;

  /**
   * Gestion de la création d'un nouvel utilisateur
   * @param {Object} userData - Données du formulaire utilisateur
   */
  const handleCreateUser = async (userData) => {
    try {
      // API CALL: Création d'utilisateur
      // await usersAPI.createUser(userData);
      console.log('Utilisateur créé:', userData);
      setShowUserModal(false);
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
    }
  };

  /**
   * Gestion de l'ajout d'un nouveau livre
   * @param {Object} bookData - Données du formulaire livre
   */
  const handleCreateBook = async (bookData) => {
    try {
      // API CALL: Création de livre
      // await booksAPI.create(bookData);
      console.log('Livre créé:', bookData);
      setShowBookModal(false);
    } catch (error) {
      console.error('Erreur création livre:', error);
    }
  };

  return (
    <DashboardContainer>
      {/* En-tête avec navigation et boutons d'action */}
      <DashboardHeader>
        <DashboardTitle>Dashboard Administrateur</DashboardTitle>
        <ActionButtons>
          <Button 
            variant="success"
            onClick={() => setShowUserModal(true)}
          >
            👤 Nouvel Utilisateur
          </Button>
          <Button 
            variant="primary"
            onClick={() => setShowBookModal(true)}
          >
            📚 Nouveau Livre
          </Button>
        </ActionButtons>
      </DashboardHeader>

      {/* Navigation par onglets stylisée */}
      <TabNavigation>
        {tabsConfig.map((tab) => (
          <TabButton
            key={tab.id}
            $isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </TabButton>
        ))}
      </TabNavigation>

      {/* Contenu conditionnel selon l'onglet actif */}
      <TabContent>
        {activeTab === 'overview' && (
          <OverviewTab 
            stats={stats}
            recentActivities={recentActivities}
            systemHealth={systemHealth}
            financialOverview={financialOverview}
          />
        )}

        {activeTab === 'financial' && financialOverview && (
          <FinancialTab financialOverview={financialOverview} />
        )}

        {activeTab === 'system' && systemHealth && (
          <SystemTab systemHealth={systemHealth} />
        )}
      </TabContent>

      {/* Modals pour création utilisateur/livre */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Créer un Nouvel Utilisateur"
      >
        <UserForm onSubmit={handleCreateUser} />
      </Modal>

      <Modal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        title="Ajouter un Nouveau Livre"
      >
        <BookForm onSubmit={handleCreateBook} />
      </Modal>
    </DashboardContainer>
  );
};

// Configuration des onglets
const tabsConfig = [
  { id: 'overview', label: 'Aperçu Général', icon: '📊' },
  { id: 'users', label: 'Utilisateurs', icon: '👥' },
  { id: 'books', label: 'Livres', icon: '📚' },
  { id: 'financial', label: 'Finances', icon: '💰' },
  { id: 'system', label: 'Système', icon: '⚙️' },
];

// Composant pour l'onglet Aperçu
const OverviewTab = ({ stats, recentActivities, systemHealth, financialOverview }) => (
  <>
    <StatsGrid>
      <StatCard
        title="Utilisateurs Actifs"
        value={stats?.totalViews || 0}
        icon="👥"
        trend="up"
        trendValue="12%"
        color="green"
      />
      <StatCard
        title="Revenus Mensuels"
        value={`${financialOverview?.monthlyRevenue || 0}€`}
        icon="💰"
        trend="up"
        trendValue="8%"
        color="blue"
      />
      <StatCard
        title="Approbations en Attente"
        value={pendingApprovals || 0}
        icon="⏳"
        trend="down"
        trendValue="5%"
        color="orange"
      />
      <StatCard
        title="Stockage Utilisé"
        value={systemHealth?.storage || '0%'}
        icon="💾"
        color="purple"
      />
    </StatsGrid>

    <TwoColumnGrid>
      {/* Activités Récentes */}
      <ContentCard>
        <CardTitle>Activités Récentes</CardTitle>
        <ActivityList>
          {recentActivities?.map(activity => (
            <ActivityItem key={activity.id}>
              <ActivityContent>
                <ActivityAction>{activity.action}</ActivityAction>
                <ActivityUser>par {activity.user}</ActivityUser>
              </ActivityContent>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityItem>
          ))}
        </ActivityList>
      </ContentCard>

      {/* Santé du Système */}
      <ContentCard>
        <CardTitle>Santé du Système</CardTitle>
        <SystemHealthList>
          {systemHealth && Object.entries(systemHealth).map(([key, value]) => (
            <SystemHealthItem key={key}>
              <SystemHealthLabel>{formatSystemLabel(key)}</SystemHealthLabel>
              <SystemHealthValue $status={getSystemStatus(value)}>
                {value}
              </SystemHealthValue>
            </SystemHealthItem>
          ))}
        </SystemHealthList>
      </ContentCard>
    </TwoColumnGrid>
  </>
);

// Composant pour l'onglet Finances
const FinancialTab = ({ financialOverview }) => (
  <StatsGrid>
    <StatCard
      title="Abonnements Actifs"
      value={financialOverview.activeSubscriptions}
      icon="📋"
      color="green"
    />
    <StatCard
      title="Paiements en Attente"
      value={`${financialOverview.pendingPayouts}€`}
      icon="⏳"
      color="orange"
    />
    <StatCard
      title="Revenu Mensuel"
      value={`${financialOverview.monthlyRevenue}€`}
      icon="💰"
      color="blue"
    />
    <StatCard
      title="Croissance"
      value="+8.2%"
      icon="📈"
      trend="up"
      trendValue="8.2%"
      color="green"
    />
  </StatsGrid>
);

// Composant pour l'onglet Système
const SystemTab = ({ systemHealth }) => (
  <ContentCard>
    <CardTitle>État du Système</CardTitle>
    <SystemGrid>
      {systemHealth && Object.entries(systemHealth).map(([key, value]) => (
        <SystemMetric key={key}>
          <SystemMetricIcon $status={getSystemStatus(value)}>
            {getSystemIcon(key)}
          </SystemMetricIcon>
          <SystemMetricInfo>
            <SystemMetricLabel>{formatSystemLabel(key)}</SystemMetricLabel>
            <SystemMetricValue $status={getSystemStatus(value)}>
              {value}
            </SystemMetricValue>
          </SystemMetricInfo>
        </SystemMetric>
      ))}
    </SystemGrid>
  </ContentCard>
);

// Composants de style spécifiques
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
  }
`;

const TabNavigation = styled.nav`
  display: flex;
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: ${props => props.theme.shadows.sm};
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? props.theme.colors.white : props.theme.colors.gray[600]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.gray[100]};
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 1rem;
`;

const ActivityList = styled.div`
  space-y: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityAction = styled.p`
  font-weight: 500;
  color: ${props => props.theme.colors.gray[800]};
`;

const ActivityUser = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const ActivityTime = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const SystemHealthList = styled.div`
  space-y: 1rem;
`;

const SystemHealthItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const SystemHealthLabel = styled.span`
  color: ${props => props.theme.colors.gray[700]};
  text-transform: capitalize;
`;

const SystemHealthValue = styled.span`
  font-weight: 600;
  color: ${props => {
    switch (props.$status) {
      case 'healthy': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'critical': return props.theme.colors.error;
      default: return props.theme.colors.gray[600];
    }
  }};
`;

const SystemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const SystemMetric = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.gray[50]};
  border-radius: 8px;
`;

const SystemMetricIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$status) {
      case 'healthy': return props.theme.colors.success + '20';
      case 'warning': return props.theme.colors.warning + '20';
      case 'critical': return props.theme.colors.error + '20';
      default: return props.theme.colors.gray[200];
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'healthy': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'critical': return props.theme.colors.error;
      default: return props.theme.colors.gray[600];
    }
  }};
  font-size: 1.25rem;
`;

const SystemMetricInfo = styled.div`
  flex: 1;
`;

const SystemMetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
  text-transform: capitalize;
`;

const SystemMetricValue = styled.div`
  font-weight: 600;
  color: ${props => {
    switch (props.$status) {
      case 'healthy': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'critical': return props.theme.colors.error;
      default: return props.theme.colors.gray[800];
    }
  }};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1.125rem;
`;

const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: ${props => props.theme.colors.error};
  font-size: 1.125rem;
  background: ${props => props.theme.colors.error + '10'};
  border-radius: 12px;
  padding: 2rem;
`;

// Fonctions utilitaires
const getSystemStatus = (value) => {
  if (value === 'Optimal' || value === 'Stable') return 'healthy';
  if (value.includes('%') && parseInt(value) > 80) return 'critical';
  if (value.includes('%') && parseInt(value) > 60) return 'warning';
  return 'healthy';
};

const getSystemIcon = (key) => {
  const icons = {
    database: '🗄️',
    api: '🔌',
    storage: '💾',
    cache: '⚡',
    network: '🌐'
  };
  return icons[key] || '⚙️';
};

const formatSystemLabel = (key) => {
  const labels = {
    database: 'Base de données',
    api: 'API',
    storage: 'Stockage',
    cache: 'Cache',
    network: 'Réseau'
  };
  return labels[key] || key;
};

export default AdminDashboard;