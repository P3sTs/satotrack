
import { ReactNode } from 'react';
import { useAuth } from '../contexts/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated, updateLastActivity, securityStatus } = useAuth();
  const location = useLocation();
  
  // Atualiza atividade do usuário ao navegar entre rotas protegidas
  useEffect(() => {
    if (isAuthenticated) {
      updateLastActivity();
    }
  }, [isAuthenticated, location.pathname, updateLastActivity]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bitcoin"></div>
      </div>
    );
  }

  // Redireciona para autenticação se não houver usuário
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Aviso de segurança quando apropriado  
  return (
    <>
      {securityStatus !== 'secure' && (
        <Alert variant={securityStatus === 'danger' ? 'destructive' : 'default'} className="mb-4 mx-4 mt-4">
          {securityStatus === 'danger' ? <ShieldAlert className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>
            {securityStatus === 'danger' ? 'Alerta de Segurança' : 'Atenção'}
          </AlertTitle>
          <AlertDescription>
            {securityStatus === 'danger' 
              ? 'Detectamos atividade suspeita em sua conta. Considere alterar sua senha.' 
              : 'Sua sessão está próxima de expirar por inatividade.'}
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
