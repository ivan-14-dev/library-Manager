// src/styles/NavigationStyles.js
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Animation pour le logo tournant
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const NavContainer = styled.nav`
  background: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

export const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SpinningLogo = styled.img`
  width: 40px;
  height: 40px;
  animation: ${spin} 3s linear infinite;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

export const NavLink = styled(Link)`
  color: #1e40af;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #3b82f6;
  }
`;

export const CategoryDropdown = styled.div`
  position: relative;
  
  &:hover > div {
    display: block;
  }
`;

export const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 250px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem 0;
  z-index: 1001;
`;

export const CategoryGroup = styled.div`
  padding: 0.5rem 1rem;
`;

export const CategoryTitle = styled.h3`
  color: #1e40af;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
`;

export const SubCategory = styled.div`
  padding: 0.25rem 0;
`;

export const SubCategoryLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-size: 0.85rem;
  display: block;
  padding: 0.25rem 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: #3b82f6;
    background: #f8fafc;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: block;
    background: none;
    border: none;
    color: #1e40af;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  border: 1px solid #1e40af;
  border-radius: 6px;
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #1e40af;
    color: white;
  }
`;

export const SignupButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: #1e40af;
  border: none;
  border-radius: 6px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #3b82f6;
  }
`;