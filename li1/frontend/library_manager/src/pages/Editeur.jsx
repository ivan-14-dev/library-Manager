import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  FiSave, FiUsers, FiEye, FiShare2, FiBarChart2,
  FiMessageSquare, FiClock, FiUser, FiSettings,
  FiDownload, FiPrinter, FiBook, FiTag,
  FiPlus, FiImage, FiVideo, FiCode,
  FiCheckCircle, FiAlertCircle, FiLock,
  FiGlobe, FiHeart, FiThumbsUp, FiStar
} from 'react-icons/fi';

// Configuration personnalisée de CKEditor
const editorConfiguration = {
  toolbar: {
    items: [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', 'code', '|',
      'link', 'blockQuote', 'codeBlock', '|',
      'bulletedList', 'numberedList', 'todoList', '|',
      'outdent', 'indent', '|',
      'imageUpload', 'mediaEmbed', 'insertTable', '|',
      'undo', 'redo', '|',
      'alignment', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
      'specialCharacters', 'horizontalLine', 'pageBreak', '|',
      'sourceEditing'
    ],
    shouldNotGroupWhenFull: true
  },
  plugins: [
    ...ClassicEditor.builtinPlugins,
    // Plugins supplémentaires
  ],
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
    ]
  },
  fontFamily: {
    options: [
      'default',
      'Arial, Helvetica, sans-serif',
      'Courier New, Courier, monospace',
      'Georgia, serif',
      'Lucida Sans Unicode, Lucida Grande, sans-serif',
      'Tahoma, Geneva, sans-serif',
      'Times New Roman, Times, serif',
      'Trebuchet MS, Helvetica, sans-serif',
      'Verdana, Geneva, sans-serif'
    ]
  },
  mediaEmbed: {
    previewsInData: true
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      'linkImage'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableProperties',
      'tableCellProperties'
    ]
  }
};

const AdvancedTextEditor = () => {
  const [editorData, setEditorData] = useState('<h2>Commencez à écrire votre chef-d\'œuvre...</h2>');
  const [documentTitle, setDocumentTitle] = useState('Mon Nouveau Document');
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [reports, setReports] = useState([]);
  const [publicationStatus, setPublicationStatus] = useState('draft');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [activeTab, setActiveTab] = useState('editor');
  const [comments, setComments] = useState([]);
  const [versionHistory, setVersionHistory] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Statistiques du document
  useEffect(() => {
    const text = editorData.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setReadingTime(Math.ceil(words.length / 200)); // 200 mots par minute
  }, [editorData]);



  // Ajout de l'ia a l'editeur de texte
  // Gestion de l'ia panel
  const [showAIPanel, setShowAIPanel] = useState(false);

  const handleSuggestionApply = (suggestion) => {

    console.log('Application de la suggestion:', suggestion);
    if (suggestion.replacement) {
      // Logique d'insertion dans CKEditor
      const editor = window.CKEDITOR?.instances?.editor1;
      if (editor) {
        editor.insertText(suggestion.replacement);
      }
    }
  };




  // Fonction pour gérer le contenu généré
  const handleContentGenerate = (generatedContent) => {
    // Insérer le contenu généré dans l'éditeur
    const editor = window.CKEDITOR?.instances?.editor1;
    if (editor) {
      editor.insertText(generatedContent);
    }
  };



  // Fonctions de gestion de document
  const handleSave = () => {
    const document = {
      id: Date.now(),
      title: documentTitle,
      content: editorData,
      lastModified: new Date().toISOString(),
      wordCount,
      readingTime
    };
    console.log('Document sauvegardé:', document);
    // Sauvegarde dans localStorage ou API
    localStorage.setItem('currentDocument', JSON.stringify(document));
  };

  const handleExport = (format) => {
    const blob = new Blob([editorData], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePublish = (visibility) => {
    setPublicationStatus('published');
    console.log(`Document publié avec visibilité: ${visibility}`);
  };

  const handleCollaboratorAdd = (email) => {
    const newCollaborator = {
      id: Date.now(),
      email,
      role: 'editor',
      joinedAt: new Date().toISOString()
    };
    setCollaborators(prev => [...prev, newCollaborator]);
  };

  const handleCommentAdd = (comment) => {
    const newComment = {
      id: Date.now(),
      text: comment,
      author: 'Vous',
      timestamp: new Date().toISOString(),
      resolved: false
    };
    setComments(prev => [...prev, newComment]);
  };

  const generateAISuggestions = () => {
    const suggestions = [
      { id: 1, type: 'grammar', text: 'Considérer de restructurer cette phrase pour plus de clarté', position: 45 },
      { id: 2, type: 'style', text: 'Trop de répétitions dans ce paragraphe', position: 120 },
      { id: 3, type: 'content', text: 'Ajouter des exemples pour soutenir votre argument', position: 89 }
    ];
    setAiSuggestions(suggestions);
  };

  return (
    <EditorContainer>
      {/* Header de l'éditeur */}
      <EditorHeader>
        <DocumentInfo>
          <DocumentTitle
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Titre du document..."
          />
          <DocumentStats>
            <Stat>
              <FiBook />
              {wordCount} mots
            </Stat>
            <Stat>
              <FiClock />
              {readingTime} min
            </Stat>
            <StatusBadge status={publicationStatus}>
              {publicationStatus === 'draft' && 'Brouillon'}
              {publicationStatus === 'review' && 'En révision'}
              {publicationStatus === 'published' && 'Publié'}
            </StatusBadge>
          </DocumentStats>
        </DocumentInfo>

        <EditorActions>
          <ActionButton onClick={handleSave}>
            <FiSave />
            Sauvegarder
          </ActionButton>
          
          <ActionGroup>
            <ActionButton onClick={() => setIsCollaborating(!isCollaborating)} active={isCollaborating}>
              <FiUsers />
              Collaboration
            </ActionButton>
            
            <ActionButton onClick={() => setActiveTab('reports')}>
              <FiBarChart2 />
              Rapports
            </ActionButton>
            


            <ActionButton 
            onClick={() => setShowAIPanel(!showAIPanel)} 
            active={showAIPanel}
              >
            <FiStar />
            Assistant IA
          </ActionButton> 


            <PublishMenu>
              <ActionButton>
                <FiShare2 />
                Publier
              </ActionButton>
              <PublishDropdown>
                <PublishOption onClick={() => handlePublish('private')}>
                  <FiLock />
                  Privé
                </PublishOption>
                <PublishOption onClick={() => handlePublish('public')}>
                  <FiGlobe />
                  Public
                </PublishOption>
                <PublishOption onClick={() => handlePublish('premium')}>
                  <FiStar />
                  Premium
                </PublishOption>
              </PublishDropdown>
            </PublishMenu>
          </ActionGroup>
        </EditorActions>
      </EditorHeader>

      <EditorContent>
        {/* Sidebar des fonctionnalités */}
        <EditorSidebar>
          <SidebarSection>
            <SidebarTitle>ÉCRITURE</SidebarTitle>
            <SidebarButton onClick={() => setActiveTab('editor')} active={activeTab === 'editor'}>
              <FiBook />
              Éditeur
            </SidebarButton>
            <SidebarButton onClick={() => setActiveTab('outline')}>
              <FiTag />
              Plan
            </SidebarButton>
            <SidebarButton onClick={() => setActiveTab('research')}>
              <FiPlus />
              Recherche
            </SidebarButton>
          </SidebarSection>

          {/* Option IA dans la sidebar */}
          <SidebarSection>
            <SidebarTitle>INTELLIGENCE ARTIFICIELLE</SidebarTitle>
            <SidebarButton 
              onClick={() => setShowAIPanel(!showAIPanel)} 
              active={showAIPanel}
            >
              <FiStar />
              Assistant IA
            </SidebarButton>
          </SidebarSection>


          <SidebarSection>
            <SidebarTitle>COLLABORATION</SidebarTitle>
            <SidebarButton onClick={() => setActiveTab('comments')} active={activeTab === 'comments'}>
              <FiMessageSquare />
              Commentaires ({comments.length})
            </SidebarButton>
            <SidebarButton onClick={() => setActiveTab('collaborators')} active={activeTab === 'collaborators'}>
              <FiUsers />
              Collaborateurs ({collaborators.length})
            </SidebarButton>
            <SidebarButton onClick={() => setActiveTab('versions')}>
              <FiClock />
              Versions
            </SidebarButton>
          </SidebarSection>

          <SidebarSection>
            <SidebarTitle>ANALYSE</SidebarTitle>
            <SidebarButton onClick={() => setActiveTab('reports')} active={activeTab === 'reports'}>
              <FiBarChart2 />
              Rapports
            </SidebarButton>
            <SidebarButton onClick={() => setActiveTab('ai')} active={activeTab === 'ai'}>
              <FiStar />
              IA Assistant
            </SidebarButton>
            <SidebarButton onClick={() => setActiveTab('seo')}>
              <FiEye />
              SEO
            </SidebarButton>
          </SidebarSection>

          <SidebarSection>
            <SidebarTitle>EXPORT</SidebarTitle>
            <SidebarButton onClick={() => handleExport('html')}>
              <FiDownload />
              HTML
            </SidebarButton>
            <SidebarButton onClick={() => handleExport('pdf')}>
              <FiPrinter />
              PDF
            </SidebarButton>
            <SidebarButton onClick={() => handleExport('docx')}>
              <FiDownload />
              Word
            </SidebarButton>
          </SidebarSection>
        </EditorSidebar>

        {/* Zone d'édition principale */}
        <MainEditorArea  $withAI={showAIPanel}>
          {activeTab === 'editor' && (
            <>
              <EditorWrapper $withAI={showAIPanel}>
                <CKEditor
                  editor={ClassicEditor}
                  data={editorData}
                  config={editorConfiguration}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                  }}
                  onReady={editor => {
                    editorRef.current = editor;
                    window.CKEDITOR = window.CKEDITOR || {};
                    window.CKEDITOR.instances = window.CKEDITOR.instances || {};
                    window.CKEDITOR.instances.editor1 = editor;
                  }}
                />

                <EnhancedToolbar>
                  <ToolbarGroup>
                    <ToolButton onClick={generateAISuggestions}>
                      <FiStar />
                      Suggestions IA
                    </ToolButton>
                    <ToolButton onClick={() => fileInputRef.current?.click()}>
                      <FiImage />
                      Médias
                    </ToolButton>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*,video/*"
                      onChange={(e) => console.log('Fichier sélectionné:', e.target.files[0])}
                    />
                    <ToolButton onClick={() => setShowAIPanel(true)}>
                      <FiStar />
                      Ouvrir l'IA
                    </ToolButton>
                  </ToolbarGroup>

                  <ToolbarGroup>
                    <ToolButton onClick={() => setIsFullscreen(!isFullscreen)}>
                      {isFullscreen ? 'Sortir du plein écran' : 'Plein écran'}
                    </ToolButton>
                  </ToolbarGroup>
                </EnhancedToolbar>
              </EditorWrapper>

              {/* Panel IA conditionnel */}
              {showAIPanel && (
                <AISidePanel>
                  <AIPanel 
                    onSuggestionApply={handleSuggestionApply}
                    onContentGenerate={handleContentGenerate}
                  />
                </AISidePanel>
              )}
            </>
          )}


          {/* Panneau des commentaires */}
          {activeTab === 'comments' && (
            <CommentsPanel>
              <PanelHeader>
                <h3>Commentaires ({comments.length})</h3>
                <AddCommentForm onSubmit={(e) => {
                  e.preventDefault();
                  const comment = e.target.comment.value;
                  if (comment.trim()) {
                    handleCommentAdd(comment);
                    e.target.reset();
                  }
                }}>
                  <CommentInput
                    name="comment"
                    placeholder="Ajouter un commentaire..."
                    rows="3"
                  />
                  <CommentSubmit type="submit">
                    Ajouter
                  </CommentSubmit>
                </AddCommentForm>
              </PanelHeader>
              
              <CommentsList>
                {comments.map(comment => (
                  <CommentItem key={comment.id} resolved={comment.resolved}>
                    <CommentHeader>
                      <CommentAuthor>{comment.author}</CommentAuthor>
                      <CommentTime>
                        {new Date(comment.timestamp).toLocaleString()}
                      </CommentTime>
                      <CommentActions>
                        <ActionIcon>
                          {comment.resolved ? <FiCheckCircle /> : <FiAlertCircle />}
                        </ActionIcon>
                      </CommentActions>
                    </CommentHeader>
                    <CommentText>{comment.text}</CommentText>
                  </CommentItem>
                ))}
              </CommentsList>
            </CommentsPanel>
          )}

          {/* Panneau des collaborateurs */}
          {activeTab === 'collaborators' && (
            <CollaboratorsPanel>
              <PanelHeader>
                <h3>Collaborateurs ({collaborators.length})</h3>
                <AddCollaboratorForm onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  if (email.trim()) {
                    handleCollaboratorAdd(email);
                    e.target.reset();
                  }
                }}>
                  <CollaboratorInput
                    type="email"
                    name="email"
                    placeholder="Email du collaborateur..."
                  />
                  <CollaboratorSubmit type="submit">
                    Inviter
                  </CollaboratorSubmit>
                </AddCollaboratorForm>
              </PanelHeader>
              
              <CollaboratorsList>
                {collaborators.map(collaborator => (
                  <CollaboratorItem key={collaborator.id}>
                    <CollaboratorAvatar>
                      {collaborator.email.charAt(0).toUpperCase()}
                    </CollaboratorAvatar>
                    <CollaboratorInfo>
                      <CollaboratorEmail>{collaborator.email}</CollaboratorEmail>
                      <CollaboratorRole>{collaborator.role}</CollaboratorRole>
                    </CollaboratorInfo>
                    <CollaboratorActions>
                      <RoleSelect defaultValue={collaborator.role}>
                        <option value="viewer">Lecteur</option>
                        <option value="commenter">Commentateur</option>
                        <option value="editor">Éditeur</option>
                      </RoleSelect>
                      <RemoveButton>Retirer</RemoveButton>
                    </CollaboratorActions>
                  </CollaboratorItem>
                ))}
              </CollaboratorsList>
            </CollaboratorsPanel>
          )}

          {/* Panneau des rapports */}
          {activeTab === 'reports' && (
            <ReportsPanel>
              <ReportGrid>
                <ReportCard>
                  <ReportIcon>
                    <FiBarChart2 />
                  </ReportIcon>
                  <ReportContent>
                    <ReportValue>{wordCount}</ReportValue>
                    <ReportLabel>Mots</ReportLabel>
                  </ReportContent>
                </ReportCard>
                
                <ReportCard>
                  <ReportIcon>
                    <FiClock />
                  </ReportIcon>
                  <ReportContent>
                    <ReportValue>{readingTime}</ReportValue>
                    <ReportLabel>Minutes de lecture</ReportLabel>
                  </ReportContent>
                </ReportCard>
                
                <ReportCard>
                  <ReportIcon>
                    <FiUsers />
                  </ReportIcon>
                  <ReportContent>
                    <ReportValue>{collaborators.length}</ReportValue>
                    <ReportLabel>Collaborateurs</ReportLabel>
                  </ReportContent>
                </ReportCard>
                
                <ReportCard>
                  <ReportIcon>
                    <FiMessageSquare />
                  </ReportIcon>
                  <ReportContent>
                    <ReportValue>{comments.length}</ReportValue>
                    <ReportLabel>Commentaires</ReportLabel>
                  </ReportContent>
                </ReportCard>
              </ReportGrid>
              
              <AdvancedReports>
                <ReportSection>
                  <h4>Analyse de Lisibilité</h4>
                  <ReadabilityScore score={75}>
                    <ScoreCircle>
                      <ScoreValue>75%</ScoreValue>
                    </ScoreCircle>
                    <ScoreLabel>Facile à lire</ScoreLabel>
                  </ReadabilityScore>
                </ReportSection>
                
                <ReportSection>
                  <h4>Engagement Prévu</h4>
                  <EngagementMetrics>
                    <Metric>
                      <MetricValue>85%</MetricValue>
                      <MetricLabel>Taux de complétion</MetricLabel>
                    </Metric>
                    <Metric>
                      <MetricValue>2.3x</MetricValue>
                      <MetricLabel>Partage moyen</MetricLabel>
                    </Metric>
                  </EngagementMetrics>
                </ReportSection>
              </AdvancedReports>
            </ReportsPanel>
          )}

          {/* Panneau IA Assistant */}
          {activeTab === 'ai' && (
            <AIPanel>
              <AISuggestions>
                <AISuggestionHeader>
                  <h3>Suggestions de l'IA</h3>
                  <RefreshButton onClick={generateAISuggestions}>
                    Actualiser
                  </RefreshButton>
                </AISuggestionHeader>
                
                <SuggestionsList>
                  {aiSuggestions.map(suggestion => (
                    <SuggestionItem key={suggestion.id} type={suggestion.type}>
                      <SuggestionIcon>
                        {suggestion.type === 'grammar' && <FiCheckCircle />}
                        {suggestion.type === 'style' && <FiAlertCircle />}
                        {suggestion.type === 'content' && <FiPlus />}
                      </SuggestionIcon>
                      <SuggestionText>{suggestion.text}</SuggestionText>
                      <SuggestionActions>
                        <SuggestionButton>Appliquer</SuggestionButton>
                        <SuggestionButton variant="outline">Ignorer</SuggestionButton>
                      </SuggestionActions>
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              </AISuggestions>
              
              <AITools>
                <AIToolTitle>Outils IA</AIToolTitle>
                <AIToolGrid>
                  <AIToolCard>
                    <AIToolIcon>
                      <FiThumbsUp />
                    </AIToolIcon>
                    <AIToolName>Optimiser le ton</AIToolName>
                    <AIToolDescription>
                      Ajustez le ton de votre écriture
                    </AIToolDescription>
                  </AIToolCard>
                  
                  <AIToolCard>
                    <AIToolIcon>
                      <FiHeart />
                    </AIToolIcon>
                    <AIToolName>Générer des idées</AIToolName>
                    <AIToolDescription>
                      Obtenez de nouvelles idées de contenu
                    </AIToolDescription>
                  </AIToolCard>
                  
                  <AIToolCard>
                    <AIToolIcon>
                      <FiUsers />
                    </AIToolIcon>
                    <AIToolName>Analyser le public</AIToolName>
                    <AIToolDescription>
                      Comprenez votre audience cible
                    </AIToolDescription>
                  </AIToolCard>
                </AIToolGrid>
              </AITools>
            </AIPanel>
          )}
        </MainEditorArea>
      </EditorContent>

      {/* Footer de l'éditeur */}
      <EditorFooter>
        <FooterSection>
          <AutoSaveIndicator>
            <FiCheckCircle />
            Sauvegardé automatiquement à {new Date().toLocaleTimeString()}
          </AutoSaveIndicator>
        </FooterSection>
        
        <FooterSection>
          <CollaborationStatus active={isCollaborating}>
            {isCollaborating ? 'Mode collaboration activé' : 'Mode collaboration désactivé'}
          </CollaborationStatus>
        </FooterSection>
      </EditorFooter>
    </EditorContainer>
  );
};


// styles supplémentaires
const MainEditorArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  
  ${props => props.$withAI && css`
    gap: 0;
  `}
`;

const EditorWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .ck-editor {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .ck-editor__main {
    flex: 1;
    overflow: auto;
  }
  
  .ck-content {
    min-height: 500px;
    font-size: 1rem;
    line-height: 1.6;
    padding: 2rem;
  }
  
  ${props => props.$withAI && css`
    flex: 2;
  `}
`;

const AISidePanel = styled.div`
  width: 400px;
  border-left: 1px solid #e2e8f0;
  background: white;
`;

// Styles Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DocumentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const DocumentTitle = styled.input`
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  outline: none;
  background: transparent;
  color: #1a202c;
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const DocumentStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
`;

const StatusBadge = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.status === 'draft' && css`
    background: #fed7d7;
    color: #c53030;
  `}
  
  ${props => props.status === 'review' && css`
    background: #fefcbf;
    color: #d69e2e;
  `}
  
  ${props => props.status === 'published' && css`
    background: #c6f6d5;
    color: #276749;
  `}
`;

const EditorActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.active && css`
    background: #4299e1;
    color: white;
    border-color: #4299e1;
  `}
  
  &:hover {
    background: #f7fafc;
    transform: translateY(-1px);
    
    ${props => props.active && css`
      background: #3182ce;
    `}
  }
`;

const PublishMenu = styled.div`
  position: relative;
  
  &:hover > div {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const PublishDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 1000;
`;

const PublishOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f7fafc;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const EditorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const EditorSidebar = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 1rem 0;
  overflow-y: auto;
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SidebarTitle = styled.h3`
  padding: 0 1.5rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.active && css`
    background: #edf2f7;
    color: #2d3748;
    border-right: 3px solid #4299e1;
  `}
  
  &:hover {
    background: #f7fafc;
    color: #2d3748;
  }
`;


const EnhancedToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #edf2f7;
    transform: translateY(-1px);
  }
`;

// Panneaux de fonctionnalités
const PanelBase = styled.div`
  flex: 1;
  background: white;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease;
`;

const PanelHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const CommentsPanel = styled(PanelBase)``;

const AddCommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const CommentInput = styled.textarea`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const CommentSubmit = styled.button`
  align-self: flex-end;
  padding: 0.5rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #3182ce;
  }
`;

const CommentsList = styled.div`
  padding: 1.5rem;
`;

const CommentItem = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 1rem;
  
  ${props => props.resolved && css`
    background: #f0fff4;
    border-color: #9ae6b4;
  `}
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #2d3748;
`;

const CommentTime = styled.span`
  font-size: 0.875rem;
  color: #718096;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  
  &:hover {
    color: #4a5568;
  }
`;

const CommentText = styled.p`
  color: #4a5568;
  line-height: 1.5;
`;

const CollaboratorsPanel = styled(PanelBase)``;

const AddCollaboratorForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CollaboratorInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const CollaboratorSubmit = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #3182ce;
  }
`;

const CollaboratorsList = styled.div`
  padding: 1.5rem;
`;

const CollaboratorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const CollaboratorAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: #4299e1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const CollaboratorInfo = styled.div`
  flex: 1;
`;

const CollaboratorEmail = styled.div`
  font-weight: 600;
  color: #2d3748;
`;

const CollaboratorRole = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const CollaboratorActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RoleSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const RemoveButton = styled.button`
  padding: 0.5rem;
  background: #fed7d7;
  color: #c53030;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background: #feb2b2;
  }
`;

const ReportsPanel = styled(PanelBase)`
  padding: 1.5rem;
`;

const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ReportCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ReportIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #edf2f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4299e1;
  font-size: 1.25rem;
`;

const ReportContent = styled.div`
  flex: 1;
`;

const ReportValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
`;

const ReportLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const AdvancedReports = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ReportSection = styled.div`
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  
  h4 {
    margin-bottom: 1rem;
    color: #2d3748;
  }
`;

const ReadabilityScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ScoreCircle = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #48bb78;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite;
`;

const ScoreValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #48bb78;
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const EngagementMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Metric = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 6px;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4299e1;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const AIPanel = styled(PanelBase)`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
`;

const AISuggestions = styled.div``;

const AISuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const RefreshButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background: #3182ce;
  }
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  
  ${props => props.type === 'grammar' && css`
    border-left: 4px solid #48bb78;
  `}
  
  ${props => props.type === 'style' && css`
    border-left: 4px solid #ed8936;
  `}
  
  ${props => props.type === 'content' && css`
    border-left: 4px solid #4299e1;
  `}
`;

const SuggestionIcon = styled.div`
  color: #718096;
  font-size: 1.25rem;
`;

const SuggestionText = styled.div`
  flex: 1;
  color: #4a5568;
  line-height: 1.5;
`;

const SuggestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SuggestionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  
  ${props => props.variant === 'outline' && css`
    background: transparent;
  `}
  
  &:hover {
    background: #f7fafc;
  }
`;

const AITools = styled.div``;

const AIToolTitle = styled.h3`
  margin-bottom: 1rem;
  color: #2d3748;
`;

const AIToolGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const AIToolCard = styled.div`
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AIToolIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #edf2f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4299e1;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const AIToolName = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const AIToolDescription = styled.div`
  font-size: 0.875rem;
  color: #718096;
  line-height: 1.4;
`;

const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
`;

const FooterSection = styled.div``;

const AutoSaveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #48bb78;
`;

const CollaborationStatus = styled.div`
  font-size: 0.875rem;
  color: ${props => props.active ? '#48bb78' : '#718096'};
`;

export default AdvancedTextEditor;