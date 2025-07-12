import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface GuestSession {
  id: string;
  type: 'guest';
  accessLevel: 'read_only';
  expiresAt: Date;
  generatedAt: Date;
}

export const useGuestAccess = () => {
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se existe sessão guest no localStorage
    const storedSession = localStorage.getItem('guest_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const expiresAt = new Date(session.expiresAt);
        
        if (expiresAt > new Date()) {
          setGuestSession({
            ...session,
            expiresAt,
            generatedAt: new Date(session.generatedAt)
          });
          setIsGuestMode(true);
        } else {
          // Sessão expirada
          localStorage.removeItem('guest_session');
          toast.error('Sua sessão de visitante expirou. Crie uma conta para continuar.');
        }
      } catch (error) {
        localStorage.removeItem('guest_session');
      }
    }
  }, []);

  const createGuestSession = (ticketCode: string = '') => {
    const session: GuestSession = {
      id: `guest_${Date.now()}`,
      type: 'guest',
      accessLevel: 'read_only',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
      generatedAt: new Date()
    };

    localStorage.setItem('guest_session', JSON.stringify(session));
    localStorage.setItem('guest_demo_mode', 'true'); // Flag para dados demo
    setGuestSession(session);
    setIsGuestMode(true);
    
    toast.success('Acesso temporário ativado! Você tem 1 hora para explorar.');
    navigate('/dashboard');
  };

  const interceptAction = (actionName: string, callback?: () => void) => {
    if (isGuestMode) {
      // Salvar onde o usuário estava tentando ir
      sessionStorage.setItem('continue_from', window.location.pathname);
      sessionStorage.setItem('pending_action', actionName);
      
      toast.error(`Para ${actionName}, você precisa criar uma conta.`);
      navigate('/auth');
      return false;
    }
    
    callback?.();
    return true;
  };

  const endGuestSession = () => {
    localStorage.removeItem('guest_session');
    setGuestSession(null);
    setIsGuestMode(false);
  };

  const getRemainingTime = () => {
    if (!guestSession) return 0;
    return Math.max(0, guestSession.expiresAt.getTime() - Date.now());
  };

  const formatRemainingTime = () => {
    const remaining = getRemainingTime();
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    guestSession,
    isGuestMode,
    createGuestSession,
    interceptAction,
    endGuestSession,
    getRemainingTime,
    formatRemainingTime
  };
};