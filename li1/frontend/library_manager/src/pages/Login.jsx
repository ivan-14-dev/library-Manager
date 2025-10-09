import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const LoginContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;

  @media (max-width: 480px) {
    padding: 2rem;
    margin: 0 1rem;
  }
`;

const LoginHeader = styled.div`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
  }

  span {
    background: white;
    padding: 0 1rem;
    color: #6c757d;
    position: relative;
  }
`;

const RegisterLink = styled.div`
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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>Connexion</h1>
          <p>Accédez à votre espace personnel</p>
        </LoginHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <InputIcon>
              <FiMail />
            </InputIcon>
            <Input
              type="text"
              placeholder="Nom d'utilisateur ou email"
              className={errors.username ? 'error' : ''}
              {...register('username', {
                required: "Le nom d'utilisateur est requis",
              })}
            />
            {errors.username && (
              <ErrorMessage>{errors.username.message}</ErrorMessage>
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

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Connexion...' : (
              <>
                <FiLogIn /> Se connecter
              </>
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>Ou</span>
        </Divider>

        <RegisterLink>
          <p>Vous n'avez pas de compte ?</p>
          <Link to="/register">Créer un compte</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;