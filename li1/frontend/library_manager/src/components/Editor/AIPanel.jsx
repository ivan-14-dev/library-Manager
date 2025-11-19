// src/components/editor/AIPanel.jsx
import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useEditorAI } from '../../hooks/useEditorAI';
import { 
  FiStar, 
  FiZap, 
  FiEdit, 
  FiSearch, 
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiUser,
  FiSettings
} from 'react-icons/fi';

const AIPanel = ({ onSuggestionApply, onContentGenerate }) => {
  const {
    isAIActive,
    aiSuggestions,
    isProcessing,
    aiFeatures,
    generateAISuggestions,
    generateContent,
    researchTopic,
    analyzeTone,
    checkAIAccess
  } = useEditorAI();

  const [activeTool, setActiveTool] = useState('suggestions');
  const [researchQuery, setResearchQuery] = useState('');
  const [contentPrompt, setContentPrompt] = useState('');
  const [researchResults, setResearchResults] = useState(null);
  const [toneAnalysis, setToneAnalysis] = useState(null);
  const textareaRef = useRef(null);

  // Vérifier l'accès à l'IA au chargement
  React.useEffect(() => {
    checkAIAccess();
  }, [checkAIAccess]);

  const handleGenerateSuggestions = async () => {
    try {
      const editor = document.querySelector('.ck-content');
      const text = editor?.textContent || '';
      await generateAISuggestions(text);
    } catch (error) {
      console.error('Erreur:', error.message);
    }
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) return;
    
    try {
      const results = await researchTopic(researchQuery);
      setResearchResults(results);
    } catch (error) {
      console.error('Erreur recherche:', error.message);
    }
  };

  const handleGenerateContent = async () => {
    if (!contentPrompt.trim()) return;
    
    try {
      const content = await generateContent(contentPrompt);
      onContentGenerate?.(content);
      setContentPrompt('');
    } catch (error) {
      console.error('Erreur génération:', error.message);
    }
  };

  const handleToneAnalysis = async () => {
    try {
      const editor = document.querySelector('.ck-content');
      const text = editor?.textContent || '';
      const analysis = await analyzeTone(text);
      setToneAnalysis(analysis);
    } catch (error) {
      console.error('Erreur analyse:', error.message);
    }
  };

  if (!isAIActive) {
    return (
      <AIPanelContainer>
        <AIAccessDenied>
          <LockIcon>🔒</LockIcon>
          <AccessTitle>IA Non Disponible</AccessTitle>
          <AccessMessage>
            La fonctionnalité d'Intelligence Artificielle n'est pas incluse dans votre abonnement actuel.
          </AccessMessage>
          <UpgradeButton>
            Mettre à niveau l'abonnement
          </UpgradeButton>
        </AIAccessDenied>
      </AIPanelContainer>
    );
  }

  return (
    <AIPanelContainer>
      {/* En-tête du panel IA */}
      <AIPanelHeader>
        <AITitle>
          <AIIcon>🤖</AIIcon>
          Assistant IA
        </AITitle>
        <AIStatus $active={isAIActive}>
          {isAIActive ? 'Activé' : 'Désactivé'}
        </AIStatus>
      </AIPanelHeader>

      {/* Navigation des outils IA */}
      <AIToolNavigation>
        <AIToolButton 
          $active={activeTool === 'suggestions'}
          onClick={() => setActiveTool('suggestions')}
        >
          <FiStar />
          Suggestions
        </AIToolButton>
        
        <AIToolButton 
          $active={activeTool === 'research'}
          onClick={() => setActiveTool('research')}
        >
          <FiSearch />
          Recherche
        </AIToolButton>
        
        <AIToolButton 
          $active={activeTool === 'generate'}
          onClick={() => setActiveTool('generate')}
        >
          <FiZap />
          Générer
        </AIToolButton>
        
        <AIToolButton 
          $active={activeTool === 'tone'}
          onClick={() => setActiveTool('tone')}
        >
          <FiMessageSquare />
          Ton
        </AIToolButton>
      </AIToolNavigation>

      {/* Contenu des outils */}
      <AIToolContent>
        {activeTool === 'suggestions' && (
          <SuggestionsTool>
            <ToolHeader>
              <ToolTitle>Suggestions Intelligentes</ToolTitle>
              <RefreshButton 
                onClick={handleGenerateSuggestions}
                disabled={isProcessing}
              >
                {isProcessing ? 'Analyse...' : 'Analyser'}
              </RefreshButton>
            </ToolHeader>

            {isProcessing ? (
              <ProcessingState>
                <Spinner />
                <span>IA en train d'analyser votre texte...</span>
              </ProcessingState>
            ) : (
              <SuggestionsList>
                {aiSuggestions.length > 0 ? (
                  aiSuggestions.map(suggestion => (
                    <SuggestionItem key={suggestion.id} $type={suggestion.type}>
                      <SuggestionHeader>
                        <SuggestionType $type={suggestion.type}>
                          {getSuggestionIcon(suggestion.type)}
                          {getSuggestionTypeLabel(suggestion.type)}
                        </SuggestionType>
                        <SeverityBadge $severity={suggestion.severity}>
                          {suggestion.severity}
                        </SeverityBadge>
                      </SuggestionHeader>
                      <SuggestionText>{suggestion.text}</SuggestionText>
                      {suggestion.replacement && (
                        <SuggestionReplacement>
                          {suggestion.replacement}
                        </SuggestionReplacement>
                      )}
                      <SuggestionActions>
                        <SuggestionAction 
                          onClick={() => onSuggestionApply?.(suggestion)}
                        >
                          Appliquer
                        </SuggestionAction>
                        <SuggestionAction $variant="outline">
                          Ignorer
                        </SuggestionAction>
                      </SuggestionActions>
                    </SuggestionItem>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyIcon>📝</EmptyIcon>
                    <EmptyText>Aucune suggestion</EmptyText>
                    <EmptySubtext>
                      Cliquez sur "Analyser" pour obtenir des suggestions d'amélioration
                    </EmptySubtext>
                  </EmptyState>
                )}
              </SuggestionsList>
            )}
          </SuggestionsTool>
        )}

        {activeTool === 'research' && (
          <ResearchTool>
            <ToolHeader>
              <ToolTitle>Recherche Assistée</ToolTitle>
            </ToolHeader>
            
            <ResearchForm onSubmit={(e) => { e.preventDefault(); handleResearch(); }}>
              <ResearchInput
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                placeholder="Sujet de recherche..."
                disabled={isProcessing}
              />
              <ResearchButton type="submit" disabled={isProcessing || !researchQuery.trim()}>
                {isProcessing ? 'Recherche...' : 'Rechercher'}
              </ResearchButton>
            </ResearchForm>

            {researchResults && (
              <ResearchResults>
                <ResultSection>
                  <ResultTitle>Résumé</ResultTitle>
                  <ResultText>{researchResults.summary}</ResultText>
                </ResultSection>
                
                <ResultSection>
                  <ResultTitle>Points Clés</ResultTitle>
                  <ResultList>
                    {researchResults.keyPoints.map((point, index) => (
                      <ResultItem key={index}>{point}</ResultItem>
                    ))}
                  </ResultList>
                </ResultSection>
                
                <ResultSection>
                  <ResultTitle>Sources</ResultTitle>
                  <ResultList>
                    {researchResults.sources.map((source, index) => (
                      <ResultItem key={index}>{source}</ResultItem>
                    ))}
                  </ResultList>
                </ResultSection>
              </ResearchResults>
            )}
          </ResearchTool>
        )}

        {activeTool === 'generate' && (
          <GenerateTool>
            <ToolHeader>
              <ToolTitle>Génération de Contenu</ToolTitle>
            </ToolHeader>
            
            <GenerateForm onSubmit={(e) => { e.preventDefault(); handleGenerateContent(); }}>
              <GenerateInput
                ref={textareaRef}
                value={contentPrompt}
                onChange={(e) => setContentPrompt(e.target.value)}
                placeholder="Décrivez le contenu que vous souhaitez générer..."
                rows="4"
                disabled={isProcessing}
              />
              <GenerateButton type="submit" disabled={isProcessing || !contentPrompt.trim()}>
                {isProcessing ? 'Génération...' : 'Générer'}
              </GenerateButton>
            </GenerateForm>

            <GenerationTips>
              <TipsTitle>Conseils de génération :</TipsTitle>
              <TipItem>• Soyez spécifique dans votre demande</TipItem>
              <TipItem>• Incluez le ton souhaité (formel, informel, etc.)</TipItem>
              <TipItem>• Précisez la longueur approximative</TipItem>
            </GenerationTips>
          </GenerateTool>
        )}

        {activeTool === 'tone' && (
          <ToneTool>
            <ToolHeader>
              <ToolTitle>Analyse du Ton</ToolTitle>
              <RefreshButton 
                onClick={handleToneAnalysis}
                disabled={isProcessing}
              >
                {isProcessing ? 'Analyse...' : 'Analyser'}
              </RefreshButton>
            </ToolHeader>

            {toneAnalysis ? (
              <ToneResults>
                <ToneScore>
                  <ScoreLabel>Ton détecté :</ScoreLabel>
                  <ScoreValue>{toneAnalysis.tone}</ScoreValue>
                  <Confidence>Confiance: {(toneAnalysis.confidence * 100).toFixed(0)}%</Confidence>
                </ToneScore>
                
                <ToneSuggestions>
                  <SuggestionsTitle>Suggestions :</SuggestionsTitle>
                  {toneAnalysis.suggestions.map((suggestion, index) => (
                    <ToneSuggestion key={index}>
                      {suggestion}
                    </ToneSuggestion>
                  ))}
                </ToneSuggestions>
              </ToneResults>
            ) : (
              <TonePlaceholder>
                <PlaceholderIcon>🎭</PlaceholderIcon>
                <PlaceholderText>Analysez le ton de votre texte</PlaceholderText>
                <PlaceholderSubtext>
                  Obtenez des insights sur le style d'écriture et des suggestions d'amélioration
                </PlaceholderSubtext>
              </TonePlaceholder>
            )}
          </ToneTool>
        )}
      </AIToolContent>

      {/* Pied de page IA */}
      <AIPanelFooter>
        <AIPoweredBy>
          <PowerIcon>⚡</PowerIcon>
          Propulsé par l'IA
        </AIPoweredBy>
        <AIStats>
          <Stat>
            <FiUser />
            {aiSuggestions.length} suggestions
          </Stat>
        </AIStats>
      </AIPanelFooter>
    </AIPanelContainer>
  );
};

// Styles Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AIPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-left: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.3s ease;
`;

const AIAccessDenied = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: #718096;
`;

const LockIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

const AccessTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const AccessMessage = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const UpgradeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #3182ce;
  }
`;

const AIPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
`;

const AITitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2d3748;
`;

const AIIcon = styled.span`
  font-size: 1.25rem;
`;

const AIStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.$active && css`
    background: #c6f6d5;
    color: #276749;
  `}
  
  ${props => !props.$active && css`
    background: #fed7d7;
    color: #c53030;
  `}
`;

const AIToolNavigation = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: white;
`;

const AIToolButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  color: #718096;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$active && css`
    background: #edf2f7;
    color: #4299e1;
    border-bottom: 2px solid #4299e1;
  `}
  
  &:hover {
    background: #f7fafc;
    color: #4a5568;
  }
`;

const AIToolContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const ToolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ToolTitle = styled.h3`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
`;

const RefreshButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #f7fafc;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Styles pour les suggestions
const SuggestionsTool = styled.div``;

const ProcessingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #718096;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SuggestionItem = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  
  ${props => props.$type === 'grammar' && css`
    border-left: 4px solid #48bb78;
  `}
  
  ${props => props.$type === 'style' && css`
    border-left: 4px solid #ed8936;
  `}
  
  ${props => props.$type === 'content' && css`
    border-left: 4px solid #4299e1;
  `}
  
  ${props => props.$type === 'tone' && css`
    border-left: 4px solid #9f7aea;
  `}
`;

const SuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SuggestionType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
`;

const SeverityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.$severity === 'high' && css`
    background: #fed7d7;
    color: #c53030;
  `}
  
  ${props => props.$severity === 'medium' && css`
    background: #fefcbf;
    color: #d69e2e;
  `}
  
  ${props => props.$severity === 'low' && css`
    background: #c6f6d5;
    color: #276749;
  `}
`;

const SuggestionText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;

const SuggestionReplacement = styled.div`
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const SuggestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SuggestionAction = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  
  ${props => props.$variant === 'outline' && css`
    background: transparent;
  `}
  
  &:hover {
    background: #f7fafc;
  }
  
  &:first-child {
    background: #4299e1;
    color: white;
    
    &:hover {
      background: #3182ce;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #718096;
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

const EmptyText = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const EmptySubtext = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
`;

// Styles pour la recherche
const ResearchTool = styled.div``;

const ResearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ResearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
  
  &:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }
`;

const ResearchButton = styled.button`
  padding: 0.75rem 1rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #3182ce;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResearchResults = styled.div`
  space-y: 1.5rem;
`;

const ResultSection = styled.div``;

const ResultTitle = styled.h4`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ResultText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ResultList = styled.ul`
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
  padding-left: 1rem;
`;

const ResultItem = styled.li`
  margin-bottom: 0.25rem;
`;

// Styles pour la génération
const GenerateTool = styled.div``;

const GenerateForm = styled.form`
  margin-bottom: 1rem;
`;

const GenerateInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
  
  &:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #3182ce;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GenerationTips = styled.div`
  padding: 1rem;
  background: #f7fafc;
  border-radius: 6px;
`;

const TipsTitle = styled.h4`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const TipItem = styled.div`
  color: #718096;
  font-size: 0.875rem;
  line-height: 1.4;
`;

// Styles pour l'analyse du ton
const ToneTool = styled.div``;

const ToneResults = styled.div`
  space-y: 1.5rem;
`;

const ToneScore = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
`;

const ScoreLabel = styled.div`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ScoreValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 0.5rem;
`;

const Confidence = styled.div`
  color: #718096;
  font-size: 0.875rem;
`;

const ToneSuggestions = styled.div``;

const SuggestionsTitle = styled.h4`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const ToneSuggestion = styled.div`
  padding: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const TonePlaceholder = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #718096;
`;

const PlaceholderIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

const PlaceholderText = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const PlaceholderSubtext = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
`;

// Pied de page IA
const AIPanelFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
`;

const AIPoweredBy = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
`;

const PowerIcon = styled.span``;

const AIStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #718096;
`;

// Fonctions utilitaires
const getSuggestionIcon = (type) => {
  const icons = {
    grammar: '✏️',
    style: '🎨',
    content: '💡',
    tone: '🎭'
  };
  return icons[type] || '💡';
};

const getSuggestionTypeLabel = (type) => {
  const labels = {
    grammar: 'Grammaire',
    style: 'Style',
    content: 'Contenu',
    tone: 'Ton'
  };
  return labels[type] || 'Suggestion';
};

export default AIPanel;