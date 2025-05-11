
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Timeout de inatividade em minutos
const INACTIVITY_TIMEOUT = 30;

export const useActivityMonitor = (
  user: User | null, 
  signOut: () => Promise<void>
) => {
  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'danger'>('secure');

  // Atualiza atividade do usuário
  const updateLastActivity = () => {
    const now = Date.now();
    setLastActivity(now);
    localStorage.setItem('lastActivity', now.toString());
  };

  // Carrega dados de localStorage ao iniciar
  useEffect(() => {
    try {
      const storedLastActivity = localStorage.getItem('lastActivity');
      if (storedLastActivity) {
        setLastActivity(parseInt(storedLastActivity));
      }
    } catch (e) {
      console.error('Erro ao carregar dados do localStorage:', e);
    }
  }, []);

  // Adiciona listener para atividade do usuário
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleUserActivity = () => {
      if (user) updateLastActivity();
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user]);

  // Verifica inatividade a cada minuto
  useEffect(() => {
    if (user && lastActivity) {
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
          signOut();
        } else if (inactiveTime > (INACTIVITY_TIMEOUT * 60 * 1000) / 2) {
          // Aviso de inatividade
          setSecurityStatus('warning');
        }
      }, 60000); // Verifica a cada minuto
      
      return () => clearInterval(checkInactivity);
    }
  }, [user, lastActivity, signOut]);

  return {
    lastActivity,
    updateLastActivity,
    securityStatus,
    setSecurityStatus,
    setLastActivity  // Also export setLastActivity function
  };
};
