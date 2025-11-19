// src/components/ai/AIAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAI } from '../../context/AIContext';
import { Button } from '../common/StyledComponents';

/**
 * Assistant IA personnel - Chatbot et aide à la rédaction
 * Flottant en bas à droite de l'écran
 */
const AIAssistant = () => {
  const { 
    isAIOpen, 
    closeAI, 
    currentConversation, 
    sendMessage, 
    isProcessing,
    aiMode,
    setAiMode
  } = useAI();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Focus sur l'input quand l'IA s'ouvre
  useEffect(() => {
    if (isAIOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isAIOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickAction = (action) => {
    const prompts = {
      grammar: "Peux-tu vérifier la grammaire de mon texte ?",
      summarize: "Aide-moi à résumer ce document",
      research: "Je besoin d'aide pour une recherche sur...",
      structure: "Comment structurer mon document ?"
    };
    setInputMessage(prompts[action] || action);
  };

  if (!isAIOpen) return null;

  return (
    <AssistantContainer>
      <AssistantHeader>
        <HeaderInfo>
          <AIIcon>🤖</AIIcon>
          <HeaderText>
            <AssistantTitle>Assistant IA</AssistantTitle>
            <AssistantStatus>
              {isProcessing ? 'Réflexion...' : 'En ligne'}
            </AssistantStatus>
          </HeaderText>
        </HeaderInfo>
        <HeaderActions>
          <ModeSelector 
            value={aiMode} 
            onChange={(e) => setAiMode(e.target.value)}
          >
            <option value="chat">💬 Chat</option>
            <option value="writing">✍️ Rédaction</option>
            <option value="research">🔍 Recherche</option>
          </ModeSelector>
          <CloseButton onClick={closeAI}>×</CloseButton>
        </HeaderActions>
      </AssistantHeader>

      <MessagesContainer>
        {currentConversation?.messages.length === 0 ? (
          <WelcomeMessage>
            <WelcomeIcon>🎓</WelcomeIcon>
            <WelcomeTitle>Bonjour ! Je suis votre assistant IA</WelcomeTitle>
            <WelcomeText>
              Je peux vous aider avec la rédaction, la recherche académique, 
              la correction de textes et bien plus encore.
            </WelcomeText>
            
            <QuickActions>
              <QuickActionTitle>Actions rapides :</QuickActionTitle>
              <QuickActionGrid>
                <QuickActionButton onClick={() => handleQuickAction('grammar')}>
                  ✏️ Correction grammaticale
                </QuickActionButton>
                <QuickActionButton onClick={() => handleQuickAction('summarize')}>
                  📝 Aide à la rédaction
                </QuickActionButton>
                <QuickActionButton onClick={() => handleQuickAction('research')}>
                  🔍 Recherche académique
                </QuickActionButton>
                <QuickActionButton onClick={() => handleQuickAction('structure')}>
                  🏗️ Structure de document
                </QuickActionButton>
              </QuickActionGrid>
            </QuickActions>
          </WelcomeMessage>
        ) : (
          <MessagesList>
            {currentConversation?.messages.map((message) => (
              <MessageItem key={message.id} $role={message.role}>
                <MessageAvatar $role={message.role}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </MessageAvatar>
                <MessageContent>
                  <MessageText $role={message.role}>
                    {message.content}
                  </MessageText>
                  <MessageTime>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </MessageTime>
                </MessageContent>
              </MessageItem>
            ))}
            {isProcessing && (
              <MessageItem $role="assistant">
                <MessageAvatar $role="assistant">🤖</MessageAvatar>
                <MessageContent>
                  <TypingIndicator>
                    <TypingDot />
                    <TypingDot />
                    <TypingDot />
                  </TypingIndicator>
                </MessageContent>
              </MessageItem>
            )}
            <div ref={messagesEndRef} />
          </MessagesList>
        )}
      </MessagesContainer>

      <InputContainer onSubmit={handleSendMessage}>
        <InputWrapper>
          <MessageInput
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              aiMode === 'writing' ? "Coller votre texte pour obtenir de l'aide..." :
              aiMode === 'research' ? "Poser votre question de recherche..." :
              "Tapez votre message..."
            }
            disabled={isProcessing}
          />
          <SendButton 
            type="submit" 
            disabled={!inputMessage.trim() || isProcessing}
          >
            {isProcessing ? '···' : '↑'}
          </SendButton>
        </InputWrapper>
        
        <InputSuggestions>
          <Suggestion onClick={() => setInputMessage("Peux-tu m'aider à structurer mon document ?")}>
            Structure
          </Suggestion>
          <Suggestion onClick={() => setInputMessage("Corrige les fautes dans ce texte :")}>
            Correction
          </Suggestion>
          <Suggestion onClick={() => setInputMessage("Résume ce contenu :")}>
            Résumé
          </Suggestion>
        </InputSuggestions>
      </InputContainer>
    </AssistantContainer>
  );
};

// Styles pour l'assistant IA
const AssistantContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 400px;
  height: 600px;
  background: ${props => props.theme.colors.white};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100vw;
    height: 100vh;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
`;

const AssistantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  background: ${props => props.theme.colors.gray[50]};
  border-radius: 16px 16px 0 0;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AIIcon = styled.div`
  font-size: 1.5rem;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssistantTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
`;

const AssistantStatus = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ModeSelector = styled.select`
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.gray[500]};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: ${props => props.theme.colors.gray[200]};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: ${props => props.theme.colors.white};
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const WelcomeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const WelcomeTitle = styled.h3`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const QuickActions = styled.div`
  text-align: left;
`;

const QuickActionTitle = styled.h4`
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: 1rem;
  text-align: center;
`;

const QuickActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
`;

const QuickActionButton = styled.button`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '10'};
  }
`;

const MessagesList = styled.div`
  space-y: 1.5rem;
`;

const MessageItem = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  
  ${props => props.$role === 'user' && `
    flex-direction: row-reverse;
  `}
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: ${props => 
    props.$role === 'user' ? props.theme.colors.primary : props.theme.colors.gray[200]
  };
  color: ${props => 
    props.$role === 'user' ? props.theme.colors.white : props.theme.colors.gray[700]
  };
`;

const MessageContent = styled.div`
  max-width: 70%;
  ${props => props.$role === 'user' && `
    text-align: right;
  `}
`;

const MessageText = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 16px;
  background: ${props => 
    props.$role === 'user' ? props.theme.colors.primary : props.theme.colors.gray[100]
  };
  color: ${props => 
    props.$role === 'user' ? props.theme.colors.white : props.theme.colors.gray[800]
  };
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  
  ${props => props.$role === 'user' && `
    border-bottom-right-radius: 4px;
  `}
  
  ${props => props.$role === 'assistant' && `
    border-bottom-left-radius: 4px;
  `}
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.gray[500]};
  margin-top: 0.25rem;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 1rem;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gray[400]};
  animation: typing 1.4s infinite ease-in-out;

  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }

  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const InputContainer = styled.form`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  background: ${props => props.theme.colors.white};
  border-radius: 0 0 16px 16px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.4;
  min-height: 40px;
  max-height: 120px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => 
    props.disabled ? props.theme.colors.gray[300] : props.theme.colors.primary
  };
  color: ${props => props.theme.colors.white};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.secondary};
  }
`;

const InputSuggestions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

const Suggestion = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 16px;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '10'};
  }
`;

export default AIAssistant;