import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBook } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';


// Container for register page
const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
`;

// Card
const RegisterCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ed8936, #dd6b20);
    border-radius: 20px 20px 0 0;
  }

  @media (max-width: 480px) {
    padding: 2rem;
    margin: 0 1rem;
  }
`;

// Header
const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #1a365d;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    color: #4a5568;
    font-size: 0.95rem;
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
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    border-color: #ed8936;
    outline: none;
    box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.1);
    background: white;
  }

  &.error {
    border-color: #e53e3e;
    background: #fed7d7;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ed8936;
    outline: none;
    box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.1);
    background: white;
  }

  &.error {
    border-color: #e53e3e;
    background: #fed7d7;
  }

  option {
    background: white;
    color: #2d3748;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ed8936;
  font-size: 1.1rem;
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
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(237, 137, 54, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #dd6b20 0%, #c05621 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(237, 137, 54, 0.4);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;

  p {
    color: #4a5568;
  }

  a {
    color: #ed8936;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
      color: #dd6b20;
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
          <h1>Sign Up</h1>
          <p>Create your account to access the library</p>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <Input
                type="text"
                placeholder="First Name"
                className={errors.first_name ? 'error' : ''}
                {...register('first_name', {
                  required: 'First name is required',
                })}
              />
              {errors.first_name && (
                <ErrorMessage>{errors.first_name.message}</ErrorMessage>
              )}
            </InputGroup>

            <InputGroup>
              <Input
                type="text"
                placeholder="Last Name"
                className={errors.last_name ? 'error' : ''}
                {...register('last_name', {
                  required: 'Last name is required',
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
              placeholder="Username"
              className={errors.username ? 'error' : ''}
              {...register('username', {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
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
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
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
                required: 'Role is required',
              })}
            >
              <option value="">Select your role</option>
              <option value="STUDENT">Student</option>
              <option value="PROFESSOR">Professor</option>
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
              placeholder="Password"
              className={errors.password ? 'error' : ''}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
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
              placeholder="Confirm Password"
              className={errors.password_confirmation ? 'error' : ''}
              {...register('password_confirmation', {
                required: 'Please confirm your password',
                validate: value =>
                  value === password || 'Passwords do not match',
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
            {loading ? 'Signing Up...' : "Sign Up"}
          </SubmitButton>
        </Form>

        <LoginLink>
          <p>Already have an account?</p>
          <Link to="/login">Sign In</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;