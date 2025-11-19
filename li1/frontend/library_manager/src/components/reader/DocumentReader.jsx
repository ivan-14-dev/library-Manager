// src/components/reader/DocumentReader.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiBook, FiArrowLeft, FiBookmark, FiShare2, 
  FiDownload, FiSettings, FiMoon, FiSun,
  FiZoomIn, FiZoomOut, FiType, FiColumns,
  FiHeart, FiMessageSquare, FiClock, FiUser
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsAPI, readingAPI } from '../../api';

// Animation de fade in
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Container principal
const ReaderContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.darkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.darkMode ? '#e9ecef' : '#212529'};
  transition: all 0.3s ease;
  position: relative;
`;

// Header de lecture
const ReaderHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.darkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(248, 249, 250, 0.95)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.darkMode ? '#333' : '#dee2e6'};
  padding: 1rem 2rem;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &.hidden {
    transform: translateY(-100%);
  }
`;

// Navigation
const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: ${props => props.darkMode ? '#333' : '#fff'};
  border: 1px solid ${props => props.darkMode ? '#444' : '#dee2e6'};
  color: ${props => props.darkMode ? '#e9ecef' : '#495057'};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.darkMode ? '#444' : '#e9ecef'};
  }
`;

// Contenu principal
const ReaderContent = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem;
  animation: ${fadeIn} 0.6s ease-out;

  /* Protection contre la copie */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  /* Protection contre le clic droit */
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

// Métadonnées du document
const DocumentMeta = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${props => props.darkMode ? '#333' : '#dee2e6'};
`;

const DocumentTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.darkMode ? '#fff' : '#212529'};
  line-height: 1.2;
`;

const DocumentAuthor = styled.div`
  font-size: 1.2rem;
  color: ${props => props.darkMode ? '#adb5bd' : '#6c757d'};
  margin-bottom: 0.5rem;
`;

const DocumentInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.darkMode ? '#868e96' : '#6c757d'};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Contenu protégé
const ProtectedContent = styled.div`
  line-height: 1.8;
  font-size: ${props => props.fontSize}px;
  font-family: ${props => props.fontFamily};
  text-align: ${props => props.textAlign};
  column-count: ${props => props.columns};
  column-gap: 2rem;
  
  /* Styles pour la protection */
  position: relative;
  
  /* Empêcher la sélection */
  &::selection {
    background: transparent;
  }
  
  &::-moz-selection {
    background: transparent;
  }

  /* Overlay de protection transparent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    cursor: default;
  }

  p {
    margin-bottom: 1.5rem;
    text-align: justify;
    position: relative;
    z-index: 0;
  }

  h2 {
    font-size: 1.8em;
    margin: 2rem 0 1rem 0;
    color: ${props => props.darkMode ? '#fff' : '#212529'};
    border-bottom: 2px solid ${props => props.darkMode ? '#495057' : '#dee2e6'};
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.4em;
    margin: 1.5rem 0 1rem 0;
    color: ${props => props.darkMode ? '#e9ecef' : '#495057'};
  }

  blockquote {
    border-left: 4px solid ${props => props.darkMode ? '#495057' : '#dee2e6'};
    padding-left: 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: ${props => props.darkMode ? '#adb5bd' : '#6c757d'};
  }

  /* Protection supplémentaire pour les images */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    pointer-events: none;
    -webkit-user-drag: none;
  }
`;

// Barre d'outils flottante
const FloatingToolbar = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.darkMode ? 'rgba(33, 37, 41, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.darkMode ? '#495057' : '#dee2e6'};
  border-radius: 2rem;
  padding: 0.75rem 1.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &.hidden {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
  }
`;

const ToolButton = styled.button`
  background: ${props => props.active ? (props.darkMode ? '#495057' : '#e9ecef') : 'transparent'};
  border: none;
  color: ${props => props.darkMode ? '#e9ecef' : '#495057'};
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.darkMode ? '#495057' : '#e9ecef'};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Menu des paramètres
const SettingsMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.darkMode ? '#343a40' : '#fff'};
  border: 1px solid ${props => props.darkMode ? '#495057' : '#dee2e6'};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  z-index: 1001;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid transparent;
    border-top-color: ${props => props.darkMode ? '#343a40' : '#fff'};
  }
`;

const SettingGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin-bottom: 0.75rem;
    color: ${props => props.darkMode ? '#e9ecef' : '#495057'};
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const SettingOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SettingOption = styled.button`
  background: ${props => props.active ? (props.darkMode ? '#495057' : '#007bff') : 'transparent'};
  color: ${props => props.active ? '#fff' : (props.darkMode ? '#e9ecef' : '#495057')};
  border: 1px solid ${props => props.active ? 'transparent' : (props.darkMode ? '#495057' : '#dee2e6')};
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? (props.darkMode ? '#5a6268' : '#0056b3') : (props.darkMode ? '#495057' : '#e9ecef')};
  }
`;

// Indicateur de progression
const ProgressIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.darkMode ? '#333' : '#dee2e6'};
  z-index: 1002;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }
`;

// Message de protection
const ProtectionMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.darkMode ? 'rgba(220, 53, 69, 0.9)' : 'rgba(220, 53, 69, 0.1)'};
  color: ${props => props.darkMode ? '#fff' : '#dc3545'};
  padding: 1rem 2rem;
  border-radius: 1rem;
  border: 2px solid #dc3545;
  font-weight: 600;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease;
  display: ${props => props.show ? 'block' : 'none'};
`;

const DocumentReader = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const contentRef = useRef(null);
  
  // États pour les paramètres de lecture
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [textAlign, setTextAlign] = useState('justify');
  const [columns, setColumns] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [protectionMessage, setProtectionMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Appels API
  const { data: document, isLoading, error } = useQuery(
    ['document', documentId],
    () => documentsAPI.getDocument(documentId),
    {
      enabled: !!documentId,
      retry: 2,
    }
  );

  const { data: readingSession } = useQuery(
    ['reading-session', documentId],
    () => readingAPI.getReadingSession(documentId),
    {
      enabled: !!documentId,
    }
  );

  // Mutation pour sauvegarder la progression
  const saveProgressMutation = useMutation(
    (progress) => readingAPI.saveReadingProgress(documentId, progress),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reading-session', documentId]);
      },
    }
  );

  // Mutation pour ajouter aux favoris
  const toggleFavoriteMutation = useMutation(
    () => documentsAPI.toggleFavorite(documentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['document', documentId]);
      },
    }
  );

  // Protection contre la copie
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      showProtectionMessage('La copie de contenu est désactivée pour protéger les droits d\'auteur.');
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      showProtectionMessage('Le clic droit est désactivé sur cette page.');
    };

    const handleKeyDown = (e) => {
      // Empêcher Ctrl+C, Ctrl+A, etc.
      if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's')) {
        e.preventDefault();
        showProtectionMessage('Cette action n\'est pas autorisée.');
      }
      
      // Empêcher l'impression d'écran
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        showProtectionMessage('La capture d\'écran est désactivée.');
      }
    };

    const handleSelection = () => {
      if (window.getSelection().toString().length > 0) {
        showProtectionMessage('La sélection de texte est limitée.');
        window.getSelection().removeAllRanges();
      }
    };

    // Ajouter les écouteurs d'événements
    document.addEventListener('copy', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectionchange', handleSelection);

    // Désactiver le drag & drop
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, []);

  // Gestion du défilement
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Masquer/afficher header et toolbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
        setToolbarVisible(false);
      } else {
        setHeaderVisible(true);
        setToolbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);

      // Calculer la progression de lecture
      if (contentRef.current) {
        const element = contentRef.current;
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = element.offsetHeight;
        const scrolled = Math.max(0, -elementTop);
        const progress = (scrolled / (elementHeight - windowHeight)) * 100;
        
        setReadingProgress(Math.min(100, Math.max(0, progress)));
        
        // Sauvegarder la progression toutes les 10%
        if (Math.floor(progress / 10) > Math.floor(readingProgress / 10)) {
          saveProgressMutation.mutate(Math.floor(progress));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, readingProgress, saveProgressMutation]);

  // Afficher un message de protection temporaire
  const showProtectionMessage = (message) => {
    setProtectionMessage(message);
    setTimeout(() => setProtectionMessage(''), 2000);
  };

  // Fonction pour formater le contenu avec protection
  const formatContentWithProtection = (content) => {
    if (!content) return '';
    
    // Ajouter des spans invisibles pour perturber la copie
    return content
      .split(' ')
      .map((word, index) => {
        // Ajouter un span invisible toutes les quelques mots
        if (index % 5 === 0 && index > 0) {
          return `${word}<span style="display:none">${Math.random().toString(36).substr(2, 5)}</span>`;
        }
        return word;
      })
      .join(' ')
      .replace(/\n/g, '</p><p>');
  };

  // Gestion du zoom
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(24, prev + 1));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(12, prev - 1));
  };

  if (isLoading) {
    return (
      <ReaderContainer darkMode={darkMode}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <FiBook size={48} color={darkMode ? '#495057' : '#6c757d'} />
          <div>Chargement du document...</div>
        </div>
      </ReaderContainer>
    );
  }

  if (error) {
    return (
      <ReaderContainer darkMode={darkMode}>
        <ReaderHeader darkMode={darkMode}>
          <Navigation>
            <NavButton darkMode={darkMode} onClick={() => navigate(-1)}>
              <FiArrowLeft /> Retour
            </NavButton>
          </Navigation>
        </ReaderHeader>
        <ReaderContent>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Document non trouvé</h2>
            <p>Le document que vous recherchez n'existe pas ou n'est plus disponible.</p>
            <NavButton darkMode={darkMode} onClick={() => navigate('/library')}>
              Retour à la bibliothèque
            </NavButton>
          </div>
        </ReaderContent>
      </ReaderContainer>
    );
  }

  return (
    <ReaderContainer darkMode={darkMode}>
      {/* Indicateur de progression */}
      <ProgressIndicator darkMode={darkMode} progress={readingProgress} />

      {/* Message de protection */}
      <ProtectionMessage darkMode={darkMode} show={!!protectionMessage}>
        {protectionMessage}
      </ProtectionMessage>

      {/* Header */}
      <ReaderHeader darkMode={darkMode} className={headerVisible ? '' : 'hidden'}>
        <Navigation>
          <NavButton darkMode={darkMode} onClick={() => navigate(-1)}>
            <FiArrowLeft /> Retour
          </NavButton>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: darkMode ? '#e9ecef' : '#495057'
          }}>
            <FiBook />
            Lecture en cours
          </div>
        </Navigation>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ToolButton
            darkMode={darkMode}
            onClick={() => toggleFavoriteMutation.mutate()}
            disabled={toggleFavoriteMutation.isLoading}
          >
            <FiHeart 
              fill={document?.isFavorite ? '#dc3545' : 'transparent'} 
              color={document?.isFavorite ? '#dc3545' : 'currentColor'} 
            />
          </ToolButton>
          
          <ToolButton darkMode={darkMode}>
            <FiBookmark />
          </ToolButton>
          
          <ToolButton darkMode={darkMode}>
            <FiShare2 />
          </ToolButton>
        </div>
      </ReaderHeader>

      {/* Contenu principal */}
      <ReaderContent>
        <DocumentMeta darkMode={darkMode}>
          <DocumentTitle darkMode={darkMode}>{document?.title}</DocumentTitle>
          <DocumentAuthor darkMode={darkMode}>
            Par {document?.author}
          </DocumentAuthor>
          <DocumentInfo darkMode={darkMode}>
            <InfoItem>
              <FiClock />
              {document?.readingTime} min de lecture
            </InfoItem>
            <InfoItem>
              <FiType />
              {document?.wordCount?.toLocaleString()} mots
            </InfoItem>
            <InfoItem>
              <FiUser />
              {document?.category}
            </InfoItem>
          </DocumentInfo>
        </DocumentMeta>

        <ProtectedContent
          ref={contentRef}
          darkMode={darkMode}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAlign={textAlign}
          columns={columns}
          dangerouslySetInnerHTML={{ 
            __html: formatContentWithProtection(document?.content) 
          }}
        />
      </ReaderContent>

      {/* Barre d'outils flottante */}
      <FloatingToolbar darkMode={darkMode} className={toolbarVisible ? '' : 'hidden'}>
        <ToolButton
          darkMode={darkMode}
          onClick={decreaseFontSize}
          disabled={fontSize <= 12}
          title="Réduire la taille du texte"
        >
          <FiZoomOut />
        </ToolButton>

        <ToolButton
          darkMode={darkMode}
          onClick={increaseFontSize}
          disabled={fontSize >= 24}
          title="Augmenter la taille du texte"
        >
          <FiZoomIn />
        </ToolButton>

        <ToolButton
          darkMode={darkMode}
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </ToolButton>

        <ToolButton
          darkMode={darkMode}
          onClick={() => setShowSettings(!showSettings)}
          active={showSettings}
          title="Paramètres d'affichage"
        >
          <FiSettings />
        </ToolButton>

        <div style={{ 
          color: darkMode ? '#adb5bd' : '#6c757d', 
          fontSize: '0.8rem',
          padding: '0 0.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          Page {currentPage}
        </div>
      </FloatingToolbar>

      {/* Menu des paramètres */}
      {showSettings && (
        <SettingsMenu darkMode={darkMode}>
          <SettingGroup darkMode={darkMode}>
            <h4>Police</h4>
            <SettingOptions>
              {[
                { value: 'serif', label: 'Serif' },
                { value: 'sans-serif', label: 'Sans-serif' },
                { value: 'monospace', label: 'Monospace' }
              ].map(font => (
                <SettingOption
                  key={font.value}
                  darkMode={darkMode}
                  active={fontFamily === font.value}
                  onClick={() => setFontFamily(font.value)}
                >
                  {font.label}
                </SettingOption>
              ))}
            </SettingOptions>
          </SettingGroup>

          <SettingGroup darkMode={darkMode}>
            <h4>Alignement</h4>
            <SettingOptions>
              {[
                { value: 'left', label: 'Gauche' },
                { value: 'justify', label: 'Justifié' },
                { value: 'center', label: 'Centré' }
              ].map(align => (
                <SettingOption
                  key={align.value}
                  darkMode={darkMode}
                  active={textAlign === align.value}
                  onClick={() => setTextAlign(align.value)}
                >
                  {align.label}
                </SettingOption>
              ))}
            </SettingOptions>
          </SettingGroup>

          <SettingGroup darkMode={darkMode}>
            <h4>Colonnes</h4>
            <SettingOptions>
              {[1, 2].map(col => (
                <SettingOption
                  key={col}
                  darkMode={darkMode}
                  active={columns === col}
                  onClick={() => setColumns(col)}
                >
                  {col} colonne{col > 1 ? 's' : ''}
                </SettingOption>
              ))}
            </SettingOptions>
          </SettingGroup>
        </SettingsMenu>
      )}
    </ReaderContainer>
  );
};

export default DocumentReader;