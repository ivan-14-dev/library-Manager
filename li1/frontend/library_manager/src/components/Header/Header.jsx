import React, { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { useAuth } from '../../context/AuthContext';
import {
  HeaderContainer,
  HeaderMain,
  HeaderFlex,
  LogoSection,
  Logo,
  LogoSubtitle,
  SearchSection,
  SearchContainer,
  SearchInput,
  SearchIcon,
  AuthSection,
  NavContainer,
  NavMain,
  NavFlex,
  NavLink,
  SearchIconButton,
  MobileMenuButton,
  MobileMenu,
  MobileMenuOverlay,
  MobileNavLink
} from './Header.styles';

const Header = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      // Hide search bar when scrolling
      if (scrollTop > 100) {
        setShowSearch(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation en haut */}
      <NavContainer style={{
        backgroundColor: isScrolled ? 'white' : 'rgba(0, 0, 0, 0.9)',
        borderBottomColor: isScrolled ? '#e5e7eb' : 'rgba(255, 255, 255, 0.3)',
        transition: 'all 0.3s ease-in-out'
      }}>
        <NavMain>
          <NavFlex>
            <LogoSection style={{ marginRight: 'auto' }}>
              <Logo>
                <span style={{ color: isScrolled ? '#2563eb' : 'white' }}>Ac.</span>
                <span style={{
                  backgroundColor: isScrolled ? '#f97316' : 'white',
                  color: isScrolled ? 'white' : '#f97316',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginLeft: '4px'
                }}>Hub</span>
              </Logo>
            </LogoSection>
            <NavLink href="#" style={{
              color: isScrolled ? '#374151' : 'white'
            }}>Catégories</NavLink>
            <NavLink href="#" style={{
              color: isScrolled ? '#374151' : 'white'
            }}>Auteurs</NavLink>
            <NavLink href="" style={{
              color: isScrolled ? '#374151' : 'white'
            }}>Articles</NavLink>
            <NavLink href="#" style={{
              color: isScrolled ? '#374151' : 'white'
            }}>E-books</NavLink>
            <NavLink href="#" style={{
              color: isScrolled ? '#374151' : 'white'
            }}>Thèses</NavLink>
            <NavLink href="#" style={{
              color: isScrolled ? '#374151' : 'white'
            }}>Open Source</NavLink>
            <AuthSection style={{ marginLeft: 'auto' }}>
              <SearchIconButton
                onClick={toggleSearch}
                style={{
                  color: isScrolled ? '#2563eb' : 'white',
                  marginRight: '1rem'
                }}
              >
                <i className="fas fa-search" />
              </SearchIconButton>
              <UserMenu user={user} />
              <MobileMenuButton onClick={toggleMobileMenu}>
                <i className="fas fa-bars" />
              </MobileMenuButton>
            </AuthSection>
          </NavFlex>
        </NavMain>
      </NavContainer>

      {/* Barre de recherche en dessous - conditionnelle */}
      {showSearch && (
        <HeaderContainer style={{
          backdropFilter: isScrolled ? 'none' : 'blur(15px)',
          backgroundColor: isScrolled ? 'white' : 'rgba(0, 0, 0, 0.9)',
          transition: 'all 0.3s ease-in-out',
          padding: '0.5rem 0'
        }}>
          <HeaderMain>
            <HeaderFlex style={{ justifyContent: 'center' }}>
              <SearchSection>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="Rechercher des publications, auteurs, thèses..."
                    style={{
                      borderColor: isScrolled ? '#d1d5db' : 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: isScrolled ? 'white' : 'rgba(255, 255, 255, 0.1)',
                      color: isScrolled ? '#374151' : 'white',
                      width: '400px' // Réduit la largeur
                    }}
                  />
                  <SearchIcon className="fas fa-search" style={{
                    color: isScrolled ? '#9ca3af' : 'rgba(255, 255, 255, 0.7)'
                  }} />
                </SearchContainer>
              </SearchSection>
            </HeaderFlex>
          </HeaderMain>
        </HeaderContainer>
      )}

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />

      {/* Mobile Menu Sidebar */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <div style={{ padding: '1rem' }}>
          <MobileNavLink to="/" onClick={closeMobileMenu}>Accueil</MobileNavLink>
          <MobileNavLink to="/catalog" onClick={closeMobileMenu}>Catalogue</MobileNavLink>
          <MobileNavLink to="/categories" onClick={closeMobileMenu}>Catégories</MobileNavLink>
          <MobileNavLink to="/authors" onClick={closeMobileMenu}>Auteurs</MobileNavLink>
          <MobileNavLink to="/articles" onClick={closeMobileMenu}>Articles</MobileNavLink>
          <MobileNavLink to="/ebooks" onClick={closeMobileMenu}>E-books</MobileNavLink>
          <MobileNavLink to="/theses" onClick={closeMobileMenu}>Thèses</MobileNavLink>
          <MobileNavLink to="/opensource" onClick={closeMobileMenu}>Open Source</MobileNavLink>
          <MobileNavLink to="/login" onClick={closeMobileMenu}>Connexion</MobileNavLink>
          <MobileNavLink to="/register" onClick={closeMobileMenu}>Inscription</MobileNavLink>
        </div>
      </MobileMenu>
    </>
  );
};

export default Header;