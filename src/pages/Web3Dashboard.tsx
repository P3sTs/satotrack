
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Web3Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirecionar automaticamente para o dashboard unificado
    if (isAuthenticated) {
      console.log('Redirecionando /web3 para /dashboard (unificado)');
    }
  }, [isAuthenticated]);

  // Redirecionar para o dashboard unificado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não autenticado, redirecionar para auth
  return <Navigate to="/auth" replace />;
};

export default Web3Dashboard;
