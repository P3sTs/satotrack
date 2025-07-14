import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { ResponsiveDashboard } from '@/components/dashboard/ResponsiveDashboard';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  // Aguardar carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tem usuário, redirecionar para home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Dashboard Principal */}
      <ResponsiveDashboard />
    </div>
  );
};

export default Dashboard;