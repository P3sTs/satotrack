
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface LoginSecurityAlertProps {
  failedAttempts: number;
}

export const LoginSecurityAlert: React.FC<LoginSecurityAlertProps> = ({ failedAttempts }) => {
  if (failedAttempts === 0) return null;
  
  const isHighSeverity = failedAttempts >= 3;
  
  return (
    <Alert 
      variant={isHighSeverity ? "destructive" : "default"} 
      className={`mb-4 ${isHighSeverity ? 'border-red-500/50' : 'bg-yellow-500/10 border-yellow-500/50'} w-full`}
    >
      {isHighSeverity ? <ShieldAlert className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertDescription className="font-medium">
        {isHighSeverity 
          ? `Alerta de segurança: ${failedAttempts} tentativas de login falhas recentes` 
          : `${failedAttempts} tentativa(s) de login falha(s)`}
      </AlertDescription>
    </Alert>
  );
};
