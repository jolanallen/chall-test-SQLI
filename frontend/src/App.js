import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import WritePost from './pages/WritePost';
import UpdateProfile from './pages/UpdateProfile';
import PublisherList from './pages/PublisherList';
import Feed from './pages/Feed';
import { AuthProvider, useAuth } from './context/AuthContext';

import './style.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      
      <Route path="/login" element={user ?  <Navigate to="/feed" />  : <Login />} />
      <Route path="/register" element={user ?  <Navigate to="/feed" />  :<Register />} />

      {/* Routes protégées, redirection vers /login si non connecté */}
      <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
      <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />} />
      <Route path="/write" element={user ? <WritePost /> : <Navigate to="/login" />} />
      <Route path="/update-profile" element={user ? <UpdateProfile /> : <Navigate to="/login" />} />
      <Route path="/publishers" element={user ? <PublisherList /> : <Navigate to="/login" />} />
      <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
