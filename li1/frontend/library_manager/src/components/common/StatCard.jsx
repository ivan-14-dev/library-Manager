// src/components/common/StatCard.jsx
import React from 'react';
import styled from 'styled-components';

/**
 * Carte de statistique avec icône, valeur et tendance
 */
const StatCard = ({ 
  title, 
  value, 
  icon = '📊', 
  trend, 
  trendValue, 
  color = 'blue',
  onClick 
}) => {
  return (
    <StatCardContainer 
      $color={color} 
      $clickable={!!onClick}
      onClick={onClick}
    >
      <StatContent>
        <StatInfo>
          <StatTitle>{title}</StatTitle>
          <StatValue>{value}</StatValue>
          {trend && trendValue && (
            <StatTrend $trend={trend}>
              {trend === 'up' ? '↗' : '↘'} {trendValue}
            </StatTrend>
          )}
        </StatInfo>
        <StatIcon>{icon}</StatIcon>
      </StatContent>
    </StatCardContainer>
  );
};

const StatCardContainer = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.sm};
  border-left: 4px solid ${props => {
    switch (props.$color) {
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
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};

  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$clickable ? props.theme.shadows.lg : props.theme.shadows.sm};
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
        switch (props.$color) {
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

const StatContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[900]};
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatTrend = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => 
    props.$trend === 'up' ? props.theme.colors.success : props.theme.colors.error
  };
`;

const StatIcon = styled.div`
  font-size: 3rem;
  opacity: 0.7;
  margin-left: 1rem;
`;

export default StatCard;