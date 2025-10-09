import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBook } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';


// contener du  register 
const RegisterContainer = styled.div`       
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

// card
const RegisterCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 500px;

  @media (max-width: 480px) {
    padding: 2rem;
    margin: 0 1rem;
  }
`;

// L'entete
const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6c757d;
  }
`;

// le formulaire
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// 
const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;


const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  color: #6c757d;
  padding: 0;
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;

  p {
    color: #6c757d;
  }

  a {
    color: #007bff;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Fonction principale de creation de compte
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);  // Verifier si le password peut est accepter ou pas
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // Confirmation du password avec le password initiale
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/');
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <h1>Inscription</h1>
          <p>Créez votre compte pour accéder à la bibliothèque</p>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <Input
                type="text"
                placeholder="Prénom"
                className={errors.first_name ? 'error' : ''}
                {...register('first_name', {
                  required: 'Le prénom est requis',
                })}
              />
              {errors.first_name && (
                <ErrorMessage>{errors.first_name.message}</ErrorMessage>
              )}
            </InputGroup>

            <InputGroup>
              <Input
                type="text"
                placeholder="Nom"
                className={errors.last_name ? 'error' : ''}
                {...register('last_name', {
                  required: 'Le nom est requis',
                })}
              />
              {errors.last_name && (
                <ErrorMessage>{errors.last_name.message}</ErrorMessage>
              )}
            </InputGroup>
          </FormRow>

          <InputGroup>
            <InputIcon>
              <FiUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Nom d'utilisateur"
              className={errors.username ? 'error' : ''}
              {...register('username', {
                required: "Le nom d'utilisateur est requis",
                minLength: {
                  value: 3,
                  message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
                },
              })}
            />
            {errors.username && (
              <ErrorMessage>{errors.username.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FiMail />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email"
              className={errors.email ? 'error' : ''}
              {...register('email', {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide',
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FiBook />
            </InputIcon>
            <Select
              className={errors.role ? 'error' : ''}
              {...register('role', {
                required: 'Le rôle est requis',
              })}
            >
              <option value="">Sélectionnez votre rôle</option>
              <option value="STUDENT">Étudiant</option>
              <option value="PROFESSOR">Professeur</option>
            </Select>
            {errors.role && (
              <ErrorMessage>{errors.role.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              className={errors.password ? 'error' : ''}
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères',
                },
              })}
            />
            <TogglePassword
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </TogglePassword>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmer le mot de passe"
              className={errors.password_confirmation ? 'error' : ''}
              {...register('password_confirmation', {
                required: 'Veuillez confirmer votre mot de passe',
                validate: value =>
                  value === password || 'Les mots de passe ne correspondent pas',
              })}
            />
            <TogglePassword
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </TogglePassword>
            {errors.password_confirmation && (
              <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
            )}
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </SubmitButton>
        </Form>

        <LoginLink>
          <p>Vous avez déjà un compte ?</p>
          <Link to="/login">Se connecter</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;