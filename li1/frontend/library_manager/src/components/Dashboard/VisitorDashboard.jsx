// src/components/dashboard/VisitorDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
import LoadingState from '../common/LoadingState';

/**
 * Dashboard Visiteur - Présentation + activités personnelles (téléchargements, publications)
 */
const VisitorDashboard = () => {
  const { user } = useAuth();
  const { dashboardData, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState('overview');

  // Gestion des états de chargement et d'erreur
  const ErrorState = styled.div`
    text-align: center;
    padding: 3rem;
    color: ${props => props.theme.colors.error};
    background: ${props => props.theme.colors.error + '10'};
    border-radius: 8px;
    margin: 2rem;
  `;

  if (loading) return <LoadingState>Chargement de votre espace...</LoadingState>;
  if (error) return <ErrorState>Erreur: {error}</ErrorState>;

  // Données sécurisées avec valeurs par défaut
  const safeData = dashboardData || {};
  const { 
    stats = {
      totalBooks: 0,
      availableBooks: 0,
      featuredBooks: 0,
      newArrivals: 0
    }, 
    featuredBooks = [], 
    popularCategories = [], 
    myDownloads = [], 
    myPublications = [] 
  } = safeData;

  return (
    <DashboardContainer>
      {/* En-tête personnalisé visiteur */}
      <DashboardHeader>
        <HeaderContent>
          <DashboardTitle>
            Bienvenue{user?.first_name ? `, ${user.first_name}` : ''} à la Bibliothèque Numérique
          </DashboardTitle>
          <WelcomeMessage>
            {user ? 
              "Découvrez de nouvelles ressources et gérez vos contenus personnels" :
              "Découvrez des milliers de ressources académiques et commencez votre voyage d'apprentissage"
            }
          </WelcomeMessage>
        </HeaderContent>
        <ActionButtons>
          {!user ? (
            <>
              <Button as={Link} to="/register" variant="primary">
                Créer un Compte
              </Button>
              <Button as={Link} to="/login" variant="secondary">
                Se Connecter
              </Button>
            </>
          ) : (
            <Button as={Link} to="/books" variant="primary">
              🔍 Explorer le Catalogue
            </Button>
          )}
        </ActionButtons>
      </DashboardHeader>

      {/* Navigation onglets visiteur */}
      <TabNavigation>
        {visitorTabs
          .filter(tab => tab.id !== 'my-content' || user) // Cache "Mon Contenu" si pas connecté
          .map((tab) => (
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
            featuredBooks={featuredBooks}
            popularCategories={popularCategories}
            myDownloads={myDownloads}
            myPublications={myPublications}
            hasAccount={!!user}
          />
        )}

        {activeTab === 'my-content' && user && (
          <MyContentTab 
            myDownloads={myDownloads}
            myPublications={myPublications}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverTab 
            featuredBooks={featuredBooks}
            popularCategories={popularCategories}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingTab />
        )}
      </TabContent>
    </DashboardContainer>
  );
};

// Onglets visiteur (adaptés selon connexion)
const visitorTabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'discover', label: 'Découvrir', icon: '🔍' },
  { id: 'my-content', label: 'Mon Contenu', icon: '📚' },
  { id: 'pricing', label: 'Abonnements', icon: '💰' },
];

// Composant Onglet Vue d'ensemble
const OverviewTab = ({ stats, featuredBooks, popularCategories, myDownloads, myPublications, hasAccount }) => (
  <>
    {/* Statistiques personnelles si connecté, sinon statistiques générales */}
    <StatsGrid>
      {hasAccount ? (
        <>
          <StatCard
            title="Mes Téléchargements"
            value={myDownloads?.length || 0}
            icon="📥"
            color="blue"
          />
          <StatCard
            title="Mes Publications"
            value={myPublications?.length || 0}
            icon="📄"
            color="green"
          />
          <StatCard
            title="Jours Restants"
            value="45"
            icon="⏰"
            color="orange"
          />
          <StatCard
            title="Favoris"
            value="12"
            icon="⭐"
            color="purple"
          />
        </>
      ) : (
        <>
          <StatCard
            title="Livres Disponibles"
            value={stats.totalBooks || "10,000+"}
            icon="📚"
            color="blue"
          />
          <StatCard
            title="Publications Académiques"
            value={stats.featuredBooks || "5,000+"}
            icon="📄"
            color="green"
          />
          <StatCard
            title="Membres Actifs"
            value="50,000+"
            icon="👥"
            color="orange"
          />
          <StatCard
            title="Nouveaux/mois"
            value={stats.newArrivals || "150+"}
            icon="🆕"
            color="purple"
          />
        </>
      )}
    </StatsGrid>

    <TwoColumnGrid>
      {/* Mes activités récentes si connecté */}
      {hasAccount && (
        <ContentCard>
          <CardHeader>
            <CardTitle>Mes Activités Récentes</CardTitle>
            <Button size="small" variant="secondary">
              Voir tout
            </Button>
          </CardHeader>
          <RecentActivities>
            {myDownloads && myDownloads.length > 0 ? (
              myDownloads.slice(0, 3).map(download => (
                <ActivityItem key={download.id}>
                  <ActivityIcon>📥</ActivityIcon>
                  <ActivityInfo>
                    <ActivityTitle>{download.title || 'Document téléchargé'}</ActivityTitle>
                    <ActivityDate>Téléchargé le {download.date || 'Date inconnue'}</ActivityDate>
                  </ActivityInfo>
                  <ActivityAction>
                    <Button size="small" variant="secondary">
                      Relire
                    </Button>
                  </ActivityAction>
                </ActivityItem>
              ))
            ) : (
              <EmptyState>
                <EmptyIcon>📚</EmptyIcon>
                <EmptyText>Aucune activité récente</EmptyText>
              </EmptyState>
            )}
          </RecentActivities>
        </ContentCard>
      )}

      {/* Livres recommandés */}
      <ContentCard>
        <CardHeader>
          <CardTitle>
            {hasAccount ? 'Recommandés pour vous' : 'Livres Populaires'}
          </CardTitle>
          <Button size="small" variant="secondary">
            Voir plus
          </Button>
        </CardHeader>
        <RecommendedList>
          {featuredBooks && featuredBooks.length > 0 ? (
            featuredBooks.slice(0, 3).map(book => (
              <RecommendedItem key={book.id}>
                <BookCover>📗</BookCover>
                <BookInfo>
                  <BookTitle>{book.title || 'Livre sans titre'}</BookTitle>
                  <BookAuthor>{book.author || 'Auteur inconnu'}</BookAuthor>
                  <BookStats>
                    <Stat>⭐ {book.rating || '5.0'}/5</Stat>
                    <Stat>👁️ {book.views || '0'} vues</Stat>
                  </BookStats>
                </BookInfo>
                <BookActions>
                  <Button size="small" variant="primary">
                    {book.preview ? 'Aperçu' : 'Détails'}
                  </Button>
                </BookActions>
              </RecommendedItem>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📚</EmptyIcon>
              <EmptyText>Aucun livre disponible</EmptyText>
            </EmptyState>
          )}
        </RecommendedList>
      </ContentCard>
    </TwoColumnGrid>

    {/* Mes publications si connecté */}
    {hasAccount && myPublications && myPublications.length > 0 && (
      <ContentCard>
        <CardHeader>
          <CardTitle>Mes Publications</CardTitle>
          <Button variant="primary">
            + Nouvelle Publication
          </Button>
        </CardHeader>
        <PublicationsGrid>
          {myPublications.map(publication => (
            <PublicationCard key={publication.id}>
              <PublicationIcon>📄</PublicationIcon>
              <PublicationContent>
                <PublicationTitle>{publication.title || 'Publication sans titre'}</PublicationTitle>
                <PublicationStats>
                  <Stat>👁️ {publication.views || '0'} vues</Stat>
                  <Stat>📥 {publication.downloads || '0'} téléch.</Stat>
                  <Stat>💬 {publication.comments || '0'} commentaires</Stat>
                </PublicationStats>
                <PublicationStatus $status={publication.status || 'Brouillon'}>
                  {publication.status || 'Brouillon'}
                </PublicationStatus>
              </PublicationContent>
              <PublicationActions>
                <Button size="small">Éditer</Button>
                <Button size="small" variant="secondary">
                  Statistiques
                </Button>
              </PublicationActions>
            </PublicationCard>
          ))}
        </PublicationsGrid>
      </ContentCard>
    )}

    {/* Catégories populaires */}
    <ContentCard>
      <CardHeader>
        <CardTitle>Catégories Populaires</CardTitle>
        <Button size="small" variant="secondary">
          Explorer toutes
        </Button>
      </CardHeader>
      <CategoriesGrid>
        {popularCategories && popularCategories.length > 0 ? (
          popularCategories.map((category, index) => (
            <CategoryCard key={index}>
              <CategoryIcon>{getCategoryIcon(category)}</CategoryIcon>
              <CategoryName>{category}</CategoryName>
              <CategoryAction>
                <Button size="small" variant="secondary">
                  Explorer
                </Button>
              </CategoryAction>
            </CategoryCard>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>📂</EmptyIcon>
            <EmptyText>Aucune catégorie disponible</EmptyText>
          </EmptyState>
        )}
      </CategoriesGrid>
    </ContentCard>
  </>
);

// Composant Onglet Mon Contenu (seulement si connecté)
const MyContentTab = ({ myDownloads, myPublications }) => (
  <TwoColumnGrid>
    {/* Mes téléchargements */}
    <ContentCard>
      <CardHeader>
        <CardTitle>Mes Téléchargements</CardTitle>
        <Button size="small" variant="secondary">
          Historique complet
        </Button>
      </CardHeader>
      <DownloadsList>
        {myDownloads && myDownloads.length > 0 ? (
          myDownloads.map(download => (
            <DownloadItem key={download.id}>
              <DownloadIcon>📥</DownloadIcon>
              <DownloadInfo>
                <DownloadTitle>{download.title || 'Document téléchargé'}</DownloadTitle>
                <DownloadMeta>
                  <div>Auteur: {download.author || 'Inconnu'}</div>
                  <div>Téléchargé le: {download.date || 'Date inconnue'}</div>
                  <div>Format: {download.format || 'PDF'}</div>
                </DownloadMeta>
              </DownloadInfo>
              <DownloadActions>
                <Button size="small" variant="primary">
                  Ouvrir
                </Button>
                <Button size="small" variant="secondary">
                  Télécharger à nouveau
                </Button>
              </DownloadActions>
            </DownloadItem>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>📚</EmptyIcon>
            <EmptyText>Aucun téléchargement</EmptyText>
            <EmptySubtext>Explorez le catalogue pour trouver des ressources</EmptySubtext>
            <Button variant="primary">
              Découvrir des livres
            </Button>
          </EmptyState>
        )}
      </DownloadsList>
    </ContentCard>

    {/* Mes publications */}
    <ContentCard>
      <CardHeader>
        <CardTitle>Mes Publications</CardTitle>
        <Button variant="primary">
          + Publier du contenu
        </Button>
      </CardHeader>
      <PublicationsList>
        {myPublications && myPublications.length > 0 ? (
          myPublications.map(publication => (
            <PublicationItem key={publication.id}>
              <PublicationHeader>
                <PublicationTitle>{publication.title || 'Publication sans titre'}</PublicationTitle>
                <PublicationBadge $status={publication.status || 'Brouillon'}>
                  {publication.status || 'Brouillon'}
                </PublicationBadge>
              </PublicationHeader>
              <PublicationDescription>
                {publication.description || 'Aucune description disponible.'}
              </PublicationDescription>
              <PublicationStats>
                <StatItem>
                  <StatIcon>👁️</StatIcon>
                  <StatValue>{publication.views || '0'}</StatValue>
                  <StatLabel>vues</StatLabel>
                </StatItem>
                <StatItem>
                  <StatIcon>📥</StatIcon>
                  <StatValue>{publication.downloads || '0'}</StatValue>
                  <StatLabel>téléch.</StatLabel>
                </StatItem>
                <StatItem>
                  <StatIcon>⭐</StatIcon>
                  <StatValue>{publication.rating || '0.0'}</StatValue>
                  <StatLabel>note</StatLabel>
                </StatItem>
              </PublicationStats>
              <PublicationActions>
                <Button size="small">Éditer</Button>
                <Button size="small" variant="secondary">
                  Analyser
                </Button>
                <Button size="small" variant="secondary">
                  Partager
                </Button>
              </PublicationActions>
            </PublicationItem>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>📄</EmptyIcon>
            <EmptyText>Aucune publication</EmptyText>
            <EmptySubtext>Commencez à partager vos connaissances</EmptySubtext>
            <Button variant="primary">
              Créer une publication
            </Button>
          </EmptyState>
        )}
      </PublicationsList>
    </ContentCard>
  </TwoColumnGrid>
);

// Composant Onglet Découvrir
const DiscoverTab = ({ featuredBooks, popularCategories }) => (
  <ContentCard>
    <SectionTitle>Découvrez Notre Catalogue</SectionTitle>
    
    <BooksGrid>
      {featuredBooks && featuredBooks.length > 0 ? (
        featuredBooks.map(book => (
          <BookPreview key={book.id}>
            <BookCover>📘</BookCover>
            <BookInfo>
              <BookTitle>{book.title || 'Livre sans titre'}</BookTitle>
              <BookAuthor>Par {book.author || 'Auteur inconnu'}</BookAuthor>
              <BookDescription>
                {book.description || "Découvrez ce livre fascinant qui vous transportera dans un univers de connaissances..."}
              </BookDescription>
              <BookSubjects>
                {book.subjects?.map((subject, idx) => (
                  <SubjectTag key={idx}>{subject}</SubjectTag>
                ))}
              </BookSubjects>
            </BookInfo>
            <BookActions>
              <Button size="small" variant="primary">
                Aperçu
              </Button>
              <Button size="small" variant="secondary">
                Ajouter aux favoris
              </Button>
            </BookActions>
          </BookPreview>
        ))
      ) : (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyText>Aucun livre disponible</EmptyText>
          <EmptySubtext>Revenez plus tard pour découvrir de nouveaux livres</EmptySubtext>
        </EmptyState>
      )}
    </BooksGrid>

    <CategoriesSection>
      <SectionTitle>Explorer par Catégorie</SectionTitle>
      <CategoriesGrid>
        {popularCategories && popularCategories.length > 0 ? (
          popularCategories.map((category, index) => (
            <CategoryCard key={index}>
              <CategoryIcon>{getCategoryIcon(category)}</CategoryIcon>
              <CategoryName>{category}</CategoryName>
              <CategoryCount>+500 livres</CategoryCount>
              <Button size="small" variant="secondary">
                Explorer
              </Button>
            </CategoryCard>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>📂</EmptyIcon>
            <EmptyText>Aucune catégorie disponible</EmptyText>
          </EmptyState>
        )}
      </CategoriesGrid>
    </CategoriesSection>
  </ContentCard>
);

// Composant Onglet Tarifs
const PricingTab = () => (
  <ContentCard>
    <SectionTitle>Choisissez Votre Formule</SectionTitle>
    <PricingGrid>
      <PricingCard>
        <PricingHeader>
          <PricingTitle>Gratuit</PricingTitle>
          <PricingPrice>0€<PricingPeriod>/mois</PricingPeriod></PricingPrice>
        </PricingHeader>
        <PricingFeatures>
          <Feature>✓ Accès aux livres gratuits</Feature>
          <Feature>✓ 5 téléchargements/mois</Feature>
          <Feature>✓ Support de base</Feature>
          <Feature disabled>✗ Accès aux livres premium</Feature>
          <Feature disabled>✗ Publications illimitées</Feature>
        </PricingFeatures>
        <Button variant="secondary" fullWidth>
          Commencer
        </Button>
      </PricingCard>

      <PricingCard featured>
        <PricingHeader>
          <PricingTitle>Premium</PricingTitle>
          <PricingPrice>9.99€<PricingPeriod>/mois</PricingPeriod></PricingPrice>
        </PricingHeader>
        <PricingFeatures>
          <Feature>✓ Tous les livres gratuits</Feature>
          <Feature>✓ Téléchargements illimités</Feature>
          <Feature>✓ Support prioritaire</Feature>
          <Feature>✓ Accès aux livres premium</Feature>
          <Feature>✓ Publications illimitées</Feature>
        </PricingFeatures>
        <Button variant="primary" fullWidth>
          Choisir cette offre
        </Button>
      </PricingCard>
    </PricingGrid>
  </ContentCard>
);

// ============================================================================
// STYLES
// ============================================================================

// Styles spécifiques au dashboard visiteur
const HeaderContent = styled.div`
  flex: 1;
`;

const WelcomeMessage = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-top: 0.5rem;
  font-size: 1.125rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  padding-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.gray[600]};
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
  min-height: 400px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin: 0;
`;

const RecentActivities = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
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

const ActivityIcon = styled.div`
  font-size: 1.5rem;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.25rem;
`;

const ActivityDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const ActivityAction = styled.div``;

const RecommendedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const BookCover = styled.div`
  font-size: 2rem;
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.25rem;
`;

const BookAuthor = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const BookStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const Stat = styled.span``;

const BookActions = styled.div``;

const PublicationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PublicationCard = styled.div`
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

const PublicationIcon = styled.div`
  font-size: 2rem;
  margin-top: 0.25rem;
`;

const PublicationContent = styled.div`
  flex: 1;
`;

const PublicationTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.5rem;
`;

const PublicationStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const PublicationStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'Publié': return props.theme.colors.success + '20';
      case 'En attente': return props.theme.colors.warning + '20';
      case 'Brouillon': return props.theme.colors.gray[200];
      default: return props.theme.colors.gray[200];
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'Publié': return props.theme.colors.success;
      case 'En attente': return props.theme.colors.warning;
      case 'Brouillon': return props.theme.colors.gray[600];
      default: return props.theme.colors.gray[600];
    }
  }};
`;

const PublicationActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const CategoryIcon = styled.div`
  font-size: 2.5rem;
`;

const CategoryName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
`;

const CategoryAction = styled.div``;

const DownloadsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DownloadItem = styled.div`
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

const DownloadIcon = styled.div`
  font-size: 2rem;
`;

const DownloadInfo = styled.div`
  flex: 1;
`;

const DownloadTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.5rem;
`;

const DownloadMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const DownloadActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PublicationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PublicationItem = styled.div`
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const PublicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PublicationBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'Publié': return props.theme.colors.success + '20';
      case 'En révision': return props.theme.colors.warning + '20';
      case 'Brouillon': return props.theme.colors.gray[200];
      default: return props.theme.colors.gray[200];
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'Publié': return props.theme.colors.success;
      case 'En révision': return props.theme.colors.warning;
      case 'Brouillon': return props.theme.colors.gray[600];
      default: return props.theme.colors.gray[600];
    }
  }};
`;

const PublicationDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 1rem;
  line-height: 1.5;
`;


const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatIcon = styled.span`
  font-size: 1.125rem;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 1.5rem;
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const BookPreview = styled.div`
  display: flex;
  flex-direction: column;
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

const BookDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  line-height: 1.5;
  font-size: 0.875rem;
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

const CategoriesSection = styled.div`
  margin-top: 2rem;
`;

const CategoryCount = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const PricingCard = styled.div`
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  border-radius: 12px;
  text-align: center;
  ${props => props.featured && `
    border-color: ${props.theme.colors.primary};
    box-shadow: ${props.theme.shadows.md};
  `}
`;

const PricingHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const PricingTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 1rem;
`;

const PricingPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[900]};
`;

const PricingPeriod = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const PricingFeatures = styled.div`
  margin-bottom: 2rem;
  text-align: left;
`;

const Feature = styled.div`
  padding: 0.5rem 0;
  color: ${props => props.disabled ? props.theme.colors.gray[400] : props.theme.colors.gray[700]};
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
  font-size: 1.1rem;
`;

const EmptySubtext = styled.div`
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

// Fonctions utilitaires
const getCategoryIcon = (category) => {
  const icons = {
    'Informatique': '💻',
    'Science': '🔬',
    'Économie': '📈',
    'Art & Design': '🎨',
    'Histoire': '📜',
    'Philosophie': '🧠',
    'Littérature': '📖',
    'Mathématiques': '📐'
  };
  return icons[category] || '📚';
};

export default VisitorDashboard;