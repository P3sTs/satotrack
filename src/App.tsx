
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/auth';
import AppLayout from './components/layout/AppLayout';

// Pages
import Index from './pages/Index';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CarteiraDetalhes from './pages/CarteiraDetalhes';
import Mercado from './pages/Mercado';
import WalletsManager from './pages/WalletsManager';
import Configuracoes from './pages/Configuracoes';
import Historico from './pages/Historico';
import NotFound from './pages/NotFound';
import NovaCarteira from './pages/NovaCarteira';
import Sobre from './pages/Sobre';
import Privacidade from './pages/Privacidade';
import PlanosPage from './pages/PlanosPage';
import Notificacoes from './pages/Notificacoes';
import ApiDocs from './pages/ApiDocs';
import Crypto from './pages/Crypto';
import ProjecaoLucros from './pages/ProjecaoLucros';

// Protected route component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { updateLastActivity, isAuthenticated, loading } = useAuth();
  
  // Monitor user activity
  useEffect(() => {
    // Update activity timer
    const handleActivity = () => {
      updateLastActivity();
    };
    
    // Add event listeners
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('mousemove', handleActivity);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
    };
  }, [updateLastActivity]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/planos" element={<PlanosPage />} />
      <Route path="/mercado" element={<Mercado />} />
      
      {/* Crypto page - accessible to all users */}
      <Route path="/crypto" element={<Crypto />} />
      
      <Route path="/" element={<AppLayout />}>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/carteira/:id" 
          element={
            <ProtectedRoute>
              <CarteiraDetalhes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/carteiras" 
          element={
            <ProtectedRoute>
              <WalletsManager />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/nova-carteira" 
          element={
            <ProtectedRoute>
              <NovaCarteira />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configuracoes" 
          element={
            <ProtectedRoute>
              <Configuracoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/historico" 
          element={
            <ProtectedRoute>
              <Historico />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notificacoes" 
          element={
            <ProtectedRoute>
              <Notificacoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/api-docs" 
          element={
            <ProtectedRoute>
              <ApiDocs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projecao-lucros" 
          element={
            <ProtectedRoute>
              <ProjecaoLucros />
            </ProtectedRoute>
            
          }
        />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
