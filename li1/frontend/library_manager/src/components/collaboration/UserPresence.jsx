// src/components/collaboration/UserPresence.jsx
import React from 'react';
import styled from 'styled-components';
import { useCollaboration } from '../../context/CollaborationContext';

/**
 * Composant pour afficher la liste des utilisateurs connectés à un document
 */
const PresenceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
`;

const UserList = styled.div`
  display: flex;
  align-items: center;
  gap: -8px;
`;

const UserCount = styled.div`
  font-size: 14px;
  color: #718096;
  margin-left: 8px;
`;

const UserPresence = () => {
  const { participants, getParticipantCount } = useCollaboration();
  
  const getUserColor = (userId) => {
    const colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];
    return colors[userId % colors.length];
  };

  const getUserInitials = (username) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (getParticipantCount() === 0) {
    return null;
  }

  return (
    <PresenceContainer>
      <UserList>
        {participants.slice(0, 5).map((participant, index) => (
          <UserAvatar
            key={participant.user.id}
            $color={getUserColor(participant.user.id)}
            style={{ 
              marginLeft: index > 0 ? '-8px' : '0',
              zIndex: 10 - index
            }}
            title={participant.user.username}
          >
            {getUserInitials(participant.user.username)}
          </UserAvatar>
        ))}
      </UserList>
      
      {getParticipantCount() > 5 && (
        <UserCount>+{getParticipantCount() - 5}</UserCount>
      )}
    </PresenceContainer>
  );
};

export default UserPresence;