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
    console.log('🔍 useGuestAccess: Verificando sessão guest...');
    
    // Verificar se existe sessão guest no localStorage
    const storedSession = localStorage.getItem('guest_session');
    const isDemoMode = localStorage.getItem('guest_demo_mode') === 'true';
    
    console.log('📦 Sessão armazenada:', !!storedSession);
    console.log('🎭 Modo demo:', isDemoMode);
    
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const expiresAt = new Date(session.expiresAt);
        
        console.log('⏰ Sessão expira em:', expiresAt);
        console.log('🕐 Agora:', new Date());
        
        if (expiresAt > new Date()) {
          console.log('✅ Sessão guest válida - ativando modo convidado');
          setGuestSession({
            ...session,
            expiresAt,
            generatedAt: new Date(session.generatedAt)
          });
          setIsGuestMode(true);
        } else {
          console.log('❌ Sessão guest expirada - removendo');
          localStorage.removeItem('guest_session');
          localStorage.removeItem('guest_demo_mode');
          toast.error('Sua sessão de visitante expirou. Crie uma conta para continuar.');
        }
      } catch (error) {
        console.error('❌ Erro ao processar sessão guest:', error);
        localStorage.removeItem('guest_session');
        localStorage.removeItem('guest_demo_mode');
      }
    } else {
      console.log('ℹ️ Nenhuma sessão guest encontrada');
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
    console.log('🚪 Encerrando sessão guest');
    localStorage.removeItem('guest_session');
    localStorage.removeItem('guest_demo_mode');
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