import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #ffffff;
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FooterTitle = styled.h3`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FooterLink = styled.a`
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

export const FooterPayment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const PaymentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
  font-size: 0.875rem;
  
  i {
    color: #3b82f6;
    width: 20px;
  }
`;

export const FooterBottom = styled.div`
  border-top: 1px solid #374151;
  padding-top: 1.5rem;
  text-align: center;
`;

export const FooterCopyright = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
`;

