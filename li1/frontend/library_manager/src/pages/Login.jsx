// src/pages/Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/StyledComponents';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithProvider } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');

    try {
      await loginWithProvider(provider);
      navigate('/');
    } catch (err) {
      setError(`Erreur lors de la connexion avec ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        {/* Section gauche - Illustration */}
        <LeftSection>
          <IllustrationContainer>
           <Illustration src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center" alt="Bibliothèque" />
           <IllustrationTitle>Bibliothèque Digitale</IllustrationTitle>
           <IllustrationSubtitle>
             Accédez à des milliers de livres et ressources numériques
             depuis votre espace personnel
           </IllustrationSubtitle>
         </IllustrationContainer>
        </LeftSection>

        {/* Section droite - Formulaire */}
        <RightSection>
          <LoginCard>
            <LoginHeader>
              <LoginTitle>Content de vous revoir !</LoginTitle>
              <LoginSubtitle>Connectez-vous à votre compte</LoginSubtitle>
            </LoginHeader>

            {/* Boutons de connexion sociale */}
            <SocialLoginSection>
              <SocialButton
                type="button"
                variant="google"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <SocialIcon src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
                Google
              </SocialButton>

              <SocialButton
                type="button"
                variant="github"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
              >
                <SocialIcon src="https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg" alt="GitHub" />
                GitHub
              </SocialButton>
            </SocialLoginSection>

            <Divider>
              <DividerLine />
              <DividerText>Ou continuer avec email</DividerText>
              <DividerLine />
            </Divider>

            {/* Formulaire de connexion par email */}
            <LoginForm onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <FormGroup>
                <Label>Adresse email</Label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  placeholder="entrez votre email"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="votre mot de passe"
                  required
                />
              </FormGroup>

              <FormOptions>
                <RememberMe>
                  <Checkbox type="checkbox" id="remember" />
                  <CheckboxLabel htmlFor="remember">Se souvenir de moi</CheckboxLabel>
                </RememberMe>
                <ForgotPasswordLink to="/forgot-password">
                  Mot de passe oublié ?
                </ForgotPasswordLink>
              </FormOptions>

              <LoginButton type="submit" variant="primary" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </LoginButton>
            </LoginForm>

            <LoginFooter>
              <FooterText>
                Pas encore de compte ? <FooterLink to="/register">Créer un compte</FooterLink>
              </FooterText>
            </LoginFooter>
          </LoginCard>
        </RightSection>
      </LoginWrapper>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const LoginWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: ${props => props.theme.colors.white};
  border-radius: 20px;
  box-shadow: ${props => props.theme.shadows.xl};
  overflow: hidden;
  min-height: 600px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const LeftSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

const IllustrationContainer = styled.div`
  text-align: center;
  color: white;
  max-width: 400px;
`;

const Illustration = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
  opacity: 0.9;
  object-fit: cover;
  border-radius: 10px;
`;

const IllustrationTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  opacity: 0.95;
`;

const IllustrationSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
  line-height: 1.6;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: 0.5rem;
`;

const LoginSubtitle = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.95rem;
`;

const SocialLoginSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.gray[50]};
    border-color: ${props => props.theme.colors.gray[400]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SocialIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${props => props.theme.colors.gray[300]};
`;

const DividerText = styled.span`
  padding: 0 1rem;
  color: ${props => props.theme.colors.gray[500]};
  font-size: 0.875rem;
  background: ${props => props.theme.colors.white};
`;

const LoginForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  accent-color: ${props => props.theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  color: ${props => props.theme.colors.gray[600]};
  cursor: pointer;
`;

const ForgotPasswordLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  justify-content: center;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}10;
  color: ${props => props.theme.colors.error};
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.error}20;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

const LoginFooter = styled.div`
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
`;

const FooterText = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.9rem;
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export default Login;