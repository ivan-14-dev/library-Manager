// src/components/Categories/Category.styles.js
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Mega Menu Desktop
export const MegaMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 800px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 0;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  z-index: 1000;
  animation: ${fadeInUp} 0.3s ease;
  font-family: 'Inter', sans-serif;
`;

export const MegaMenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

export const CategoryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CategoryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #2563eb;
  font-family: 'Playfair Display', serif;
`;

export const SubcategoryGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const SubcategoryTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SubcategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SubcategoryItem = styled.div`
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4b5563;
  border: 1px solid transparent;
  background: rgba(249, 250, 251, 0.5);

  &:hover {
    color: #2563eb;
    background: rgba(37, 99, 235, 0.05);
    border-color: rgba(37, 99, 235, 0.2);
    transform: translateX(5px);
  }
`;

// Mobile Menu
export const MobileCategoryMenu = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-top: 1px solid rgba(37, 99, 235, 0.1);
  animation: ${slideInLeft} 0.3s ease;
  font-family: 'Inter', sans-serif;
`;

export const MobileCategorySection = styled.div`
  border-bottom: 1px solid rgba(37, 99, 235, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const MobileCategoryHeader = styled.div`
  padding: 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  background: rgba(249, 250, 251, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Playfair Display', serif;

  &:hover {
    background: rgba(37, 99, 235, 0.05);
  }
`;

export const MobileSubcategoryList = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
`;

// Quick Access Categories
export const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
`;

export const QuickAccessItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(37, 99, 235, 0.3);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

export const QuickAccessIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  transition: all 0.3s ease;

  ${QuickAccessItem}:hover & {
    background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
    transform: scale(1.1);
  }
`;

export const QuickAccessLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Inter', sans-serif;
`;