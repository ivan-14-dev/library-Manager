// src/components/Header/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  UserMenuContainer,
  UserAvatar,
  UserDropdown,
  DropdownItem,
  DropdownDivider,
  AuthButtons,
  LoginButton,
  SignupButton,
  DropdownArrow
} from './Header.styles';

const UserMenu = ({ user }) => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion');
    setIsOpen(false);
  };

  if (!user) {
    return (
      <AuthButtons>
        <LoginButton to="/login">
          Connexion
        </LoginButton>
        <SignupButton to="/register">
          Inscription
        </SignupButton>
      </AuthButtons>
    );
  }

  return (
    <UserMenuContainer ref={dropdownRef}>
      <UserAvatar onClick={() => setIsOpen(!isOpen)}>
        <FiUser />
        <FiChevronDown style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }} />
      </UserAvatar>

      {isOpen && (
        <>
          <DropdownArrow />
          <UserDropdown>
            <DropdownItem to="/profile">
              <FiUser />
              Mon Profil
            </DropdownItem>
            <DropdownItem to="/settings">
              <FiSettings />
              Paramètres
            </DropdownItem>

            <DropdownItem to= "/personal-editor">
              <FiSettings />
              Editeur
            </DropdownItem>

            <DropdownItem to="/dashboard">
              <FiSettings />
              Dashboard
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem as="button" onClick={handleLogout}>
              <FiLogOut />
              Déconnexion
            </DropdownItem>
          </UserDropdown>
        </>
      )}
    </UserMenuContainer>
  );
};

export default UserMenu;