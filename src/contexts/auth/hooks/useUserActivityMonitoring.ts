
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useUserActivityMonitoring = (
  isAuthenticated: boolean,
  updateLastActivity: () => void,
  location: any
) => {
  // Monitorar mudanças de rota para usuários autenticados
  useEffect(() => {
    if (isAuthenticated) {
      updateLastActivity();
    }
  }, [location.pathname, isAuthenticated]); // Removido updateLastActivity das dependências para evitar loop

  // Monitorar atividade do usuário
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleUserActivity = () => {
      updateLastActivity();
    };

    // Eventos que indicam atividade do usuário
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    // Throttle para evitar muitas chamadas
    let lastActivity = 0;
    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastActivity > 30000) { // 30 segundos de throttle
        lastActivity = now;
        handleUserActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, throttledHandler, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledHandler);
      });
    };
  }, [isAuthenticated]); // Removido updateLastActivity das dependências
};
