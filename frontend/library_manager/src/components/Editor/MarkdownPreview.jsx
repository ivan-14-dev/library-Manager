import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PreviewContainer = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1.5rem;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  
  h1, h2, h3, h4, h5, h6 {
    color: #2c3e50;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  h1 {
    font-size: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 0.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  blockquote {
    border-left: 4px solid #007bff;
    padding-left: 1rem;
    margin-left: 0;
    color: #6c757d;
    font-style: italic;
  }
  
  strong {
    font-weight: 600;
    color: #2c3e50;
  }
  
  em {
    font-style: italic;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  code {
    background: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1rem;
    
    code {
      background: none;
      padding: 0;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6c757d;
  text-align: center;
  
  h3 {
    color: #6c757d;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 0;
  }
`;

const MarkdownPreview = ({ content }) => {
  if (!content || content.trim() === '') {
    return (
      <PreviewContainer>
        <EmptyState>
          <h3>Aucun contenu à prévisualiser</h3>
          <p>Commencez à écrire pour voir la prévisualisation ici</p>
        </EmptyState>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </PreviewContainer>
  );
};

export default MarkdownPreview;