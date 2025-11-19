// src/components/dashboard/StudentDashboard.jsx
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
import styled from 'styled-components';

/**
 * Dashboard Étudiant - Espace d'apprentissage et de gestion des emprunts
 */
const StudentDashboard = () => {
  const { dashboardData, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <LoadingState>Chargement de votre espace étudiant...</LoadingState>;
  if (error) return <ErrorState>Erreur: {error}</ErrorState>;

  const { stats, currentBorrows, recommendedBooks, studyGroups } = dashboardData;

  return (
    <DashboardContainer>
      {/* En-tête personnalisé étudiant */}
      <DashboardHeader>
        <HeaderContent>
          <DashboardTitle>Mon Espace Étudiant</DashboardTitle>
          <WelcomeMessage>
            Bon retour, Préparez-vous pour une nouvelle session d'apprentissage ! 📖
          </WelcomeMessage>
        </HeaderContent>
        <ActionButtons>
          <Button variant="primary">
            Rechercher un Livre
          </Button>
          <Button variant="success">
            Voir le Catalogue
          </Button>
        </ActionButtons>
      </DashboardHeader>

      {/* Navigation onglets étudiant */}
      <TabNavigation>
        {studentTabs.map((tab) => (
          <TabButton
            key={tab.id}
            $isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </TabButton>
        ))}
      </TabNavigation>

      {/* Contenu des onglets */}
      <TabContent>
        {activeTab === 'overview' && (
          <OverviewTab 
            stats={stats}
            currentBorrows={currentBorrows}
            recommendedBooks={recommendedBooks}
            studyGroups={studyGroups}
          />
        )}

        {activeTab === 'borrows' && (
          <BorrowsTab currentBorrows={currentBorrows} />
        )}

        {activeTab === 'groups' && (
          <GroupsTab studyGroups={studyGroups} />
        )}
      </TabContent>
    </DashboardContainer>
  );
};

// Onglets spécifiques à l'étudiant
const studentTabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: '' },
  { id: 'borrows', label: 'Mes Emprunts', icon: '' },
  { id: 'groups', label: 'Groupes d\'Étude', icon: '' },
  { id: 'resources', label: 'Ressources', icon: '' },
  { id: 'progress', label: 'Progression', icon: '' },
];

// Composant Onglet Vue d'ensemble
const OverviewTab = ({ stats, currentBorrows, recommendedBooks, studyGroups }) => (
  <>
    {/* Statistiques personnelles */}
    <StatsGrid>
      <StatCard
        title="Livres Empruntés"
        value={currentBorrows?.length || 0}
        icon=""
        color="blue"
      />
      <StatCard
        title="Jours d'Abonnement"
        value="45"
        icon="⏰"
        color="green"
      />
      <StatCard
        title="Notes Sauvegardées"
        value="23"
        icon="📝"
        color="purple"
      />
      <StatCard
        title="Heures de Lecture"
        value="156h"
        icon="⏱️"
        color="orange"
      />
    </StatsGrid>

    <TwoColumnGrid>
      {/* Emprunts en cours */}
      <ContentCard>
        <CardHeader>
          <CardTitle>Mes Emprunts en Cours</CardTitle>
          <Button size="small" variant="secondary">
            Voir tout
          </Button>
        </CardHeader>
        <BorrowList>
          {currentBorrows?.length > 0 ? (
            currentBorrows.map(borrow => (
              <BorrowItem key={borrow.id}>
                <BookCover>📘</BookCover>
                <BorrowInfo>
                  <BookTitle>{borrow.title}</BookTitle>
                  <DueDate>À rendre le: {borrow.dueDate}</DueDate>
                </BorrowInfo>
                <BorrowStatus $urgent={isDueSoon(borrow.dueDate)}>
                  {isDueSoon(borrow.dueDate) ? '⚠️ Bientôt dû' : '🟢 En cours'}
                </BorrowStatus>
              </BorrowItem>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📚</EmptyIcon>
              <EmptyText>Aucun emprunt en cours</EmptyText>
              <EmptySubtext>Explorez le catalogue pour trouver votre prochaine lecture</EmptySubtext>
            </EmptyState>
          )}
        </BorrowList>
      </ContentCard>

      {/* Livres recommandés */}
      <ContentCard>
        <CardHeader>
          <CardTitle>Recommandés pour vous</CardTitle>
          <Button size="small" variant="secondary">
            Plus de suggestions
          </Button>
        </CardHeader>
        <RecommendedList>
          {recommendedBooks?.map(book => (
            <RecommendedItem key={book.id}>
              <BookCover>📗</BookCover>
              <BookInfo>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor>{book.author}</BookAuthor>
                <BookSubjects>
                  {book.subjects?.map((subject, idx) => (
                    <SubjectTag key={idx}>{subject}</SubjectTag>
                  ))}
                </BookSubjects>
              </BookInfo>
              <BorrowButton size="small">
                Emprunter
              </BorrowButton>
            </RecommendedItem>
          ))}
        </RecommendedList>
      </ContentCard>
    </TwoColumnGrid>

    {/* Groupes d'étude */}
    <ContentCard>
      <CardHeader>
        <CardTitle>Mes Groupes d'Étude</CardTitle>
        <Button size="small" variant="primary">
          Rejoindre un groupe
        </Button>
      </CardHeader>
      <StudyGroupsGrid>
        {studyGroups?.map(group => (
          <StudyGroupCard key={group.id}>
            <GroupIcon>👥</GroupIcon>
            <GroupInfo>
              <GroupName>{group.name}</GroupName>
              <GroupDetails>
                <GroupMemberCount>{group.members} membres</GroupMemberCount>
                <GroupActivity>Actif {group.lastActivity}</GroupActivity>
              </GroupDetails>
            </GroupInfo>
            <GroupAction>
              <Button size="small" variant="secondary">
                Ouvrir
              </Button>
            </GroupAction>
          </StudyGroupCard>
        ))}
      </StudyGroupsGrid>
    </ContentCard>
  </>
);

// Composant Onglet Emprunts
const BorrowsTab = ({ currentBorrows }) => (
  <ContentCard>
    <CardHeader>
      <CardTitle>Historique des Emprunts</CardTitle>
      <Button variant="primary">
        Nouvel Emprunt
      </Button>
    </CardHeader>
    <DataTable
      columns={[
        { key: 'title', label: 'Livre', sortable: true },
        { key: 'borrowDate', label: 'Date d\'emprunt', sortable: true },
        { key: 'dueDate', label: 'Date de retour', sortable: true },
        { key: 'status', label: 'Statut', sortable: true }
      ]}
      data={currentBorrows || []}
      renderRow={(item) => (
        <TableRow>
          <TableCell>
            <BookInfoCompact>
              <BookCoverSmall>📘</BookCoverSmall>
              <div>
                <BookTitleSmall>{item.title}</BookTitleSmall>
                <BookAuthorSmall>Par {item.author}</BookAuthorSmall>
              </div>
            </BookInfoCompact>
          </TableCell>
          <TableCell>{item.borrowDate}</TableCell>
          <TableCell>
            <DueDateCell $urgent={isDueSoon(item.dueDate)}>
              {item.dueDate}
            </DueDateCell>
          </TableCell>
          <TableCell>
            <StatusBadge $status={getBorrowStatus(item)}>
              {getBorrowStatus(item)}
            </StatusBadge>
          </TableCell>
        </TableRow>
      )}
    />
  </ContentCard>
);

// Composant Onglet Groupes
const GroupsTab = ({ studyGroups }) => (
  <TwoColumnGrid>
    <ContentCard>
      <CardTitle>Mes Groupes Actifs</CardTitle>
      <GroupsList>
        {studyGroups?.map(group => (
          <GroupItem key={group.id}>
            <GroupAvatar>👥</GroupAvatar>
            <GroupContent>
              <GroupName>{group.name}</GroupName>
              <GroupDescription>
                Groupe d'étude pour {group.subject}
              </GroupDescription>
              <GroupStats>
                <Stat>{group.members} membres</Stat>
                <Stat>•</Stat>
                <Stat>Dernière activité: {group.lastActivity}</Stat>
              </GroupStats>
            </GroupContent>
            <GroupActions>
              <Button size="small">Rejoindre</Button>
            </GroupActions>
          </GroupItem>
        ))}
      </GroupsList>
    </ContentCard>

    <ContentCard>
      <CardTitle>Groupes Recommandés</CardTitle>
      <RecommendedGroups>
        <RecommendedGroup>
          <GroupIcon>🔬</GroupIcon>
          <GroupInfo>
            <GroupName>Science des Données</GroupName>
            <GroupMembers>124 membres</GroupMembers>
          </GroupInfo>
          <Button size="small" variant="success">
            Rejoindre
          </Button>
        </RecommendedGroup>
        <RecommendedGroup>
          <GroupIcon>💻</GroupIcon>
          <GroupInfo>
            <GroupName>Développement Web</GroupName>
            <GroupMembers>89 membres</GroupMembers>
          </GroupInfo>
          <Button size="small" variant="success">
            Rejoindre
          </Button>
        </RecommendedGroup>
      </RecommendedGroups>
    </ContentCard>
  </TwoColumnGrid>
);

// Styles spécifiques au dashboard étudiant
const HeaderContent = styled.div`
  flex: 1;
`;

const WelcomeMessage = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-top: 0.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BorrowList = styled.div`
  space-y: 1rem;
`;

const BorrowItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const BookCover = styled.div`
  font-size: 2rem;
`;

const BorrowInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.25rem;
`;

const DueDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const BorrowStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => 
    props.$urgent 
      ? props.theme.colors.warning + '20'
      : props.theme.colors.success + '20'
  };
  color: ${props => 
    props.$urgent 
      ? props.theme.colors.warning
      : props.theme.colors.success
  };
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.div`
  font-size: 0.875rem;
`;

const RecommendedList = styled.div`
  space-y: 1rem;
`;

const RecommendedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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

const BookAuthor = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const BookSubjects = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SubjectTag = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[700]};
  border-radius: 12px;
  font-size: 0.75rem;
`;

const BorrowButton = styled(Button)`
  white-space: nowrap;
`;

const StudyGroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const StudyGroupCard = styled.div`
  display: flex;
  align-items: center;
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

const GroupIcon = styled.div`
  font-size: 2rem;
`;

const GroupInfo = styled.div`
  flex: 1;
`;

const GroupName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.25rem;
`;

const GroupDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const GroupMemberCount = styled.span``;

const GroupActivity = styled.span``;

const GroupAction = styled.div``;

// Fonctions utilitaires
const isDueSoon = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

const getBorrowStatus = (borrow) => {
  if (isDueSoon(borrow.dueDate)) return 'Bientôt dû';
  return 'En cours';
};

export default StudentDashboard;