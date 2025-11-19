// src/components/ai/AIEditor.jsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { aiServiceAPI } from '../../api/auth';

const AIEditor = () => {
  return (
    <div>
      <h1>AIEditor</h1>
    </div>
  );
};
// const AIEditor = ({ 
  // initialContent = '', 
  // onContentChange, 
  // height = '400px',
  // placeholder = 'Commencez à taper votre contenu...',
  // showAIFeatures = true 
// }) => {
//   const [content, setContent] = useState(initialContent);
//   const [isAILoading, setIsAILoading] = useState(false);
//   const [aiSuggestions, setAiSuggestions] = useState([]);
//   const [showAIPanel, setShowAIPanel] = useState(false);
//   const textareaRef = useRef(null);

//   const handleContentChange = (e) => {
//     const newContent = e.target.value;
//     setContent(newContent);
//     if (onContentChange) {
//       onContentChange(newContent);
//     }
//   };

//   const handleAIAction = async (action) => {
//     if (!content.trim()) return;

//     setIsAILoading(true);
//     try {
//       let result;
      
//       switch (action) {
//         case 'grammar':
//           result = await aiServiceAPI.grammarCheck(content);
//           break;
//         case 'improve':
//           result = await aiServiceAPI.generateContent(`Améliore ce texte: ${content}`);
//           break;
//         case 'summarize':
//           result = await aiServiceAPI.generateContent(`Résume ce texte: ${content}`);
//           break;
//         case 'expand':
//           result = await aiServiceAPI.generateContent(`Développe ce texte: ${content}`);
//           break;
//         default:
//           return;
//       }

//       if (result.data) {
//         setAiSuggestions(prev => [...prev, {
//           id: Date.now(),
//           action,
//           original: content,
//           suggestion: result.data.text || result.data.result || result.data,
//           timestamp: new Date()
//         }]);
//       }
//     } catch (error) {
//       console.error('Erreur AI:', error);
//       alert('Erreur lors de l\'utilisation de l\'IA. Veuillez réessayer.');
//     } finally {
//       setIsAILoading(false);
//     }
//   };

//   const applySuggestion = (suggestion) => {
//     setContent(suggestion);
//     if (onContentChange) {
//       onContentChange(suggestion);
//     }
//     setAiSuggestions([]);
//   };

//   const insertAtCursor = (text) => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const newContent = content.substring(0, start) + text + content.substring(end);
    
//     setContent(newContent);
//     if (onContentChange) {
//       onContentChange(newContent);
//     }

//     // Restaurer la position du curseur
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(start + text.length, start + text.length);
//     }, 0);
//   };

//   const aiActions = [
//     { id: 'grammar', label: 'Vérifier la grammaire', icon: '✏️' },
//     { id: 'improve', label: 'Améliorer le style', icon: '✨' },
//     { id: 'summarize', label: 'Résumer', icon: '📝' },
//     { id: 'expand', label: 'Développer', icon: '🔍' }
//   ];

//   return (
//     <EditorContainer>
//       <EditorHeader>
//         <EditorTitle>Éditeur de Contenu</EditorTitle>
//         {showAIFeatures && (
//           <AIToggle 
//             onClick={() => setShowAIPanel(!showAIPanel)}
//             active={showAIPanel}
//           >
//             {showAIPanel ? '👨‍💻' : '🤖'} Assistant IA
//           </AIToggle>
//         )}
//       </EditorHeader>

//       <EditorContent>
//         <TextArea
//           ref={textareaRef}
//           value={content}
//           onChange={handleContentChange}
//           placeholder={placeholder}
//           height={height}
//         />

//         {showAIFeatures && showAIPanel && (
//           <AISidebar>
//             <AISection>
//               <AISectionTitle>Actions IA</AISectionTitle>
//               <AIActions>
//                 {aiActions.map(action => (
//                   <AIActionButton
//                     key={action.id}
//                     onClick={() => handleAIAction(action.id)}
//                     disabled={isAILoading || !content.trim()}
//                   >
//                     <ActionIcon>{action.icon}</ActionIcon>
//                     {action.label}
//                   </AIActionButton>
//                 ))}
//               </AIActions>
//             </AISection>

//             {aiSuggestions.length > 0 && (
//               <AISection>
//                 <AISectionTitle>Suggestions</AISectionTitle>
//                 <SuggestionsList>
//                   {aiSuggestions.map(suggestion => (
//                     <SuggestionItem key={suggestion.id}>
//                       <SuggestionText>{suggestion.suggestion}</SuggestionText>
//                       <SuggestionActions>
//                         <SuggestionButton 
//                           onClick={() => applySuggestion(suggestion.suggestion)}
//                         >
//                           Appliquer
//                         </SuggestionButton>
//                         <SuggestionButton 
//                           secondary 
//                           onClick={() => insertAtCursor(suggestion.suggestion)}
//                         >
//                           Insérer
//                         </SuggestionButton>
//                       </SuggestionActions>
//                     </SuggestionItem>
//                   ))}
//                 </SuggestionsList>
//               </AISection>
//             )}

//             {isAILoading && (
//               <LoadingMessage>
//                 <LoadingSpinner />
//                 Traitement par l'IA...
//               </LoadingMessage>
//             )}
//           </AISidebar>
//         )}
//       </EditorContent>

//       <EditorFooter>
//         <WordCount>
//           {content.length} caractères • {content.split(/\s+/).filter(word => word.length > 0).length} mots
//         </WordCount>
//       </EditorFooter>
//     </EditorContainer>
//   );
// };

// // Styles
// const EditorContainer = styled.div`
//   border: 1px solid ${props => props.theme.colors.gray[300]};
//   border-radius: 8px;
//   background: white;
//   overflow: hidden;
// `;

// const EditorHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1rem;
//   border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
//   background: ${props => props.theme.colors.gray[50]};
// `;

// const EditorTitle = styled.h3`
//   margin: 0;
//   font-size: 1.1rem;
//   color: ${props => props.theme.colors.gray[800]};
// `;

// const AIToggle = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 0.5rem 1rem;
//   border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
//   border-radius: 6px;
//   background: ${props => props.active ? props.theme.colors.primary : 'white'};
//   color: ${props => props.active ? 'white' : props.theme.colors.gray[700]};
//   cursor: pointer;
//   font-size: 0.9rem;
//   transition: all 0.2s ease;

//   &:hover {
//     border-color: ${props => props.theme.colors.primary};
//   }
// `;

// const EditorContent = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 300px;
//   min-height: 200px;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 1rem;
//   border: none;
//   resize: vertical;
//   font-family: inherit;
//   font-size: 1rem;
//   line-height: 1.5;
//   min-height: ${props => props.height};
//   outline: none;

//   &::placeholder {
//     color: ${props => props.theme.colors.gray[400]};
//   }
// `;

// const AISidebar = styled.div`
//   border-left: 1px solid ${props => props.theme.colors.gray[200]};
//   background: ${props => props.theme.colors.gray[50]};
//   padding: 1rem;
//   max-height: 400px;
//   overflow-y: auto;
// `;

// const AISection = styled.div`
//   margin-bottom: 1.5rem;
// `;

// const AISectionTitle = styled.h4`
//   margin: 0 0 0.75rem 0;
//   font-size: 0.9rem;
//   color: ${props => props.theme.colors.gray[700]};
//   font-weight: 600;
// `;

// const AIActions = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const AIActionButton = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 0.75rem;
//   border: 1px solid ${props => props.theme.colors.gray[300]};
//   border-radius: 6px;
//   background: white;
//   color: ${props => props.theme.colors.gray[700]};
//   cursor: pointer;
//   font-size: 0.85rem;
//   transition: all 0.2s ease;

//   &:hover:not(:disabled) {
//     border-color: ${props => props.theme.colors.primary};
//     background: ${props => props.theme.colors.primary}10;
//   }

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// const ActionIcon = styled.span`
//   font-size: 1rem;
// `;

// const SuggestionsList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const SuggestionItem = styled.div`
//   padding: 1rem;
//   border: 1px solid ${props => props.theme.colors.gray[200]};
//   border-radius: 6px;
//   background: white;
// `;

// const SuggestionText = styled.p`
//   margin: 0 0 0.75rem 0;
//   font-size: 0.85rem;
//   line-height: 1.4;
//   color: ${props => props.theme.colors.gray[700]};
// `;

// const SuggestionActions = styled.div`
//   display: flex;
//   gap: 0.5rem;
// `;

// const SuggestionButton = styled.button`
//   padding: 0.4rem 0.75rem;
//   border: 1px solid ${props => props.secondary ? props.theme.colors.gray[300] : props.theme.colors.primary};
//   border-radius: 4px;
//   background: ${props => props.secondary ? 'white' : props.theme.colors.primary};
//   color: ${props => props.secondary ? props.theme.colors.gray[700] : 'white'};
//   cursor: pointer;
//   font-size: 0.75rem;
//   transition: all 0.2s ease;

//   &:hover {
//     opacity: 0.8;
//   }
// `;

// const LoadingMessage = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 1rem;
//   color: ${props => props.theme.colors.gray[600]};
//   font-size: 0.85rem;
// `;

// const LoadingSpinner = styled.div`
//   width: 16px;
//   height: 16px;
//   border: 2px solid ${props => props.theme.colors.gray[300]};
//   border-top: 2px solid ${props => props.theme.colors.primary};
//   border-radius: 50%;
//   animation: spin 1s linear infinite;

//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;

// const EditorFooter = styled.div`
//   padding: 0.75rem 1rem;
//   border-top: 1px solid ${props => props.theme.colors.gray[200]};
//   background: ${props => props.theme.colors.gray[50]};
// `;

// const WordCount = styled.span`
//   font-size: 0.8rem;
//   color: ${props => props.theme.colors.gray[500]};
// `;

export default AIEditor;