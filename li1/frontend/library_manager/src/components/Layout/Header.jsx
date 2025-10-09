import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiBook, FiBell, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 1rem;

    a, button {
      color: #333;
      width: 100%;
      text-align: left;
      padding: 0.5rem 0;
    }
  }
`;

const NavItem = styled(Link)`
  color: white;
  font-weight: 500;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    color: #333;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconButton = styled.button`
  background: none;
  color: white;
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    color: #333;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};

  a, button {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    color: #333;
    text-align: left;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f8f9fa;
    }
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated, isStudent, isProfessor, isLibrarian, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isLibrarian) return '/dashboard/librarian';
    if (isProfessor) return '/dashboard/professor';
    if (isStudent) return '/dashboard/student';
    return '/profile';
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <FiBook /> BiblioManager
        </Logo>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>

        <NavLinks isOpen={isMenuOpen}>
          <NavItem to="/books">Catalogue</NavItem>
          
          {isAuthenticated ? (
            <>
              <NavItem to="/personal-books">Mes Livres</NavItem>
              <NavItem to={getDashboardPath()}>Dashboard</NavItem>
              <NavItem to="/borrows">Mes emprunts</NavItem>
              
              <UserMenu>
                <IconButton onClick={() => navigate('/notifications')}>
                  <FiBell />
                  {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
                </IconButton>
                
                <IconButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <FiUser />
                </IconButton>
                
                <DropdownMenu isOpen={isDropdownOpen}>
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                    <FiUser /> Mon profil
                  </Link>
                  <button onClick={handleLogout}>
                    <FiLogOut /> Déconnexion
                  </button>
                </DropdownMenu>
              </UserMenu>
            </>
          ) : (
            <>
              <NavItem to="/login">Connexion</NavItem>
              <NavItem to="/register">Inscription</NavItem>
            </>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;