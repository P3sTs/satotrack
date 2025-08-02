
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Aguardar carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard unificado...</p>
        </div>
      </div>
    );
  }

  // Se não tem usuário, redirecionar para home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`relative min-h-screen bg-background ${isMobile ? 'pb-20' : ''}`}>
      {/* Dashboard Unificado com padding bottom no mobile para a navigation bar */}
      <div className={isMobile ? 'px-2 py-4' : 'p-6'}>
        <UnifiedDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
