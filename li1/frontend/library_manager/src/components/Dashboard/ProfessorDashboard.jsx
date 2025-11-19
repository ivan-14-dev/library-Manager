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
import AIEditor from '../ai/AIEditor';
import styled from 'styled-components';

/**
 * Dashboard Professeur/Chercheur - Gestion des publications et recherche
 */
const ProfessorDashboard = () => {
  const { dashboardData, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState('research');
  const [showAIEditor, setShowAIEditor] = useState(false);

  if (loading) return <LoadingState>Chargement de votre espace professeur...</LoadingState>;
  if (error) return <ErrorState>Erreur: {error}</ErrorState>;

  const { stats, myPublications, researchAnalytics, teachingMaterials } = dashboardData;

  const handlePublish = async (publicationData) => {
    try {
      // API CALL: Publication
      console.log('Publication créée:', publicationData);
      setShowAIEditor(false);
    } catch (error) {
      console.error('Erreur publication:', error);
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderContent>
          <DashboardTitle>Espace Professeur/Chercheur</DashboardTitle>
          <WelcomeMessage>
            Développez et partagez vos connaissances académiques 🎓
          </WelcomeMessage>
        </HeaderContent>
        <ActionButtons>
          <Button 
            variant="primary"
            onClick={() => setShowAIEditor(true)}
          >
            🧠 Éditeur IA
          </Button>
          <Button variant="success">
            📄 Nouvelle Publication
          </Button>
        </ActionButtons>
      </DashboardHeader>

      <TabNavigation>
        {professorTabs.map((tab) => (
          <TabButton
            key={tab.id}
            $isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </TabButton>
        ))}
      </TabNavigation>

      <TabContent>
        {activeTab === 'research' && (
          <ResearchTab 
            myPublications={myPublications}
            researchAnalytics={researchAnalytics}
          />
        )}

        {activeTab === 'teaching' && (
          <TeachingTab teachingMaterials={teachingMaterials} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab researchAnalytics={researchAnalytics} />
        )}
      </TabContent>

      {showAIEditor && (
        <AIEditor
          onClose={() => setShowAIEditor(false)}
          onSave={handlePublish}
        />
      )}
    </DashboardContainer>
  );
};

// Onglets professeur
const professorTabs = [
  { id: 'research', label: 'Recherche', icon: '🔬' },
  { id: 'teaching', label: 'Enseignement', icon: '📚' },
  { id: 'publications', label: 'Publications', icon: '📄' },
  { id: 'analytics', label: 'Analytiques', icon: '📊' },
  { id: 'collaborations', label: 'Collaborations', icon: '🤝' },
];

// Composant Onglet Recherche
const ResearchTab = ({ myPublications, researchAnalytics }) => (
  <>
    <StatsGrid>
      <StatCard
        title="Citations Total"
        value={researchAnalytics?.citations || 0}
        icon="📈"
        trend="up"
        trendValue="12%"
        color="blue"
      />
      <StatCard
        title="Lectures Mensuelles"
        value={researchAnalytics?.reads || 0}
        icon="👁️"
        color="green"
      />
      <StatCard
        title="Collaborations Actives"
        value={researchAnalytics?.collaborations || 0}
        icon="🤝"
        color="purple"
      />
      <StatCard
        title="Facteur d'Impact"
        value="3.2"
        icon="⭐"
        color="orange"
      />
    </StatsGrid>

    <TwoColumnGrid>
      <ContentCard>
        <CardHeader>
          <CardTitle>Mes Publications Récentes</CardTitle>
          <Button size="small" variant="primary">
            Toutes les publications
          </Button>
        </CardHeader>
        <PublicationsList>
          {myPublications?.map(pub => (
            <PublicationItem key={pub.id}>
              <PublicationIcon>📄</PublicationIcon>
              <PublicationInfo>
                <PublicationTitle>{pub.title}</PublicationTitle>
                <PublicationStats>
                  <Stat>👁️ {pub.views} vues</Stat>
                  <Stat>📥 {pub.downloads} téléch.</Stat>
                  <Stat>📚 {pub.citations} citations</Stat>
                </PublicationStats>
                <PublicationDate>Publié le {pub.publishDate}</PublicationDate>
              </PublicationInfo>
              <PublicationActions>
                <ActionButton>📊</ActionButton>
                <ActionButton>✏️</ActionButton>
                <ActionButton>🔗</ActionButton>
              </PublicationActions>
            </PublicationItem>
          ))}
        </PublicationsList>
      </ContentCard>

      <ContentCard>
        <CardHeader>
          <CardTitle>Outils de Recherche</CardTitle>
        </CardHeader>
        <ResearchTools>
          <ToolCard>
            <ToolIcon>🔍</ToolIcon>
            <ToolInfo>
              <ToolName>Recherche Avancée</ToolName>
              <ToolDescription>Accédez à la base de données académique</ToolDescription>
            </ToolInfo>
            <Button size="small">Ouvrir</Button>
          </ToolCard>
          <ToolCard>
            <ToolIcon>📚</ToolIcon>
            <ToolInfo>
              <ToolName>Gestion des Références</ToolName>
              <ToolDescription>Organisez vos sources bibliographiques</ToolDescription>
            </ToolInfo>
            <Button size="small">Ouvrir</Button>
          </ToolCard>
          <ToolCard>
            <ToolIcon>🤝</ToolIcon>
            <ToolInfo>
              <ToolName>Réseau de Collaboration</ToolName>
              <ToolDescription>Connectez-vous avec d'autres chercheurs</ToolDescription>
            </ToolInfo>
            <Button size="small">Explorer</Button>
          </ToolCard>
        </ResearchTools>
      </ContentCard>
    </TwoColumnGrid>
  </>
);

// Composant Onglet Enseignement
const TeachingTab = ({ teachingMaterials }) => (
  <ContentCard>
    <CardHeader>
      <CardTitle>Mes Matériels Pédagogiques</CardTitle>
      <Button variant="primary">
        + Nouveau Matériel
      </Button>
    </CardHeader>
    <MaterialsGrid>
      {teachingMaterials?.map(material => (
        <MaterialCard key={material.id}>
          <MaterialIcon>📖</MaterialIcon>
          <MaterialContent>
            <MaterialTitle>{material.title}</MaterialTitle>
            <MaterialStats>
              <Stat>👥 {material.students} étudiants</Stat>
              <Stat>🕒 {material.lastUpdate}</Stat>
            </MaterialStats>
            <MaterialActions>
              <Button size="small">Éditer</Button>
              <Button size="small" variant="secondary">
                Partager
              </Button>
            </MaterialActions>
          </MaterialContent>
        </MaterialCard>
      ))}
    </MaterialsGrid>
  </ContentCard>
);

// Composant Onglet Analytiques
const AnalyticsTab = ({ researchAnalytics }) => (
  <TwoColumnGrid>
    <ContentCard>
      <CardTitle>Performance des Publications</CardTitle>
      <AnalyticsChart>
        {/* Placeholder pour graphique */}
        <ChartPlaceholder>
          <ChartIcon>📊</ChartIcon>
          <ChartText>Graphique de performance</ChartText>
          <ChartSubtext>Vues, téléchargements et citations</ChartSubtext>
        </ChartPlaceholder>
      </AnalyticsChart>
    </ContentCard>

    <ContentCard>
      <CardTitle>Métriques Clés</CardTitle>
      <MetricsList>
        <MetricItem>
          <MetricLabel>Taux d'Engagement</MetricLabel>
          <MetricValue>68%</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Durée Moyenne de Lecture</MetricLabel>
          <MetricValue>12.4 min</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Partage Social</MetricLabel>
          <MetricValue>45</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Retour des Étudiants</MetricLabel>
          <MetricValue>4.8/5</MetricValue>
        </MetricItem>
      </MetricsList>
    </ContentCard>
  </TwoColumnGrid>
);

// Styles spécifiques au dashboard professeur
const ResearchTools = styled.div`
  space-y: 1rem;
`;

const ToolCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const ToolIcon = styled.div`
  font-size: 2rem;
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.25rem;
`;

const ToolDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const PublicationsList = styled.div`
  space-y: 1.5rem;
`;

const PublicationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const PublicationIcon = styled.div`
  font-size: 2rem;
  margin-top: 0.25rem;
`;

const PublicationInfo = styled.div`
  flex: 1;
`;

const PublicationTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
`;

const PublicationStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const Stat = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const PublicationDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const PublicationActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 6px;
  background: ${props => props.theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const MaterialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const MaterialCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const MaterialIcon = styled.div`
  font-size: 2rem;
  margin-top: 0.25rem;
`;

const MaterialContent = styled.div`
  flex: 1;
`;

const MaterialTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.5rem;
`;

const MaterialStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MaterialActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AnalyticsChart = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.gray[500]};
`;

const ChartIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ChartText = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ChartSubtext = styled.div`
  font-size: 0.875rem;
`;

const MetricsList = styled.div`
  space-y: 1.5rem;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.div`
  color: ${props => props.theme.colors.gray[700]};
`;

const MetricValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  font-size: 1.125rem;
`;

export default ProfessorDashboard;