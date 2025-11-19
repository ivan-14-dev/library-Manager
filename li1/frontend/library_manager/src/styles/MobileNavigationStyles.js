// src/styles/MobileNavigationStyles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  padding: 1rem;
  overflow-y: auto;
  z-index: 999;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

export const MobileNavLink = styled(Link)`
  display: block;
  padding: 1rem;
  color: #1e40af;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

export const MobileCategoryButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 1rem;
  background: none;
  border: none;
  color: #1e40af;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;

  &:focus {
    outline: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

export const MobileSubMenu = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  padding-left: 1rem;
  background: #f8fafc;
`;

export const MobileSubCategory = styled.div`
  padding: 0.5rem 1rem;
  color: #4b5563;
  font-size: 1rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;