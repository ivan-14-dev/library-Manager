// src/hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personnalisé pour la gestion des connexions WebSocket
 * avec reconnexion automatique et gestion d'erreur
 */
export const useWebSocket = (url = null, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectCount, setReconnectCount] = useState(0);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const {
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage,
    onOpen,
    onClose,
    onError
  } = options;

  // Fonction de connexion
  const connect = useCallback((websocketUrl = url) => {
    if (!websocketUrl) {
      console.error('URL WebSocket non fournie');
      return;
    }

    try {
      ws.current = new WebSocket(websocketUrl);
      
      ws.current.onopen = (event) => {
        console.log('WebSocket connecté');
        setIsConnected(true);
        setReconnectCount(0);
        onOpen?.(event);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage?.(data);
        } catch (error) {
          console.error('Erreur parsing message WebSocket:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket déconnecté');
        setIsConnected(false);
        onClose?.(event);

        // Reconnexion automatique
        if (autoReconnect && reconnectCount < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect(websocketUrl);
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        onError?.(error);
      };

    } catch (error) {
      console.error('Erreur création WebSocket:', error);
    }
  }, [url, autoReconnect, reconnectInterval, maxReconnectAttempts, reconnectCount, onMessage, onOpen, onClose, onError]);

  // Fonction d'envoi de message
  const sendMessage = useCallback((message) => {
    if (ws.current && isConnected) {
      try {
        const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
        ws.current.send(messageStr);
        return true;
      } catch (error) {
        console.error('Erreur envoi message WebSocket:', error);
        return false;
      }
    } else {
      console.warn('WebSocket non connecté');
      return false;
    }
  }, [isConnected]);

  // Fonction de déconnexion
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
  }, []);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    lastMessage,
    reconnectCount,
    connect,
    disconnect,
    sendMessage
  };
};