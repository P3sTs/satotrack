
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LoginSecurityAlertProps {
  failedAttempts: number;
}

export const LoginSecurityAlert: React.FC<LoginSecurityAlertProps> = ({ failedAttempts }) => {
  if (failedAttempts === 0) return null;
  
  return (
    <Alert variant="default" className="mb-4 bg-yellow-500/10 border-yellow-500/50">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {failedAttempts >= 3 
          ? `Alerta: ${failedAttempts} tentativas de login falhas recentes` 
          : `${failedAttempts} tentativa(s) de login falha(s)`}
      </AlertDescription>
    </Alert>
  );
};
