import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiSave, FiEye, FiCode, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import TextEditor from '../components/Editor/TextEditor.jsx';
import MarkdownPreview from '../components/Editor/MarkdownPreview.jsx';
import { booksAPI } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

const EditorContainer = styled.div`
  padding: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  color: #007bff;
  font-weight: 500;
  padding: 0.5rem 0;

  &:hover {
    color: #0056b3;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
`;

const EditorLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const EditorColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

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
  color: #495057;
`;

const Input = styled.input`
  padding: 0.75rem;
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

const Textarea = styled.textarea`
  padding: 0.75rem;
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

  &.error {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    margin: 0;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
    border-color: ${props => props.active ? '#0056b3' : '#007bff'};
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed #e9ecef;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #007bff;
  }

  input {
    display: none;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  margin-top: 1rem;

  img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 0.5rem;
  }
`;

const RemoveImage = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #dc3545;
  }
`;

const PersonalBookEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  const { data: book, isLoading } = useQuery({
    queryKey: ['personal-book', id],
    queryFn: () => booksAPI.getPersonalBook(id),
    enabled: isEditing && !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const contentValue = watch('content', '');

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (book) {
      setValue('title', book.title);
      setValue('content', book.content);
      setValue('summary', book.summary);
      setValue('status', book.status);
      setValue('is_public', book.is_public);
      if (book.cover_image) {
        setCoverPreview(book.cover_image);
      }
    }
  }, [book, setValue]);

  const createMutation = useMutation({
    mutationFn: (bookData) => booksAPI.createPersonalBook(bookData),
    onSuccess: () => {
      toast.success('Livre créé avec succès!');
      queryClient.invalidateQueries({ queryKey: ['personal-books'] });
      navigate('/personal-books');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (bookData) => booksAPI.updatePersonalBook(id, bookData),
    onSuccess: () => {
      toast.success('Livre mis à jour avec succès!');
      queryClient.invalidateQueries({ queryKey: ['personal-book', id] });
      queryClient.invalidateQueries({ queryKey: ['personal-books'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setCoverPreview('');
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour enregistrer votre livre');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('summary', data.summary);
    formData.append('status', data.status);
    formData.append('is_public', data.is_public);
    
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  if (isLoading && isEditing) {
    return (
      <EditorContainer className="container">
        <div className="loading">Chargement...</div>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer className="container">
      <Header>
        <BackButton onClick={() => navigate('/personal-books')}>
          <FiArrowLeft /> Retour à mes livres
        </BackButton>
        
        <Title>
          {isEditing ? 'Modifier mon livre' : 'Écrire un nouveau livre'}
        </Title>
        
        <div></div> {/* Empty div for spacing */}
      </Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>Titre *</Label>
          <Input
            type="text"
            className={errors.title ? 'error' : ''}
            {...register('title', {
              required: 'Le titre est requis',
              minLength: {
                value: 3,
                message: 'Le titre doit contenir au moins 3 caractères',
              },
            })}
            placeholder="Titre de votre livre"
          />
          {errors.title && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Résumé</Label>
          <Textarea
            className={errors.summary ? 'error' : ''}
            {...register('summary')}
            placeholder="Résumé de votre livre (optionnel)"
            rows={3}
          />
        </FormGroup>

        <FormGroup>
          <Label>Image de couverture</Label>
          {coverPreview ? (
            <ImagePreview>
              <img src={coverPreview} alt="Aperçu de la couverture" />
              <RemoveImage type="button" onClick={removeImage}>
                <FiX />
              </RemoveImage>
            </ImagePreview>
          ) : (
            <ImageUpload>
              <FiUpload size={24} />
              <p>Cliquez pour télécharger une image de couverture</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </ImageUpload>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Contenu *</Label>
          <ViewToggle>
            <ToggleButton
              type="button"
              active={viewMode === 'edit'}
              onClick={() => setViewMode('edit')}
            >
              <FiCode /> Éditer
            </ToggleButton>
            <ToggleButton
              type="button"
              active={viewMode === 'preview'}
              onClick={() => setViewMode('preview')}
            >
              <FiEye /> Prévisualiser
            </ToggleButton>
          </ViewToggle>

          {viewMode === 'edit' ? (
            <TextEditor
              value={contentValue}
              onChange={(value) => setValue('content', value)}
              placeholder="Commencez à écrire votre histoire ici..."
            />
          ) : (
            <MarkdownPreview content={contentValue} />
          )}
          
          {errors.content && (
            <ErrorMessage>{errors.content.message}</ErrorMessage>
          )}
        </FormGroup>

        <EditorLayout>
          <EditorColumn>
            <FormGroup>
              <Label>Statut *</Label>
              <Select
                className={errors.status ? 'error' : ''}
                {...register('status', {
                  required: 'Le statut est requis',
                })}
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
                <option value="ARCHIVED">Archivé</option>
              </Select>
              {errors.status && (
                <ErrorMessage>{errors.status.message}</ErrorMessage>
              )}
            </FormGroup>
          </EditorColumn>

          <EditorColumn>
            <FormGroup>
              <Label>Visibilité</Label>
              <CheckboxGroup>
                <input
                  type="checkbox"
                  id="is_public"
                  {...register('is_public')}
                />
                <label htmlFor="is_public">
                  Rendre ce livre public
                </label>
              </CheckboxGroup>
              <small className="text--muted">
                Les livres publics sont visibles par tous les utilisateurs
              </small>
            </FormGroup>
          </EditorColumn>
        </EditorLayout>

        <ButtonGroup>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate('/personal-books')}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            <FiSave /> 
            {createMutation.isLoading || updateMutation.isLoading
              ? 'Enregistrement...'
              : isEditing ? 'Mettre à jour' : 'Créer le livre'
            }
          </button>
        </ButtonGroup>
      </Form>
    </EditorContainer>
  );
};

export default PersonalBookEditor;