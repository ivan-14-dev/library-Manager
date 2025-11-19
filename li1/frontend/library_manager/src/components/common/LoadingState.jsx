// src/components/common/LoadingState.jsx
import React from 'react';
import styled from 'styled-components';

const LoadingState = ({ message = 'Chargement...' }) => {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.gray[200]};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 1rem;
`;

export default LoadingState;