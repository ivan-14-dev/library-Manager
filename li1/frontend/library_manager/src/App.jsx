import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import DashboardStudent from './pages/DashboardStudent.jsx';
import DashboardProfessor from './pages/DashboardProfessor.jsx';
import DashboardLibrarian from './pages/DashboardLibrarian.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';


// BookPersonnel
import PersonalBooks from './pages/PersonalBooks.jsx';
import PersonalBookEditor from './pages/PersonalBookEditor.jsx';
import PublicPersonalBook from './pages/PublicPersonalBook.jsx';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

function App() {
  return (
    <AppContainer>
      <Header />
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
            <ProtectedRoute  allowedRoles={['STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN']}>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardStudent />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/professor" element={
            <ProtectedRoute allowedRoles={['PROFESSOR']}>
              <DashboardProfessor />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/librarian" element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <DashboardLibrarian />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardAdmin />
            </ProtectedRoute>
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
          
          <Route path="/library/personal/:id" element={<PublicPersonalBook />} />
        </Routes>
      </Main>
      <Footer />
    </AppContainer>
  );
}

export default App;