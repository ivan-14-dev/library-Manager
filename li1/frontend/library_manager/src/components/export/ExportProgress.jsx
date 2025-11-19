// src/components/export/ExportProgress.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiDownload, FiX, FiCheck } from 'react-icons/fi';

/**
 * Composant pour afficher la progression des exports
 */
const ProgressContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  z-index: 1000;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
  border-radius: 8px 8px 0 0;
`;

const ProgressTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressContent = styled.div`
  padding: 16px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #4299e1;
  border-radius: 3px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #718096;
`;

const ProgressActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  color: #4a5568;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #edf2f7;
  }
`;

const ExportProgress = ({ 
  currentExport, 
  progress, 
  onCancel, 
  onDownload,
  onClose 
}) => {
  if (!currentExport) return null;

  const getStatusIcon = () => {
    if (progress === 100) return <FiCheck color="#48bb78" />;
    return <FiDownload color="#4299e1" />;
  };

  const getStatusText = () => {
    if (progress === 100) return 'Terminé';
    return 'Export en cours';
  };

  return (
    <ProgressContainer>
      <ProgressHeader>
        <ProgressTitle>
          {getStatusIcon()}
          Export {currentExport.format.toUpperCase()}
        </ProgressTitle>
        <CloseButton onClick={onClose}>
          <FiX size={16} />
        </CloseButton>
      </ProgressHeader>
      
      <ProgressContent>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
        
        <ProgressText>
          <span>{getStatusText()}</span>
          <span>{progress}%</span>
        </ProgressText>
        
        <ProgressActions>
          {progress === 100 ? (
            <ActionButton onClick={onDownload}>
              <FiDownload size={14} />
              Télécharger
            </ActionButton>
          ) : (
            <ActionButton onClick={onCancel} disabled={progress === 100}>
              <FiX size={14} />
              Annuler
            </ActionButton>
          )}
        </ProgressActions>
      </ProgressContent>
    </ProgressContainer>
  );
};

export default ExportProgress;