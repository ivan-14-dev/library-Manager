import React from 'react';
import styled from 'styled-components';
import { FiBook, FiHeart } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: #2c3e50;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  p {
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  a {
    color: white;
    opacity: 0.8;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    font-size: 1.5rem;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>
            <FiBook /> BiblioManager
          </h3>
          <p>Gestion complète de votre bibliothèque en ligne</p>
          <p>Accessible 24h/24, 7j/7</p>
        </FooterSection>

        <FooterSection>
          <h3>Liens rapides</h3>
          <p><a href="/books">Catalogue des livres</a></p>
          <p><a href="/about">À propos</a></p>
          <p><a href="/contact">Contact</a></p>
          <p><a href="/help">Aide</a></p>
        </FooterSection>

        <FooterSection>
          <h3>Contact</h3>
          <p>📧 contact@bibliomanager.fr</p>
          <p>📞 +33 1 23 45 67 89</p>
          <p>🏢 123 Rue de la Bibliothèque, Paris</p>
          
          <SocialLinks>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Horaires</h3>
          <p>Lun-Ven: 9h-18h</p>
          <p>Sam: 10h-16h</p>
          <p>Dim: Fermé</p>
          <p>Service en ligne: 24h/24</p>
        </FooterSection>
      </FooterContent>

      <Copyright>
        <FiHeart /> © 2024 BiblioManager. Tous droits réservés.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;