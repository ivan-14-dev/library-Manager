// src/components/common/StyledComponents.js
import styled from 'styled-components';

// Carte de statistique avec effet de hover
export const StatCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 4px solid ${props => {
    switch (props.color) {
      case 'blue': return props.theme.colors.primary;
      case 'green': return props.theme.colors.success;
      case 'red': return props.theme.colors.error;
      case 'orange': return props.theme.colors.warning;
      case 'purple': return '#8B5CF6';
      default: return props.theme.colors.primary;
    }
  }};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      ${props => {
        switch (props.color) {
          case 'blue': return props.theme.colors.primary;
          case 'green': return props.theme.colors.success;
          case 'red': return props.theme.colors.error;
          case 'orange': return props.theme.colors.warning;
          case 'purple': return '#8B5CF6';
          default: return props.theme.colors.primary;
        }
      }} 0%,
      transparent 100%
    );
  }
`;

// Bouton principal avec différents variants
export const Button = styled.button`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.gray[600];
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'error': return props.theme.colors.error;
      default: return props.theme.colors.primary;
    }
  }};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 8px;
  padding: ${props => props.size === 'small' ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  font-weight: 500;
  font-size: ${props => props.size === 'small' ? '0.875rem' : '1rem'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => {
      switch (props.variant) {
        case 'primary': return props.theme.colors.secondary;
        case 'secondary': return props.theme.colors.gray[700];
        case 'success': return '#059669';
        case 'warning': return '#D97706';
        case 'error': return '#DC2626';
        default: return props.theme.colors.secondary;
      }
    }};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Container de dashboard avec espacement
export const DashboardContainer = styled.div`
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// En-tête de dashboard avec titre et actions
export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

// Titre principal avec gradient
export const DashboardTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.gray[800]} 0%,
    ${props => props.theme.colors.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// Grille responsive pour les cartes de statistiques
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

// Carte de contenu avec ombre et bordure
export const ContentCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

// Grille de contenu à deux colonnes
export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;