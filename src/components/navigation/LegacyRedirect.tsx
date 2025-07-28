import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LegacyRedirectProps {
  from: string;
  to: string;
  message?: string;
}

const LegacyRedirect: React.FC<LegacyRedirectProps> = ({ 
  from, 
  to, 
  message = 'Redirecionando para o dashboard unificado...' 
}) => {
  useEffect(() => {
    console.log(`🔄 Redirecionamento legado: ${from} → ${to}`);
    toast.info(message, {
      duration: 3000,
    });
  }, [from, to, message]);

  return <Navigate to={to} replace />;
};

export default LegacyRedirect;