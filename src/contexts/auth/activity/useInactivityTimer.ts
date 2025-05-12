
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Timeout de inatividade em minutos
const INACTIVITY_TIMEOUT = 30;

export const useInactivityTimer = (
  isAuthenticated: boolean,
  lastActivity: number | null,
  onTimeout: () => Promise<void>
) => {
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'danger'>('secure');

  // Verifica inatividade a cada minuto
  useEffect(() => {
    if (isAuthenticated && lastActivity) {
      const checkInactivity = setInterval(() => {
        const now = Date.now();
        const inactiveTime = now - lastActivity;
        
        // Conversão para minutos
        if (inactiveTime > INACTIVITY_TIMEOUT * 60 * 1000) {
          // Auto logout por inatividade
          toast({
            title: "Sessão expirada",
            description: "Você foi desconectado por inatividade",
            variant: "destructive",
          });
          onTimeout();
        } else if (inactiveTime > (INACTIVITY_TIMEOUT * 60 * 1000) / 2) {
          // Aviso de inatividade
          setSecurityStatus('warning');
        }
      }, 60000); // Verifica a cada minuto
      
      return () => clearInterval(checkInactivity);
    }
  }, [isAuthenticated, lastActivity, onTimeout]);

  return { securityStatus, setSecurityStatus };
};
