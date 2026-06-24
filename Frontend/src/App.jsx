import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FileProvider } from './context/FileContext';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Trash from './pages/Trash';
import SharedFile from './pages/SharedFile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F0F0F] text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/share/:token" element={<SharedFile />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <FileProvider>
            <AppLayout />
          </FileProvider>
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="trash" element={<Trash />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
