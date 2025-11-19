import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  blue,
  orange,
  lightBlue,
  orangeSecondary,
  darkBlue,
  darkOrange,
  accentBlue,
  primary,
  white,
  secondary,
  gray
} from './Header.styles';

export const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  color: ${primary};
  border: 2px solid ${primary};
  background: transparent;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: ${primary};
    color: ${white};
  }
`;

export const SignupButton = styled(Link)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${orange};
  color: ${white};
  border: 2px solid ${orange};
  text-decoration: none;
  text-align: center;

  &:hover {
    background: ${orangeSecondary};
    border-color: ${orangeSecondary};
  }
`;

export const UserMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  padding: 0.5rem 0;
`;

export const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${gray[700]};
  text-decoration: none;
  font-size: 0.875rem;
  gap: 0.75rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${gray[100]};
  }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${gray[200]};
  margin: 0.25rem 0;
`;

export const DropdownArrow = styled.div`
  position: absolute;
  top: -10px;
  right: 15px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
  filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.05));
`;

export const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;