
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Interface para login attempts
interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  passwordStrength: (password: string) => { score: number; feedback: string };
  lastActivity: number | null;
  updateLastActivity: () => void;
  securityStatus: 'secure' | 'warning' | 'danger';
  failedLoginAttempts: number;
  resetFailedLoginAttempts: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Função para verificar força da senha
const checkPasswordStrength = (password: string): { score: number; feedback: string } => {
  let score = 0;
  let feedback = '';
  
  // Comprimento mínimo
  if (password.length >= 8) score += 1;
  else feedback = 'Senha muito curta';
  
  // Caracteres especiais
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  // Letras maiúsculas
  if (/[A-Z]/.test(password)) score += 1;
  
  // Letras minúsculas
  if (/[a-z]/.test(password)) score += 1;
  
  // Números
  if (/[0-9]/.test(password)) score += 1;
  
  // Feedback baseado na pontuação
  if (score === 0) feedback = 'Senha muito fraca';
  else if (score <= 2) feedback = 'Senha fraca';
  else if (score <= 3) feedback = 'Senha média';
  else if (score === 4) feedback = 'Senha forte';
  else feedback = 'Senha muito forte';
  
  return { score, feedback };
};

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'danger'>('secure');
  
  const navigate = useNavigate();
  
  // Timeout de inatividade em minutos
  const INACTIVITY_TIMEOUT = 30;
  
  // Limite de tentativas de login
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOGIN_COOLDOWN_PERIOD = 15 * 60 * 1000; // 15 minutos em ms

  // Atualiza atividade do usuário
  const updateLastActivity = () => {
    const now = Date.now();
    setLastActivity(now);
    localStorage.setItem('lastActivity', now.toString());
  };
  
  // Verifica se há muitas tentativas de login falhas
  const checkFailedLoginAttempts = (email: string): boolean => {
    const now = Date.now();
    const recentAttempts = loginAttempts
      .filter(attempt => attempt.email === email && 
              !attempt.success && 
              (now - attempt.timestamp) < LOGIN_COOLDOWN_PERIOD);
    
    return recentAttempts.length >= MAX_LOGIN_ATTEMPTS;
  };
  
  // Retorna o número de tentativas falhas
  const getFailedLoginAttempts = (): number => {
    const now = Date.now();
    return loginAttempts
      .filter(attempt => !attempt.success && 
              (now - attempt.timestamp) < LOGIN_COOLDOWN_PERIOD).length;
  };
  
  // Reseta contador de tentativas
  const resetFailedLoginAttempts = () => {
    setLoginAttempts([]);
    localStorage.removeItem('loginAttempts');
  };

  // Salva tentativas no localStorage para persistência
  const saveLoginAttempt = (email: string, success: boolean) => {
    const attempt: LoginAttempt = { email, timestamp: Date.now(), success };
    const newAttempts = [...loginAttempts, attempt];
    setLoginAttempts(newAttempts);
    
    try {
      localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));
    } catch (e) {
      console.error('Erro ao salvar tentativas de login:', e);
    }
  };

  // Carrega dados de localStorage ao iniciar
  useEffect(() => {
    try {
      const storedLastActivity = localStorage.getItem('lastActivity');
      if (storedLastActivity) {
        setLastActivity(parseInt(storedLastActivity));
      }
      
      const storedLoginAttempts = localStorage.getItem('loginAttempts');
      if (storedLoginAttempts) {
        setLoginAttempts(JSON.parse(storedLoginAttempts));
      }
    } catch (e) {
      console.error('Erro ao carregar dados do localStorage:', e);
    }
  }, []);

  // Verifica inatividade a cada minuto
  useEffect(() => {
    if (session && lastActivity) {
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
  }, [session, lastActivity]);

  // Efeito para atualizar status de segurança
  useEffect(() => {
    const failedCount = getFailedLoginAttempts();
    if (failedCount >= MAX_LOGIN_ATTEMPTS - 1) {
      setSecurityStatus('danger');
    } else if (failedCount >= MAX_LOGIN_ATTEMPTS / 2) {
      setSecurityStatus('warning');
    } else {
      setSecurityStatus('secure');
    }
  }, [loginAttempts]);

  // Monitoramento de eventos de autenticação
  useEffect(() => {
    // Configura o listener de eventos de auth PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          updateLastActivity();
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    // DEPOIS verifica sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) updateLastActivity();
      setLoading(false);
    });

    // Adiciona listener para atividade do usuário
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleUserActivity = () => {
      if (user) updateLastActivity();
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      subscription.unsubscribe();
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [navigate, user]);

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    if (checkFailedLoginAttempts(email)) {
      toast({
        title: "Conta bloqueada",
        description: `Muitas tentativas de login. Tente novamente em 15 minutos.`,
        variant: "destructive"
      });
      throw new Error("Conta temporariamente bloqueada por muitas tentativas");
    }

    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({ 
        email: sanitizedEmail, 
        password 
      });
      
      if (error) {
        saveLoginAttempt(sanitizedEmail, false);
        throw error;
      }
      
      saveLoginAttempt(sanitizedEmail, true);
      updateLastActivity();
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao entrar:", authError);
      
      // Msg de erro amigável
      if (authError.message.includes('Invalid login')) {
        throw new Error("Email ou senha incorretos");
      } else {
        throw new Error(`Erro ao entrar: ${authError.message}`);
      }
    }
  };

  // Registro com validação de senha
  const signUp = async (email: string, password: string, fullName: string) => {
    // Verifica força da senha
    const { score, feedback } = checkPasswordStrength(password);
    if (score < 3) {
      throw new Error(`Senha insegura: ${feedback}`);
    }

    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signUp({ 
        email: sanitizedEmail, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para ativar sua conta.",
      });
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao registrar:", authError);
      
      // Melhor tratamento de erros
      if (authError.message.includes('already registered')) {
        throw new Error("Este email já está registrado");
      } else if (authError.message.includes('password')) {
        throw new Error("A senha não atende aos requisitos de segurança");
      } else {
        throw new Error(`Erro ao criar conta: ${authError.message}`);
      }
    }
  };

  // Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setLastActivity(null);
      localStorage.removeItem('lastActivity');
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao sair:", authError);
      throw new Error(`Erro ao sair: ${authError.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      signIn,
      signUp,
      signOut,
      loading,
      isAuthenticated: !!user,
      passwordStrength: checkPasswordStrength,
      lastActivity,
      updateLastActivity,
      securityStatus,
      failedLoginAttempts: getFailedLoginAttempts(),
      resetFailedLoginAttempts
    }}>
      {children}
    </AuthContext.Provider>
  );
};
