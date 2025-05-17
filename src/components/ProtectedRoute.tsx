
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated, updateLastActivity, securityStatus } = useAuth();
  const location = useLocation();
  
  // Update activity when route changes
  useEffect(() => {
    if (isAuthenticated) {
      updateLastActivity();
      console.log("Activity updated in protected route, user:", !!user);
    }
  }, [isAuthenticated, location.pathname, updateLastActivity]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="space-y-4 w-4/5 max-w-md">
          <Skeleton className="h-10 w-10 rounded-full mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // Redirect to authentication if no user
  if (!user) {
    console.log("No user found in protected route, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("Protected route rendering content with user:", !!user);
  
  // Render content with security alert if needed
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
