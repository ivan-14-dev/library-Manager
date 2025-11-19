// src/components/collaboration/RealTimeCursor.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Composant pour afficher les curseurs des autres utilisateurs en temps réel
 */
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const CursorContainer = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  transition: all 0.1s ease;
  transform: translate(${props => props.$x}px, ${props => props.$y}px);
`;

const CursorSvg = styled.svg`
  width: 20px;
  height: 20px;
  animation: ${pulse} 2s infinite;
`;

const UserLabel = styled.div`
  position: absolute;
  top: -25px;
  left: 15px;
  background: ${props => props.$color};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transform: translateX(-50%);
`;

const RealTimeCursor = ({ user, position, color = '#4299e1' }) => {
  if (!position) return null;

  return (
    <CursorContainer $x={position.x} $y={position.y}>
      <UserLabel $color={color}>
        {user.username}
      </UserLabel>
      <CursorSvg viewBox="0 0 20 20" fill={color}>
        <path d="M13.5,1.5 L1.5,13.5 L7.5,13.5 L7.5,18.5 L12.5,13.5 L18.5,13.5 Z" />
      </CursorSvg>
    </CursorContainer>
  );
};

export default RealTimeCursor;