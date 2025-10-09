import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiArrowLeft, FiBook, FiUser, FiClock, FiEye } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { booksAPI } from '../api/auth.js';

const BookContainer = styled.div`
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  font-weight: 500;
  margin-bottom: 2rem;
  padding: 0.5rem 0;

  &:hover {
    color: #0056b3;
  }
`;

const BookHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const BookCover = styled.div`
  width: 300px;
  height: 400px;
  margin: 0 auto 2rem;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;

  &:not([style]) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const BookTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const BookMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #6c757d;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const BookContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h1, h2, h3, h4, h5, h6 {
    color: #2c3e50;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.8;
    font-size: 1.1rem;
  }
  
  blockquote {
    border-left: 4px solid #007bff;
    padding-left: 1rem;
    margin-left: 0;
    color: #6c757d;
    font-style: italic;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #6c757d;
`;

const Error = styled.div`
  text-align: center;
  padding: 3rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 0.5rem;
  margin: 2rem 0;
`;

const PublicPersonalBook = () => {
  const { id } = useParams();

  const { data: book, isLoading, error } = useQuery(
    ['public-personal-book', id],
    () => booksAPI.getPublicPersonalBook(id),
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <BookContainer className="container">
        <Loading>Chargement du livre...</Loading>
      </BookContainer>
    );
  }

  if (error) {
    return (
      <BookContainer className="container">
        <Error>
          <h2>Livre non trouvé</h2>
          <p>Ce livre n'existe pas ou n'est pas accessible au public.</p>
          <BackButton to="/books">
            <FiArrowLeft /> Retour au catalogue
          </BackButton>
        </Error>
      </BookContainer>
    );
  }

  return (
    <BookContainer>
      <BackButton to="/books">
        <FiArrowLeft /> Retour au catalogue
      </BackButton>

      <BookHeader>
        <BookCover image={book?.cover_image}>
          {!book?.cover_image && <FiBook />}
        </BookCover>
        
        <BookTitle>{book?.title}</BookTitle>
        
        <BookMeta>
          <MetaItem>
            <FiUser />
            Par {book?.user?.first_name} {book?.user?.last_name}
          </MetaItem>
          
          <MetaItem>
            <FiClock />
            {book?.reading_time} min de lecture
          </MetaItem>
          
          <MetaItem>
            <FiEye />
            {book?.word_count} mots
          </MetaItem>
        </BookMeta>
        
        {book?.summary && (
          <p style={{ color: '#6c757d', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {book.summary}
          </p>
        )}
      </BookHeader>

      <AuthorInfo>
        <AuthorAvatar>
          <FiUser />
        </AuthorAvatar>
        <div>
          <strong>{book?.user?.first_name} {book?.user?.last_name}</strong>
          <div>Membre depuis {new Date(book?.user?.created_at).getFullYear()}</div>
        </div>
      </AuthorInfo>

      <BookContent>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {book?.content}
        </ReactMarkdown>
      </BookContent>
    </BookContainer>
  );
};

export default PublicPersonalBook;