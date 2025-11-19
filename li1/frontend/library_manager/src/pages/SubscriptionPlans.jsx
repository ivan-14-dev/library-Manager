// src/pages/SubscriptionPlans.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/StyledComponents';

/**
 * Page de choix des formules d'abonnement
 */
const PlansContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PlanCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid ${props => props.$featured ? '#4299e1' : '#e2e8f0'};
  box-shadow: ${props => props.$featured ? '0 10px 25px rgba(66, 153, 225, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)'};
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const PlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #4299e1;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 0.5rem;
  
  .currency {
    font-size: 1.5rem;
    vertical-align: super;
  }
  
  .period {
    font-size: 1rem;
    color: #718096;
    font-weight: 400;
  }
`;

const PlanDescription = styled.p`
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  space-y: 0.75rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4a5568;
  
  &.included {
    color: #48bb78;
  }
  
  &.excluded {
    color: #a0aec0;
    text-decoration: line-through;
  }
`;

const FeatureIcon = styled.span`
  font-size: 1.125rem;
`;

const CurrentPlanIndicator = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  color: #276749;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const SubscriptionPlans = () => {
  const { subscription, hasPlan } = useSubscription();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      description: 'Parfait pour découvrir la plateforme',
      featured: false,
      features: [
        { text: '100 livres accessibles', included: true },
        { text: 'Recherche basique', included: true },
        { text: 'Support communautaire', included: true },
        { text: 'Assistant IA', included: false },
        { text: 'Export PDF', included: false },
        { text: 'Collaboration', included: false },
      ]
    },
    {
      id: 'student',
      name: 'Étudiant',
      price: 9.99,
      description: 'Idéal pour les étudiants et l\'apprentissage',
      featured: true,
      features: [
        { text: 'Accès illimité aux livres', included: true },
        { text: 'Recherche avancée', included: true },
        { text: 'Assistant IA (100 req/mois)', included: true },
        { text: 'Export PDF/DOCX', included: true },
        { text: 'Collaboration basique', included: true },
        { text: 'Groupes d\'étude', included: true },
      ]
    },
    {
      id: 'professor',
      name: 'Professeur',
      price: 19.99,
      description: 'Complet pour l\'enseignement et la recherche',
      featured: false,
      features: [
        { text: 'Toutes les fonctionnalités Étudiant', included: true },
        { text: 'Assistant IA illimité', included: true },
        { text: 'Publication de contenus', included: true },
        { text: 'Analytiques avancées', included: true },
        { text: 'Collaboration complète', included: true },
        { text: 'Support prioritaire', included: true },
      ]
    }
  ];

  const handleSubscribe = async (planId) => {
    // Intégration avec Stripe ou système de paiement
    console.log('Souscription au plan:', planId);
    
    // Redirection vers la page de paiement
    // window.location.href = `/payment/checkout?plan=${planId}`;
  };

  const isCurrentPlan = (planId) => {
    return hasPlan(planId) && subscription?.is_active;
  };

  return (
    <PlansContainer>
      <PageHeader>
        <PageTitle>Choisissez Votre Formule</PageTitle>
        <PageSubtitle>
          Sélectionnez l'abonnement qui correspond le mieux à vos besoins d'apprentissage et de recherche
        </PageSubtitle>
      </PageHeader>

      <PlansGrid>
        {plans.map((plan) => (
          <PlanCard key={plan.id} $featured={plan.featured}>
            {plan.featured && <PlanBadge>Populaire</PlanBadge>}
            
            <PlanHeader>
              <PlanName>{plan.name}</PlanName>
              <PlanPrice>
                <span className="currency">€</span>
                {plan.price}
                <span className="period">/mois</span>
              </PlanPrice>
              <PlanDescription>{plan.description}</PlanDescription>
            </PlanHeader>

            {isCurrentPlan(plan.id) && (
              <CurrentPlanIndicator>
                Votre plan actuel
              </CurrentPlanIndicator>
            )}

            <PlanFeatures>
              {plan.features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  className={feature.included ? 'included' : 'excluded'}
                >
                  <FeatureIcon>
                    {feature.included ? '✓' : '✗'}
                  </FeatureIcon>
                  {feature.text}
                </FeatureItem>
              ))}
            </PlanFeatures>

            <Button
              variant={plan.featured ? 'primary' : 'secondary'}
              fullWidth
              onClick={() => handleSubscribe(plan.id)}
              disabled={isCurrentPlan(plan.id)}
            >
              {isCurrentPlan(plan.id) ? 'Plan Actuel' : 'Choisir ce plan'}
            </Button>
          </PlanCard>
        ))}
      </PlansGrid>
    </PlansContainer>
  );
};

export default SubscriptionPlans;