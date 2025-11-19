// src/context/AIContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { aiAPI } from '../api/ai';

const AIContext = createContext();

/**
 * Contexte pour la gestion de l'assistant IA personnel
 * Gère les conversations, l'historique et les fonctionnalités d'aide
 */
export const AIProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMode, setAiMode] = useState('chat'); // 'chat' | 'writing' | 'research'
  const [isProcessing, setIsProcessing] = useState(false);

  // Créer ou récupérer une conversation
  const getOrCreateChat = useCallback((chatId = null) => {
    const chatIdentifier = chatId || `chat-${Date.now()}`;
    
    if (!conversations[chatIdentifier]) {
      setConversations(prev => ({
        ...prev,
        [chatIdentifier]: {
          id: chatIdentifier,
          title: 'Nouvelle conversation',
          messages: [],
          createdAt: new Date().toISOString(),
          mode: aiMode
        }
      }));
    }
    
    setCurrentChatId(chatIdentifier);
    return chatIdentifier;
  }, [conversations, aiMode]);

  // Envoyer un message à l'IA
  const sendMessage = useCallback(async (content, options = {}) => {
    if (!currentChatId) return;

    const chatId = getOrCreateChat(currentChatId);
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      ...options
    };

    // Ajouter le message utilisateur
    setConversations(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [...prev[chatId].messages, userMessage]
      }
    }));

    setIsProcessing(true);

    try {
      // Appel API réel à l'IA
      const response = await aiAPI.getWritingAssistant({ message: content, mode: aiMode });
      const aiResponse = response.data.response || response.data.content || "Réponse IA reçue";
      
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      // Ajouter la réponse IA
      setConversations(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: [...prev[chatId].messages, aiMessage],
          title: prev[chatId].messages.length === 0 ? 
            generateChatTitle(content) : prev[chatId].title
        }
      }));

    } catch (error) {
      console.error('Erreur IA:', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Je rencontre des difficultés techniques. Veuillez réessayer.",
        timestamp: new Date().toISOString(),
        type: 'error'
      };

      setConversations(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: [...prev[chatId].messages, errorMessage]
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  }, [currentChatId, getOrCreateChat, aiMode, user]);

  // Fonctions spécialisées pour l'aide à la rédaction
  const requestWritingHelp = useCallback(async (text, helpType) => {
    const prompt = getWritingPrompt(text, helpType);
    return await sendMessage(prompt, { helpType, originalText: text });
  }, [sendMessage]);

  // Recherche académique assistée
  const researchTopic = useCallback(async (topic, depth = 'basic') => {
    const prompt = getResearchPrompt(topic, depth);
    return await sendMessage(prompt, { researchTopic: topic, depth });
  }, [sendMessage]);

  // Réinitialiser la conversation
  const resetConversation = useCallback(() => {
    setCurrentChatId(null);
  }, []);

  // Ouvrir l'IA dans un mode spécifique
  const openAI = useCallback((mode = 'chat', initialMessage = '') => {
    setAiMode(mode);
    setIsAIOpen(true);
    getOrCreateChat();
    
    if (initialMessage) {
      setTimeout(() => sendMessage(initialMessage), 100);
    }
  }, [getOrCreateChat, sendMessage]);

  const value = {
    // État
    conversations,
    currentConversation: currentChatId ? conversations[currentChatId] : null,
    isAIOpen,
    aiMode,
    isProcessing,
    
    // Actions
    sendMessage,
    requestWritingHelp,
    researchTopic,
    resetConversation,
    openAI,
    closeAI: () => setIsAIOpen(false),
    setAiMode,
    getOrCreateChat
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

// Simulation de réponse IA
const simulateAIResponse = async (message, mode, user) => {
  // Simulation de délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const responses = {
    chat: [
      "Je suis là pour vous aider ! Comment puis-je vous assister aujourd'hui ?",
      "Je comprends votre demande. Voici ce que je peux vous proposer...",
      "Excellente question ! Voici quelques informations qui pourraient vous être utiles."
    ],
    writing: [
      "Voici quelques suggestions pour améliorer votre texte :\n\n1. Structure : Essayez de clarifier votre introduction\n2. Style : Utilisez des phrases plus courtes pour plus d'impact\n3. Contenu : Ajoutez des exemples concrets pour illustrer vos points",
      "Votre texte est prometteur ! Voici mes recommandations :\n\n- Développez davantage votre argument principal\n- Vérifiez la cohérence entre les paragraphes\n- Ajoutez des transitions fluides entre les idées"
    ],
    research: [
      "Voici ce que j'ai trouvé sur ce sujet :\n\n**Points clés :**\n• Premier point important\n• Deuxième élément à considérer\n• Perspective actuelle de la recherche\n\n**Sources recommandées :**\n- Livre: 'Titre pertinent' par Auteur\n- Article: 'Étude récente' dans Journal\n- Ressource: Site web spécialisé",
      "Recherche académique sur le sujet :\n\n**Contexte :** [contexte général]\n**Débats actuels :** [points de discussion]\n**Orientation future :** [tendances émergentes]\n\nJe peux approfondir n'importe lequel de ces aspects si vous le souhaitez."
    ]
  };

  const modeResponses = responses[mode] || responses.chat;
  return modeResponses[Math.floor(Math.random() * modeResponses.length)];
};

// Génération de titre de conversation
const generateChatTitle = (firstMessage) => {
  const words = firstMessage.split(' ').slice(0, 5).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
};

// Prompts spécialisés pour l'aide à la rédaction
const getWritingPrompt = (text, helpType) => {
  const prompts = {
    grammar: `Vérifie la grammaire et corrige les erreurs dans ce texte : "${text}"`,
    style: `Améliore le style et la fluidité de ce texte : "${text}"`,
    structure: `Analyse la structure et propose des améliorations d'organisation pour : "${text}"`,
    expand: `Développe et enrichis ce texte avec plus de détails : "${text}"`,
    simplify: `Simplifie ce texte pour le rendre plus accessible : "${text}"`
  };
  return prompts[helpType] || `Aide-moi avec ce texte : "${text}"`;
};

// Prompts pour la recherche
const getResearchPrompt = (topic, depth) => {
  const depthLevels = {
    basic: `Donne-moi une introduction basique sur : "${topic}"`,
    detailed: `Fournis une analyse détaillée et des sources sur : "${topic}"`,
    academic: `Présente une recherche académique approfondie sur : "${topic}" avec références`
  };
  return depthLevels[depth] || depthLevels.basic;
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};