import { createGlobalStyle } from 'styled-components';
import {styled} from 'styled-components';
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    border: none;
    outline: none;
    font-family: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .section {
    padding: 2rem 0;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    gap: 0.5rem;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--primary {
      background-color: #007bff;
      color: white;

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }
    }

    &--secondary {
      background-color: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background-color: #545b62;
      }
    }

    &--success {
      background-color: #28a745;
      color: white;

      &:hover:not(:disabled) {
        background-color: #1e7e34;
      }
    }

    &--danger {
      background-color: #dc3545;
      color: white;

      &:hover:not(:disabled) {
        background-color: #bd2130;
      }
    }

    &--outline {
      background-color: transparent;
      border: 2px solid currentColor;

      &-primary {
        color: #007bff;
        
        &:hover:not(:disabled) {
          background-color: #007bff;
          color: white;
        }
      }
    }

    &--sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    &--lg {
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }
  }

  .card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    &__header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    &__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
    }

    &__body {
      margin-bottom: 1rem;
    }

    &__footer {
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }
  }

  .grid {
    display: grid;
    gap: 1.5rem;

    &--2 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    &--3 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    &--4 {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  .form {
    &__group {
      margin-bottom: 1.5rem;
    }

    &__label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    &__control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 0.5rem;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #007bff;
      }

      &--error {
        border-color: #dc3545;
      }
    }

    &__error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    &::after {
      content: '';
      width: 2rem;
      height: 2rem;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .text {
    &--center { text-align: center; }
    &--left { text-align: left; }
    &--right { text-align: right; }
    &--muted { color: #6c757d; }
    &--success { color: #28a745; }
    &--danger { color: #dc3545; }
    &--warning { color: #ffc107; }
    &--info { color: #17a2b8; }
  }

  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 1rem; }
  .mt-4 { margin-top: 1.5rem; }
  .mt-5 { margin-top: 3rem; }

  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .mb-5 { margin-bottom: 3rem; }

  @media (max-width: 768px) {
    .container {
      padding: 0 0.5rem;
    }

    .grid {
      &--2, &--3, &--4 {
        grid-template-columns: 1fr;
      }
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
`;


// Layout principal
export const MainLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Arrière-plan blanc
export const WhiteBackground = styled.div`
  background: ${props => props.theme.colors.white};
  min-height: 100vh;
`;

// Container principal
export const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Container pour le dashboard
export const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Content area
export const ContentArea = styled.main`
  padding: 2rem;
  background: ${props => props.theme.colors.gray[50]};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Card de base
export const Card = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

// Grid pour les cartes
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

// Section title
export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 1rem;
`;

// Section subtitle
export const SectionSubtitle = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 1.5rem;
`;

// Status badges
export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.error}20;
          color: ${props.theme.colors.error};
        `;
      case 'info':
        return `
          background: ${props.theme.colors.info}20;
          color: ${props.theme.colors.info};
        `;
      default:
        return `
          background: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[600]};
        `;
    }
  }}
`;

// Loading spinner
export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.theme.colors.gray[300]};
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Empty state
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.gray[500]};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

// Button group
export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  
  ${props => props.justify && `justify-content: ${props.justify};`}
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
`;

// Form group
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

// Label
export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: 0.5rem;
`;

// Input
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[500]};
  }
`;

// Select
export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

// Textarea
export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

// Table
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

export const TableHead = styled.thead`
  background: ${props => props.theme.colors.gray[50]};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.gray[700]};
`;

// Modal overlay
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

// Modal content
export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.xl};
`;

// Modal header
export const ModalHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

// Modal title
export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[800]};
  margin: 0;
`;

// Modal close button
export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.gray[500]};
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.gray[700]};
  }
`;


export default GlobalStyles;