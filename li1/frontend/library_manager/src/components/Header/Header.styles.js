// src/components/Header/Header.styles.js
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

// Colors - Updated to match the design reference
const blue = '#1a365d'; // Dark blue
const orange = '#ed8936'; // Warm orange
const lightBlue = '#f7fafc';
const orangeSecondary = '#fef5e7';
const darkBlue = '#2d3748';
const darkOrange = '#dd6b20';
const accentBlue = '#3182ce';
const primary = '#f6ad55';
const white = '#ffffff'
const secondary = '#fef5e7'

const gray = {
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

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;



// Search Section
export const SearchSection = styled.div`
  max-width: 600px;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${blue};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  outline: none;
  font-size: 0.95rem;
  background: transparent;

  &::placeholder {
    color: #94a3b8;
  }
`;

export const SearchButton = styled.button`
  background: linear-gradient(135deg, ${blue}, ${orange});
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, ${darkBlue}, ${darkOrange});
  }

  svg {
    font-size: 1.1rem;
  }
`;

export const SearchIconButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// User Section
export const UserSection = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 1.5rem;
`;

export const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 0.8rem;

  &:hover {
    background: ${lightBlue};
    color: ${blue};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

// Navigation - Now in Main Header
export const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled.div`
  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    display: block;
    font-size: 0.9rem;

    &:hover {
      color: ${orange};
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

// Dropdown Menu
export const DropdownMenu = styled.div`
  position: relative;
`;

export const DropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover {
    color: ${orange};
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    font-size: 0.8rem;
    transition: transform 0.3s ease;
  }
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$isOpen ? '0' : '-10px'});
  transition: all 0.3s ease;
  z-index: 1000;
  margin-top: 8px;
`;

export const DropdownColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DropdownTitle = styled.h3`
  color: ${blue};
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${accentBlue};
`;

export const DropdownLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;

  &:hover {
    color: ${blue};
    padding-left: 1rem;
    border-bottom-color: ${lightBlue};
  }

  ${props => props.$isSubHeader && css`
    color: ${orange};
    font-weight: 600;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  `}
`;

// User Menu
export const UserMenuContainer = styled.div`
  position: relative;
`;

export const UserAvatar = styled.div`
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, ${blue}, ${orange});
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    transform: scale(1.1);
    animation: ${pulse} 1s ease-in-out;
  }

  svg {
    font-size: 1.3rem;
  }
`;

export const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
`;

export const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    color: ${blue};
  }

  svg {
    font-size: 1rem;
  }

  ${props => props.as === 'button' && css`
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
  `}
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
`;

// Auth Buttons
export const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: transparent;
  color: ${blue};
  border: 2px solid ${blue};
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    background: ${blue};
    color: white;
    transform: translateY(-1px);
  }
`;

export const SignupButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: ${orange};
  color: white;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    background: ${blue};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

export const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Mobile Menu Button
export const MobileMenuButton = styled.button`
  display: none;
  background: linear-gradient(135deg, ${blue}, ${orange});
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    background: linear-gradient(135deg, ${darkBlue}, ${darkOrange});
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Mobile Menu
export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.3s ease-out;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
  padding-top: 4rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

// Mobile Menu Overlay
export const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 999;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileNavLink = styled(Link)`
  display: block;
  padding: 1rem 2rem;
  color: #374151;
  text-decoration: none;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    background: ${lightBlue};
    color: ${accentBlue};
    padding-left: 2.5rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

// Mobile Dropdown
export const MobileDropdown = styled.div`
  border-bottom: 1px solid #f1f5f9;
`;

export const MobileDropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: ${lightBlue};
    color: ${blue};
  }

  svg {
    font-size: 1rem;
    transition: transform 0.3s ease;
  }
`;

export const MobileDropdownContent = styled.div`
  background: #f8fafc;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  animation: ${slideDown} 0.3s ease-out;
`;

export const MobileDropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 3rem;
  color: ${props => props.$isHeader ? blue : props.$isSubHeader ? orange : '#374151'};
  text-decoration: none;
  font-weight: ${props => props.$isHeader || props.$isSubHeader ? '600' : '400'};
  font-size: 0.85rem;

  &:hover {
    color: ${accentBlue};
  }
  border-bottom: ${props => props.$isHeader ? '1px solid rgba(37, 99, 235, 0.1)' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    background: ${lightBlue};
    color: ${blue};
    padding-left: 3.5rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;






// Header Components
export const HeaderContainer = styled.header`
  position: fixed;
  top: 3rem; /* Adjusted to appear below NavContainer */
  left: 0;
  right: 0;
  z-index: 50;
  background: ${white};
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
  color: ${primary};
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: -0.025em;

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }

  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
`;

export const LogoSubtitle = styled.p`
  font-size: 0.75rem;
  color: ${orange};
  margin-top: -0.25rem;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
`;



export const SearchContainer = styled.div`
  position: relative;
`;


export const SearchIcon = styled.i`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${gray[400]};
  font-size: 0.875rem;
`;




export const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  background: ${gray[50]};
  border-top: 1px solid ${gray[200]};
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
    justify-content: space-between;
  }
`;

export const NavLink = styled.a`
  color: ${secondary};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    color: ${primary};
    background: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
`;

export const DropdownArrow = styled.span`
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
`;