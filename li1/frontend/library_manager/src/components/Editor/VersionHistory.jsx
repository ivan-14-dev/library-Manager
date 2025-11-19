// src/components/editor/VersionHistory.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiClock, FiUser, FiDownload, FiEye, FiRotateCcw } from 'react-icons/fi';

const VersionHistory = ({ versions, onRestore, onCompare }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVersionColor = (index) => {
    const colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];
    return colors[index % colors.length];
  };

  return (
    <VersionHistoryContainer>
      <Header>
        <Title>
          <FiClock />
          Historique des Versions
        </Title>
        <VersionCount>{versions.length} versions</VersionCount>
      </Header>

      <VersionList>
        {versions.map((version, index) => (
          <VersionItem 
            key={version.id}
            $selected={selectedVersion?.id === version.id}
            $color={getVersionColor(index)}
          >
            <VersionIndicator $color={getVersionColor(index)} />
            
            <VersionContent>
              <VersionHeader>
                <VersionLabel>{version.label}</VersionLabel>
                <VersionDate>{formatDate(version.createdAt)}</VersionDate>
              </VersionHeader>
              
              <VersionMeta>
                <MetaItem>
                  <FiUser />
                  {version.autoSaved ? 'Sauvegarde auto' : 'Sauvegarde manuelle'}
                </MetaItem>
                <MetaItem>
                  {version.wordCount} mots
                </MetaItem>
              </VersionMeta>

              <VersionActions>
                <VersionAction 
                  onClick={() => setSelectedVersion(version)}
                  $active={selectedVersion?.id === version.id}
                >
                  <FiEye />
                  Voir
                </VersionAction>
                
                <VersionAction 
                  onClick={() => onCompare?.(version)}
                  disabled={!selectedVersion}
                >
                  Comparer
                </VersionAction>
                
                <VersionAction 
                  onClick={() => onRestore?.(version)}
                  $variant="primary"
                >
                  <FiRotateCcw />
                  Restaurer
                </VersionAction>
              </VersionActions>
            </VersionContent>
          </VersionItem>
        ))}
      </VersionList>

      {selectedVersion && (
        <VersionPreview>
          <PreviewHeader>
            <PreviewTitle>Version: {selectedVersion.label}</PreviewTitle>
            <PreviewDate>{formatDate(selectedVersion.createdAt)}</PreviewDate>
          </PreviewHeader>
          
          <PreviewContent 
            dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
          />
        </VersionPreview>
      )}
    </VersionHistoryContainer>
  );
};

const VersionHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;
  font-size: 1.25rem;
`;

const VersionCount = styled.span`
  padding: 0.25rem 0.75rem;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const VersionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const VersionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
  
  ${props => props.$selected && css`
    border-color: ${props.$color};
    background: ${props.$color}10;
  `}
  
  &:hover {
    border-color: #4299e1;
    transform: translateY(-1px);
  }
`;

const VersionIndicator = styled.div`
  width: 4px;
  height: 40px;
  background: ${props => props.$color};
  border-radius: 2px;
`;

const VersionContent = styled.div`
  flex: 1;
`;

const VersionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const VersionLabel = styled.div`
  font-weight: 600;
  color: #2d3748;
`;

const VersionDate = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const VersionMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #718096;
`;

const VersionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const VersionAction = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$active && css`
    background: #4299e1;
    color: white;
    border-color: #4299e1;
  `}
  
  ${props => props.$variant === 'primary' && css`
    background: #4299e1;
    color: white;
    border-color: #4299e1;
    
    &:hover {
      background: #3182ce;
    }
  `}
  
  &:hover:not(:disabled) {
    background: #f7fafc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VersionPreview = styled.div`
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem;
  background: white;
  max-height: 300px;
  overflow-y: auto;
`;

const PreviewHeader = styled.div`
  margin-bottom: 1rem;
`;

const PreviewTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const PreviewDate = styled.div`
  color: #718096;
  font-size: 0.875rem;
`;

const PreviewContent = styled.div`
  color: #4a5568;
  line-height: 1.6;
  
  * {
    margin: 0.5em 0;
  }
  
  h1, h2, h3 {
    color: #2d3748;
  }
`;

export default VersionHistory;