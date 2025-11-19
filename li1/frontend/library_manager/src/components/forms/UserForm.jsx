// src/components/forms/UserForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common/StyledComponents';

/**
 * Formulaire de création/modification d'utilisateur
 */
export const UserForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'student',
    password: '',
    confirmPassword: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!isEditing && !formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit faire au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Préparer les données pour l'API
      const submitData = { ...formData };
      if (!isEditing) {
        delete submitData.confirmPassword;
      } else {
        // En mode édition, ne pas envoyer le mot de passe s'il est vide
        if (!submitData.password) {
          delete submitData.password;
        }
        delete submitData.confirmPassword;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erreur soumission formulaire:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Nom complet *</Label>
        <Input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          $hasError={!!errors.name}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email *</Label>
        <Input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          $hasError={!!errors.email}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="role">Rôle *</Label>
        <Select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="student">Étudiant</option>
          <option value="professor">Professeur/Chercheur</option>
          <option value="librarian">Bibliothécaire</option>
          <option value="admin">Administrateur</option>
        </Select>
      </FormGroup>

      {!isEditing && (
        <>
          <FormGroup>
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              $hasError={!!errors.password}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              $hasError={!!errors.confirmPassword}
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </FormGroup>
        </>
      )}

      <FormActions>
        <Button 
          type="submit" 
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Création...' : isEditing ? 'Modifier' : 'Créer Utilisateur'}
        </Button>
      </FormActions>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => 
    props.$hasError ? props.theme.colors.error : props.theme.colors.gray[300]
  };
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => 
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary
    };
    box-shadow: 0 0 0 3px ${props => 
      props.$hasError ? props.theme.colors.error + '20' : props.theme.colors.primary + '20'
    };
  }

  &:disabled {
    background: ${props => props.theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 6px;
  font-size: 1rem;
  background: ${props => props.theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary + '20'};
  }
`;

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export default UserForm;