// src/components/common/Toast.jsx
import React from 'react';
import styled from 'styled-components';
import { useToast } from '../../hooks/useToast';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ToastWrapper>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          $type={toast.type}
          onClick={() => removeToast(toast.id)}
        >
          <ToastIcon $type={toast.type}>
            {getToastIcon(toast.type)}
          </ToastIcon>
          <ToastContent>
            <ToastMessage>{toast.message}</ToastMessage>
          </ToastContent>
          <ToastClose>&times;</ToastClose>
        </Toast>
      ))}
    </ToastWrapper>
  );
};

const getToastIcon = (type) => {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    default: return 'ℹ';
  }
};

const ToastWrapper = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
`;

const Toast = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  background: ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  animation: slideIn 0.3s ease;
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success': return '#059669';
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      default: return '#2563eb';
    }
  }};
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastIcon = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastMessage = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
`;

const ToastClose = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  opacity: 0.8;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;