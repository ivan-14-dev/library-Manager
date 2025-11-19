// src/context/SubscriptionContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscriptionAPI } from '../services/api';

/**
 * Contexte pour la gestion des abonnements et des fonctionnalités
 */
const SubscriptionContext = createContext();

// Types d'actions
const SUBSCRIPTION_ACTIONS = {
  SET_SUBSCRIPTION: 'SET_SUBSCRIPTION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_FEATURES: 'UPDATE_FEATURES'
};

// Reducer pour la gestion d'état
const subscriptionReducer = (state, action) => {
  switch (action.type) {
    case SUBSCRIPTION_ACTIONS.SET_SUBSCRIPTION:
      return {
        ...state,
        subscription: action.payload,
        loading: false,
        error: null
      };
    case SUBSCRIPTION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case SUBSCRIPTION_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case SUBSCRIPTION_ACTIONS.UPDATE_FEATURES:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          features: action.payload
        }
      };
    default:
      return state;
  }
};

const initialState = {
  subscription: null,
  loading: true,
  error: null
};

export const SubscriptionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Charger l'abonnement de l'utilisateur
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSubscription();
    } else {
      dispatch({ type: SUBSCRIPTION_ACTIONS.SET_LOADING, payload: false });
    }
  }, [isAuthenticated, user]);

  const loadSubscription = async () => {
    try {
      dispatch({ type: SUBSCRIPTION_ACTIONS.SET_LOADING, payload: true });
      const response = await subscriptionAPI.getMySubscription();
      dispatch({ type: SUBSCRIPTION_ACTIONS.SET_SUBSCRIPTION, payload: response.data });
    } catch (error) {
      console.error('Erreur chargement abonnement:', error);
      dispatch({ 
        type: SUBSCRIPTION_ACTIONS.SET_ERROR, 
        payload: 'Impossible de charger l\'abonnement' 
      });
    }
  };

  // Vérifier l'accès à une fonctionnalité
  const hasFeatureAccess = (feature) => {
    if (!state.subscription || !state.subscription.is_active) {
      return false;
    }
    return state.subscription.features?.[feature] === true;
  };

  // Vérifier si l'utilisateur a un plan spécifique
  const hasPlan = (planType) => {
    return state.subscription?.plan_type === planType;
  };

  // Obtenir les jours restants
  const getDaysRemaining = () => {
    return state.subscription?.days_remaining;
  };

  // Vérifier si l'abonnement est sur le point d'expirer
  const isExpiringSoon = () => {
    const daysRemaining = getDaysRemaining();
    return daysRemaining !== null && daysRemaining <= 7;
  };

  const value = {
    // État
    ...state,
    
    // Actions
    reloadSubscription: loadSubscription,
    
    // Utilitaires
    hasFeatureAccess,
    hasPlan,
    getDaysRemaining,
    isExpiringSoon,
    
    // Plans disponibles
    PLANS: {
      FREE: 'free',
      STUDENT: 'student', 
      PROFESSOR: 'professor',
      PREMIUM: 'premium'
    },
    
    // Fonctionnalités
    FEATURES: {
      AI_ACCESS: 'ai_access',
      PDF_EXPORT: 'export_pdf',
      DOCX_EXPORT: 'export_docx',
      COLLABORATION: 'collaboration',
      VERSION_HISTORY: 'version_history',
      ADVANCED_ANALYTICS: 'advanced_analytics'
    }
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};