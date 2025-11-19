import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';

// BookPersonnel
import PersonalBooks from './pages/PersonalBooks.jsx';
import PersonalBookEditor from './pages/PersonalBookEditor.jsx';
import PublicPersonalBook from './pages/PublicPersonalBook.jsx';
import PublicPublications from './pages/PublicPublications.jsx';
import Editeur from './pages/Editeur.jsx';

import NewRelease from './pages/New.jsx';
import Popular from './pages/Popular.jsx';
import EBook from './pages/Ebook.jsx';
import Articles from './pages/Articles.jsx';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 0rem 0;
`;

function App() {
  return (
    <AppContainer>
      <Main>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Catalog />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes protégées */}
          <Route path="/profile" element={
            <ProtectedRoute  allowedRoles={['STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN','VISITOR']}>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Routes pour le help /help */}
          <Route path="/help" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN','VISITOR']}>
              {/* Composant Help à créer */}
              <div>Help Page - To be implemented</div>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN']}>
              <div>Settings Page - To be implemented</div>
            </ProtectedRoute>
          } />

          <Route path="/Notifications" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN','VISITOR']}>
              <div>Notifications Page - To be implemented</div>
            </ProtectedRoute>
          } />

          {/* Editeur personnel */}
          <Route path="/personal-editor" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN']}>
              <Editeur/>
            </ProtectedRoute>
          } /> 


          <Route path = "/dashboard" element = {
            <Dashboard/>
          } />

          {/* Livres personnels */}
          <Route path="/personal-books" element={
            <ProtectedRoute>
              <PersonalBooks />
            </ProtectedRoute>
          } />
          
          <Route path="/personal-books/new" element={
            <ProtectedRoute>
              <PersonalBookEditor />
            </ProtectedRoute>
          } />
          
          <Route path="/personal-books/:id" element={
            <ProtectedRoute>
              <PersonalBookEditor />
            </ProtectedRoute>
          } />

          <Route path="/new" element={<NewRelease />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/ebook" element={<EBook />} />
          <Route path="/articles" element={<Articles />} />

          <Route path="/library/personal/:id" element={<PublicPersonalBook />} />
          <Route path="/publications" element={<PublicPublications />} />
        </Routes>
      </Main>
    </AppContainer>
  );
}

export default App;