// src/components/ai/AITrigger.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAI } from '../../context/AIContext';

/**
 * Bouton flottant pour activer l'assistant IA
 */
const AITrigger = () => {
  const { openAI, isAIOpen } = useAI();
  const [showTooltip, setShowTooltip] = useState(false);

  if (isAIOpen) return null;

  return (
    <TriggerContainer>
      {showTooltip && (
        <Tooltip>
          Assistant IA - Aide à la rédaction et recherche
        </Tooltip>
      )}
      <TriggerButton
        onClick={() => openAI('chat')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <AIIcon>🤖</AIIcon>
      </TriggerButton>
    </TriggerContainer>
  );
};

const TriggerContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.theme.colors.gray[800]};
  color: ${props => props.theme.colors.white};
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  box-shadow: ${props => props.theme.shadows.md};

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 1rem;
    border: 4px solid transparent;
    border-top-color: ${props => props.theme.colors.gray[800]};
  }
`;

const TriggerButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
    100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
  }
`;

const AIIcon = styled.span``;

export default AITrigger;