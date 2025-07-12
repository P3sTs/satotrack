import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { ResponsiveDashboard } from '@/components/dashboard/ResponsiveDashboard';
import { GuestTimer } from '@/components/guest/GuestTimer';
import { Badge } from '@/components/ui/badge';
import { Eye, User, UserX } from 'lucide-react';
import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel';

const Dashboard: React.FC = () => {
  const { user, isGuestMode, loading } = useAuth();

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

  // Se não tem usuário e não é modo convidado, redirecionar para home
  if (!user && !isGuestMode) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Indicador de Modo - Fixed no topo */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {isGuestMode ? (
          <>
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/10">
              <Eye className="h-3 w-3 mr-1" />
              Demo
            </Badge>
            <GuestTimer />
          </>
        ) : user ? (
          <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
            <User className="h-3 w-3 mr-1" />
            Conta Ativa
          </Badge>
        ) : (
          <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10">
            <UserX className="h-3 w-3 mr-1" />
            Não Autenticado
          </Badge>
        )}
      </div>

      {/* Dashboard Principal */}
      <ResponsiveDashboard />
      
      {/* Debug Panel */}
      <AuthDebugPanel />

      {/* Aviso para modo demo */}
      {isGuestMode && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <p className="text-sm text-orange-400">
              <strong>Modo Demonstração:</strong> Dados fictícios para teste. Crie sua conta para acessar recursos reais.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;