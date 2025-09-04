import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMap, FiCalendar, FiSave, FiEdit } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const ProfileContainer = styled.div`
  padding: 2rem 0;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  margin: 0 auto 1rem;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

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

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      date_of_birth: user?.date_of_birth || '',
      email_notifications: user?.email_notifications || true,
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'STUDENT': 'Étudiant',
      'PROFESSOR': 'Professeur',
      'LIBRARIAN': 'Bibliothécaire',
      'ADMIN': 'Administrateur',
      'VISITOR': 'Visiteur'
    };
    return roleMap[role] || role;
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <ProfileContainer className="container">
      <ProfileHeader>
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles</p>
      </ProfileHeader>

      <ProfileCard>
        <AvatarSection>
          <Avatar>
            <FiUser />
          </Avatar>
          <h2>{user.first_name} {user.last_name}</h2>
          <RoleBadge>{getRoleDisplay(user.role)}</RoleBadge>
          <p>Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
        </AvatarSection>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <InputGroup>
              <Label>Prénom</Label>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <Input
                type="text"
                disabled={!isEditing}
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
              <Label>Nom</Label>
              <Input
                type="text"
                disabled={!isEditing}
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
            <Label>Email</Label>
            <InputIcon>
              <FiMail />
            </InputIcon>
            <Input
              type="email"
              disabled={!isEditing}
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
            <Label>Téléphone</Label>
            <InputIcon>
              <FiPhone />
            </InputIcon>
            <Input
              type="tel"
              disabled={!isEditing}
              className={errors.phone ? 'error' : ''}
              {...register('phone')}
            />
            {errors.phone && (
              <ErrorMessage>{errors.phone.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>Adresse</Label>
            <InputIcon>
              <FiMap />
            </InputIcon>
            <Textarea
              disabled={!isEditing}
              className={errors.address ? 'error' : ''}
              {...register('address')}
            />
            {errors.address && (
              <ErrorMessage>{errors.address.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>Date de naissance</Label>
            <InputIcon>
              <FiCalendar />
            </InputIcon>
            <Input
              type="date"
              disabled={!isEditing}
              className={errors.date_of_birth ? 'error' : ''}
              {...register('date_of_birth')}
            />
            {errors.date_of_birth && (
              <ErrorMessage>{errors.date_of_birth.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>
              <input
                type="checkbox"
                disabled={!isEditing}
                {...register('email_notifications')}
              />
              Recevoir les notifications par email
            </Label>
          </InputGroup>

          <ButtonGroup>
            {!isEditing ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit /> Modifier le profil
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : (
                    <>
                      <FiSave /> Enregistrer
                    </>
                  )}
                </button>
              </>
            )}
          </ButtonGroup>
        </Form>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;