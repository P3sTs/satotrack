
import { ReactNode } from 'react';
import { useAuth } from '../contexts/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { securityStatus } = useAuth();
  
  // Renderizar apenas o conteúdo com alertas de segurança se necessário
  // O redirecionamento é feito no App.tsx
  return (
    <>
      {securityStatus !== 'secure' && (
        <Alert 
          variant={securityStatus === 'danger' ? 'destructive' : 'default'} 
          className="mb-4 mx-4 animate-fade-in"
        >
          {securityStatus === 'danger' ? <ShieldAlert className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle className="font-medium">
            {securityStatus === 'danger' ? 'Alerta de Segurança' : 'Atenção'}
          </AlertTitle>
          <AlertDescription>
            {securityStatus === 'danger' 
              ? 'Detectamos atividade suspeita em sua conta. Considere alterar sua senha imediatamente.' 
              : 'Sua sessão está próxima de expirar por inatividade. Por favor, continue navegando para manter sua sessão ativa.'}
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
