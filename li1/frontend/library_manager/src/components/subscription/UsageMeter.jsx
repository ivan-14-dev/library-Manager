// src/components/subscription/UsageMeter.jsx
import React from 'react';
import styled from 'styled-components';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAI } from '../../context/AIContext';

/**
 * Composant pour afficher les jauges d'utilisation des fonctionnalités
 */
const MeterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const MeterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MeterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MeterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
`;

const MeterValue = styled.span`
  font-size: 12px;
  color: #718096;
`;

const MeterBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

const MeterFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.$percentage >= 90) return '#f56565';
    if (props.$percentage >= 75) return '#ed8936';
    return '#48bb78';
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$percentage}%;
`;

const UsageMeter = () => {
  const { subscription } = useSubscription();
  const { aiUsage } = useAI();

  if (!subscription) return null;

  const getUsagePercentage = (current, limit) => {
    if (limit === 0) return 0;
    return Math.min(100, Math.round((current / limit) * 100));
  };

  const features = [
    {
      label: 'Requêtes IA',
      current: aiUsage?.today_requests || 0,
      limit: subscription.features?.ai_requests_limit || 0,
      unit: 'requêtes'
    },
    {
      label: 'Exports PDF',
      current: subscription.usage?.pdf_exports || 0,
      limit: subscription.features?.pdf_export_limit || 0,
      unit: 'exports'
    },
    {
      label: 'Espace Stockage',
      current: subscription.usage?.storage_used || 0,
      limit: subscription.features?.storage_limit || 0,
      unit: 'MB'
    }
  ];

  return (
    <MeterContainer>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#2d3748' }}>
        Utilisation du mois
      </h4>
      
      {features.map((feature, index) => {
        const percentage = getUsagePercentage(feature.current, feature.limit);
        
        return (
          <MeterItem key={index}>
            <MeterHeader>
              <MeterLabel>{feature.label}</MeterLabel>
              <MeterValue>
                {feature.current} / {feature.limit} {feature.unit}
              </MeterValue>
            </MeterHeader>
            <MeterBar>
              <MeterFill $percentage={percentage} />
            </MeterBar>
          </MeterItem>
        );
      })}
    </MeterContainer>
  );
};

export default UsageMeter;