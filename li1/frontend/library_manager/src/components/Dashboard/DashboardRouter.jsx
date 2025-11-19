// src/components/DashboardRouter.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MainLayout, WhiteBackground, MainContainer } from '../../styles/GlobalStyles';
import  AdminDashboard  from './AdminDashboard';
import  LibrarianDashboard  from './LibrarianDashboard';
import  ProfessorDashboard  from './ProfessorDashboard';
import  StudentDashboard  from './StudentDashboard';
import  VisitorDashboard   from './VisitorDashboard';

import { styled } from 'styled-components';

/**
 * Composant de routage principal qui affiche le dashboard approprié selon le rôle utilisateur
 * Gère également le layout global avec fond blanc en bas
 */
const DashboardRouter = () => {
  const { user, loading } = useAuth();

  // État de chargement avec spinner stylisé
  if (loading) {
    return (
      <MainLayout>
        <WhiteBackground />
        <MainContainer>
          <LoadingSpinner>
            <Spinner />
            <LoadingText>Chargement de votre espace...</LoadingText>
          </LoadingSpinner>
        </MainContainer>
      </MainLayout>
    );
  }

  // Sélection du composant dashboard selon le rôle utilisateur
  const renderDashboard = () => {
    if (!user) {
      return <VisitorDashboard />;
    }

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'librarian':
        return <LibrarianDashboard />;
      case 'professor':
        return <ProfessorDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <VisitorDashboard />;
    }
  };

  return (
    <MainLayout>
      <WhiteBackground />
      <MainContainer>
        {renderDashboard()}
      </MainContainer>
    </MainLayout>
  );
};

// Composants de style pour le loading
const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.gray[200]};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1.125rem;
`;

export default DashboardRouter;