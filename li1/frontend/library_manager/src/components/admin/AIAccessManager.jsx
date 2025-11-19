// src/components/admin/AIAccessManager.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const AIAccessManager = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@email.com', role: 'student', aiAccess: false },
    { id: 2, name: 'Marie Martin', email: 'marie@email.com', role: 'professor', aiAccess: true },
    { id: 3, name: 'Pierre Durand', email: 'pierre@email.com', role: 'student', aiAccess: false },
  ]);

  const toggleAIAccess = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, aiAccess: !user.aiAccess }
        : user
    ));
  };

  const bulkToggleAIAccess = (role, access) => {
    setUsers(users.map(user => 
      user.role === role 
        ? { ...user, aiAccess: access }
        : user
    ));
  };

  if (user?.role !== 'admin') {
    return (
      <AccessDenied>
        <h3>Accès Refusé</h3>
        <p>Vous devez être administrateur pour gérer les accès IA.</p>
      </AccessDenied>
    );
  }

  return (
    <AIAccessContainer>
      <Header>
        <Title>Gestion des Accès IA</Title>
        <Description>
          Activez ou désactivez l'accès aux fonctionnalités IA par utilisateur
        </Description>
      </Header>

      <BulkActions>
        <BulkActionTitle>Actions de groupe :</BulkActionTitle>
        <BulkActionGroup>
          <BulkButton onClick={() => bulkToggleAIAccess('student', true)}>
            Activer tous les étudiants
          </BulkButton>
          <BulkButton onClick={() => bulkToggleAIAccess('student', false)}>
            Désactiver tous les étudiants
          </BulkButton>
          <BulkButton onClick={() => bulkToggleAIAccess('professor', true)}>
            Activer tous les professeurs
          </BulkButton>
        </BulkActionGroup>
      </BulkActions>

      <UsersList>
        {users.map(user => (
          <UserItem key={user.id}>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserDetails>
                <UserEmail>{user.email}</UserEmail>
                <UserRole>{user.role}</UserRole>
              </UserDetails>
            </UserInfo>
            
            <AIAccessToggle>
              <ToggleLabel>
                Accès IA: {user.aiAccess ? 'Activé' : 'Désactivé'}
              </ToggleLabel>
              <ToggleSwitch
                checked={user.aiAccess}
                onChange={() => toggleAIAccess(user.id)}
              />
            </AIAccessToggle>
          </UserItem>
        ))}
      </UsersList>

      <Stats>
        <StatItem>
          <StatValue>{users.filter(u => u.aiAccess).length}</StatValue>
          <StatLabel>Utilisateurs avec accès IA</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{users.filter(u => !u.aiAccess).length}</StatValue>
          <StatLabel>Utilisateurs sans accès IA</StatLabel>
        </StatItem>
      </Stats>
    </AIAccessContainer>
  );
};

// Styles pour le gestionnaire d'accès
const AIAccessContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #718096;
`;

const BulkActions = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 6px;
`;

const BulkActionTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const BulkActionGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const BulkButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #edf2f7;
    border-color: #4299e1;
  }
`;

const UsersList = styled.div`
  space-y: 1rem;
  margin-bottom: 2rem;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const UserDetails = styled.div`
  display: flex;
  gap: 1rem;
`;

const UserEmail = styled.div`
  color: #718096;
  font-size: 0.875rem;
`;

const UserRole = styled.div`
  padding: 0.25rem 0.75rem;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const AIAccessToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleLabel = styled.span`
  color: #4a5568;
  font-size: 0.875rem;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #e2e8f0;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:checked {
    background: #4299e1;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: all 0.2s ease;
  }
  
  &:checked::before {
    left: 22px;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.875rem;
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
  
  h3 {
    color: #2d3748;
    margin-bottom: 1rem;
  }
`;

export default AIAccessManager;