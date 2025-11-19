import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterGrid,
  FooterSection,
  FooterTitle,
  FooterLinks,
  FooterLink,
  FooterPayment,
  PaymentItem,
  FooterBottom,
  FooterCopyright
} from './Footer.styles';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>Academic Hub</FooterTitle>
            <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Plateforme universitaire intelligente pour ICT University. Publiez, partagez et collaborez en toute sécurité.
            </p>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Navigation</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">Catégories</FooterLink>
              <FooterLink href="#">Auteurs</FooterLink>
              <FooterLink href="#">Articles</FooterLink>
              <FooterLink href="#">E-books</FooterLink>
              <FooterLink href="#">Thèses</FooterLink>
            </FooterLinks>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Support</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">Centre d'aide</FooterLink>
              <FooterLink href="#">Conditions d'utilisation</FooterLink>
              <FooterLink href="#">Politique de confidentialité</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </FooterLinks>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Moyens de Paiement</FooterTitle>
            <FooterPayment>
              <PaymentItem>
                <i className="fab fa-cc-mastercard" /> Cartes bancaires
              </PaymentItem>
              <PaymentItem>
                <i className="fas fa-mobile-alt" /> Orange Money
              </PaymentItem>
              <PaymentItem>
                <i className="fas fa-mobile-alt" /> MTN Money
              </PaymentItem>
            </FooterPayment>
          </FooterSection>
        </FooterGrid>
        <FooterBottom>
          <FooterCopyright>© 2025 Academic Hub - ICT University. Tous droits réservés.</FooterCopyright>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;