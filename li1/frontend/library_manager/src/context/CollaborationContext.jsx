// src/context/CollaborationContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { groupsAPI } from '../api/groups';

/**
 * Contexte pour la collaboration en temps réel
 */
const CollaborationContext = createContext();

// Types d'actions
const COLLABORATION_ACTIONS = {
  SET_SESSION: 'SET_SESSION',
  SET_PARTICIPANTS: 'SET_PARTICIPANTS',
  SET_CURSORS: 'SET_CURSORS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_CURSOR: 'UPDATE_CURSOR'
};

// Reducer pour la gestion d'état
const collaborationReducer = (state, action) => {
  switch (action.type) {
    case COLLABORATION_ACTIONS.SET_SESSION:
      return {
        ...state,
        session: action.payload,
        loading: false,
        error: null
      };
    case COLLABORATION_ACTIONS.SET_PARTICIPANTS:
      return {
        ...state,
        participants: action.payload
      };
    case COLLABORATION_ACTIONS.SET_CURSORS:
      return {
        ...state,
        cursorPositions: action.payload
      };
    case COLLABORATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case COLLABORATION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case COLLABORATION_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload].slice(-100) // Garder les 100 derniers
      };
    case COLLABORATION_ACTIONS.UPDATE_CURSOR:
      return {
        ...state,
        cursorPositions: {
          ...state.cursorPositions,
          [action.payload.userId]: action.payload
        }
      };
    default:
      return state;
  }
};

const initialState = {
  session: null,
  participants: [],
  cursorPositions: {},
  chatMessages: [],
  loading: false,
  error: null,
  isConnected: false
};

export const CollaborationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const { connect, sendMessage, isConnected } = useWebSocket();
  const currentDocumentRef = useRef(null);

  // Rejoindre une session de collaboration
  const joinSession = async (documentId) => {
    try {
      dispatch({ type: COLLABORATION_ACTIONS.SET_LOADING, payload: true });
      
      // Rejoindre la session via API - Simulation pour l'instant
      const session = { id: documentId, participants: [] };
      
      dispatch({ type: COLLABORATION_ACTIONS.SET_SESSION, payload: session });
      
      // Se connecter au WebSocket
      connect(`ws://localhost:8000/ws/collaboration/${documentId}/`);
      
      currentDocumentRef.current = documentId;
      
    } catch (error) {
      console.error('Erreur rejoindre session:', error);
      dispatch({ 
        type: COLLABORATION_ACTIONS.SET_ERROR, 
        payload: 'Impossible de rejoindre la session' 
      });
    }
  };

  // Quitter la session
  const leaveSession = async () => {
    if (state.session) {
      try {
        // await collaborationAPI.leaveSession(state.session.id);
      } catch (error) {
        console.error('Erreur quitter session:', error);
      }
    }
    
    dispatch({ type: COLLABORATION_ACTIONS.SET_SESSION, payload: null });
    currentDocumentRef.current = null;
  };

  // Mettre à jour la position du curseur
  const updateCursorPosition = (position) => {
    if (!state.session) return;
    
    // Envoyer via WebSocket
    sendMessage({
      type: 'cursor_update',
      position,
      timestamp: new Date().toISOString()
    });
  };

  // Envoyer un message de chat
  const sendChatMessage = (message) => {
    if (!state.session) return;
    
    const chatMessage = {
      type: 'chat_message',
      message,
      timestamp: new Date().toISOString()
    };
    
    sendMessage(chatMessage);
    
    // Ajouter localement immédiatement
    dispatch({
      type: COLLABORATION_ACTIONS.ADD_MESSAGE,
      payload: {
        id: Date.now(),
        user: 'Vous',
        message,
        timestamp: new Date().toISOString(),
        isOwn: true
      }
    });
  };

  // Gérer les messages WebSocket entrants
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'user_joined':
        // Mettre à jour la liste des participants
        break;
      case 'user_left':
        // Mettre à jour la liste des participants
        break;
      case 'cursor_updated':
        dispatch({
          type: COLLABORATION_ACTIONS.UPDATE_CURSOR,
          payload: {
            userId: data.user_id,
            username: data.username,
            position: data.position,
            timestamp: data.timestamp
          }
        });
        break;
      case 'chat_message_received':
        dispatch({
          type: COLLABORATION_ACTIONS.ADD_MESSAGE,
          payload: {
            id: Date.now(),
            userId: data.user_id,
            username: data.username,
            message: data.message,
            timestamp: data.timestamp,
            isOwn: false
          }
        });
        break;
      default:
        console.log('Message WebSocket non géré:', data);
    }
  };

  const value = {
    // État
    ...state,
    isConnected,
    
    // Actions
    joinSession,
    leaveSession,
    updateCursorPosition,
    sendChatMessage,
    
    // Utilitaires
    getParticipantCount: () => state.participants.length,
    getActiveCursors: () => Object.values(state.cursorPositions),
    isInSession: () => state.session !== null
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};