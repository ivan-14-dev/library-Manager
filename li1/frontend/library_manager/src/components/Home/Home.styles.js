import styled, { keyframes } from 'styled-components';

// Academic Hub Color Scheme
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

// Container Components
export const HomeContainer = styled.div`
  min-height: 100vh;
  background: ${colors.white};
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`;

export const MainContent = styled.main`
  padding-top: 7rem; /* Account for fixed header */
`;

// Header Components
export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: ${colors.white};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

export const HeaderMain = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const HeaderFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary};

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

export const LogoSubtitle = styled.p`
  font-size: 0.75rem;
  color: ${colors.orange};
  margin-top: -0.25rem;
`;

export const SearchSection = styled.div`
  flex: 1;
  max-width: 28rem;
  margin-left: 2rem;
  margin-right: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid ${colors.gray[300]};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

export const SearchIcon = styled.i`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.gray[400]};
  font-size: 0.875rem;
`;

export const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const AuthButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &.login {
    color: ${colors.primary};
    border: 2px solid ${colors.primary};
    background: transparent;

    &:hover {
      background: ${colors.primary};
      color: ${colors.white};
    }
  }

  &.signup {
    background: ${colors.orange};
    color: ${colors.white};
    border: 2px solid ${colors.orange};

    &:hover {
      background: ${colors.orangeSecondary};
      border-color: ${colors.orangeSecondary};
    }
  }
`;

export const NavContainer = styled.nav`
  background: ${colors.gray[50]};
  border-top: 1px solid ${colors.gray[200]};
`;

export const NavMain = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const NavFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 3rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export const NavLink = styled.a`
  color: ${colors.secondary};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    color: ${colors.primary};
    background: rgba(255, 255, 255, 0.5);
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

// Section Components
export const Section = styled.section`
  padding: 4rem 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const SectionContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.gray[900]};
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${colors.gray[600]};
`;

// Academic Domains Components
export const DomainsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const DomainCard = styled.div`
  background: ${colors.white};
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
`;

export const DomainIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;

  &.blue {
    background: rgba(79, 70, 229, 0.1);
  }

  &.orange {
    background: rgba(249, 115, 22, 0.1);
  }

  &.green {
    background: rgba(34, 197, 94, 0.1);
  }

  &.purple {
    background: rgba(147, 51, 234, 0.1);
  }
`;

export const DomainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

export const DomainTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin-bottom: 0.5rem;
`;

export const DomainTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const DomainTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${colors.gray[100]};
  color: ${colors.gray[700]};
  border-radius: 0.25rem;
`;

export const DomainDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  margin-bottom: 1rem;
`;

export const DomainCount = styled.span`
  font-size: 0.875rem;
  font-weight: 500;

  &.blue {
    color: ${colors.primary};
  }

  &.orange {
    color: ${colors.orange};
  }

  &.green {
    color: #10b981;
  }

  &.purple {
    color: #8b5cf6;
  }
`;

// Publications Components
export const PublicationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const PublicationCard = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
`;

export const PublicationImage = styled.div`
  height: 12rem;
  background: ${colors.gray[100]};
  overflow: hidden;
`;

export const PublicationImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

export const PublicationContent = styled.div`
  padding: 1.5rem;
`;

export const PublicationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const PublicationBadge = styled.span`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;

  &.premium {
    background: ${colors.orange};
    color: ${colors.white};
  }

  &.public {
    background: #10b981;
    color: ${colors.white};
  }

  &.private {
    background: ${colors.primary};
    color: ${colors.white};
  }
`;

export const PublicationRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  color: #fbbf24;
`;

export const PublicationTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin-bottom: 0.5rem;
`;

export const PublicationDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray[600]};
  margin-bottom: 1rem;
`;

export const PublicationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PublicationAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AuthorIcon = styled.i`
  color: ${colors.primary};
`;

export const AuthorName = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray[700]};
`;

export const PublicationViews = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray[500]};
`;

// Stats Components
export const StatsSection = styled.section`
  padding: 4rem 0;
  background: ${colors.primary};
`;

export const StatsContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const StatsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const StatsTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.white};
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

export const StatsSubtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(219, 234, 254, 0.9);
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatNumber = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${colors.orange};
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

export const StatLabel = styled.div`
  color: rgba(219, 234, 254, 0.9);
`;

// Tools Components
export const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ToolCard = styled.div`
  background: ${colors.white};
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
`;

export const ToolIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;

  &.blue {
    background: rgba(79, 70, 229, 0.1);
    color: ${colors.primary};
  }

  &.orange {
    background: rgba(249, 115, 22, 0.1);
    color: ${colors.orange};
  }

  &.green {
    background: rgba(34, 197, 94, 0.1);
    color: #10b981;
  }
`;

export const ToolTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.gray[900]};
  margin-bottom: 0.75rem;
`;

export const ToolDescription = styled.p`
  color: ${colors.gray[600]};
  margin-bottom: 1.5rem;
`;

export const ToolButton = styled.button`
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &.blue {
    background: ${colors.primary};
    color: ${colors.white};

    &:hover {
      background: ${colors.secondary};
    }
  }

  &.orange {
    background: ${colors.orange};
    color: ${colors.white};

    &:hover {
      background: ${colors.orangeSecondary};
    }
  }

  &.green {
    background: #10b981;
    color: ${colors.white};

    &:hover {
      background: #059669;
    }
  }
`;

// Footer Components
export const FooterContainer = styled.footer`
  background: ${colors.gray[900]};
  color: ${colors.white};
  padding: 3rem 0;
`;

export const FooterContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FooterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FooterLink = styled.a`
  color: ${colors.gray[300]};
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    color: ${colors.white};
  }
`;

export const FooterPayment = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${colors.gray[300]};
  font-size: 0.875rem;
`;

export const FooterBottom = styled.div`
  border-top: 1px solid ${colors.gray[700]};
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
`;

export const FooterCopyright = styled.p`
  color: ${colors.gray[400]};
  font-size: 0.875rem;
`;

