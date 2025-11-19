import styled, { keyframes } from 'styled-components';

const colors = {
  primary: '#4f46e5', // indigo-600
  secondary: '#2563eb', // blue-600
  dark: '#1e40af', // blue-800
  orange: '#f97316', // orange-500
  orangeSecondary: '#ea580c', // orange-600
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const hoverLift = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Hero Section Components
export const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.dark} 100%);
  overflow: hidden;
  background-image: url('https://readdy.ai/api/search-image?query=Modern%20university%20campus%20with%20students%20collaborating%20on%20digital%20devices%2C%20academic%20environment%20with%20books%20and%20technology%2C%20clean%20minimalist%20background%20in%20blue%20and%20orange%20tones%2C%20professional%20educational%20setting%20with%20natural%20lighting&width=1440&height=400&seq=hero-academic&orientation=landscape');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${colors.dark};
  opacity: 0.7;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const HeroMaxWidth = styled.div`
  max-width: 48rem;
`;

export const HeroTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${colors.white};
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(219, 234, 254, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

export const HeroButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: ${colors.orange};
    color: ${colors.white};

    &:hover {
      background: ${colors.orangeSecondary};
    }
  }

  &.secondary {
    background: transparent;
    color: ${colors.white};
    border: 2px solid ${colors.white};

    &:hover {
      background: ${colors.white};
      color: ${colors.primary};
    }
  }
`;