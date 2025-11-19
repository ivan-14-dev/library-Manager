import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiBold, FiItalic, FiUnderline, FiList, FiLink, FiImage } from 'react-icons/fi';

const EditorContainer = styled.div`
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  &.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
`;

const EditorContent = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  border: none;
  outline: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;

  &:focus {
    outline: none;
  }
`;

const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: 0.875rem;
  color: #6c757d;
`;

const TextEditor = ({ value, onChange, placeholder = "Commencez à écrire votre histoire..." }) => {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const handleChange = (e) => {
    const content = e.target.value;
    onChange(content);
    
    // Calculer les statistiques
    setWordCount(content.split(/\s+/).filter(word => word.length > 0).length);
    setCharacterCount(content.length);
  };

  const applyFormat = (format) => {
    const textarea = document.getElementById('editor-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    let newSelectionStart = start;
    let newSelectionEnd = end;
    
    switch (format) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newSelectionStart = start + 2;
        newSelectionEnd = end + 2;
        break;
      case 'italic':
        newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        newSelectionStart = start + 1;
        newSelectionEnd = end + 1;
        break;
      case 'underline':
        newText = value.substring(0, start) + `__${selectedText}__` + value.substring(end);
        newSelectionStart = start + 2;
        newSelectionEnd = end + 2;
        break;
      case 'list':
        const lines = selectedText.split('\n');
        const listText = lines.map(line => `- ${line}`).join('\n');
        newText = value.substring(0, start) + listText + value.substring(end);
        newSelectionEnd = start + listText.length;
        break;
      case 'quote':
        newText = value.substring(0, start) + `> ${selectedText}` + value.substring(end);
        newSelectionStart = start + 2;
        newSelectionEnd = end + 2;
        break;
      default:
        break;
    }
    
    onChange(newText);
    
    // Restaurer la sélection
    setTimeout(() => {
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      textarea.focus();
    }, 0);
  };

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarButton onClick={() => applyFormat('bold')} title="Gras">
          <FiBold />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('italic')} title="Italique">
          <FiItalic />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('underline')} title="Souligné">
          <FiUnderline />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('list')} title="Liste">
          <FiList />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('quote')} title="Citation">
          <FiQuoteLeft size={24} />
        </ToolbarButton>
        <ToolbarButton title="Lien (bientôt disponible)" disabled>
          <FiLink />
        </ToolbarButton>
        <ToolbarButton title="Image (bientôt disponible)" disabled>
          <FiImage />
        </ToolbarButton>
      </Toolbar>
      
      <EditorContent
        id="editor-textarea"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      
      <EditorFooter>
        <div>
          {wordCount} mots • {characterCount} caractères
        </div>
        <div>
          {Math.ceil(wordCount / 200)} min de lecture
        </div>
      </EditorFooter>
    </EditorContainer>
  );
};

export default TextEditor;