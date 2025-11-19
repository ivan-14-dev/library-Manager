import React from 'react';
import {
  StatsSection,
  StatsContainer,
  StatsHeader,
  StatsTitle,
  StatsSubtitle,
  StatsGrid,
  StatItem,
  StatNumber,
  StatLabel
} from './Home.styles';

const CommunityStats = () => {
  const stats = [
    {
      number: "12,547",
      label: "Utilisateurs Actifs"
    },
    {
      number: "8,932",
      label: "Publications Totales"
    },
    {
      number: "2,341",
      label: "Collaborations Actives"
    },
    {
      number: "156",
      label: "Professeurs Certifiés"
    }
  ];

  return (
    <StatsSection>
      <StatsContainer>
        <StatsHeader>
          <StatsTitle>Notre Communauté Académique</StatsTitle>
          <StatsSubtitle>Des chiffres qui témoignent de notre impact</StatsSubtitle>
        </StatsHeader>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </StatsContainer>
    </StatsSection>
  );
};

export default CommunityStats;