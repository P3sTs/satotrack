
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login efetuado com sucesso",
            description: "Bem-vindo ao SatoTrack!",
          });
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Sessão encerrada",
            description: "Você foi desconectado com sucesso.",
          });
          navigate('/auth');
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Perfil atualizado",
            description: "Suas informações foram atualizadas com sucesso.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Erro ao fazer login';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Tente novamente.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
      }
      
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: errorMessage,
      });
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar sua conta.",
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Erro ao criar conta';
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message.includes('password')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      
      toast({
        variant: "destructive",
        title: "Falha no cadastro",
        description: errorMessage,
      });
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível encerrar a sessão.",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      signIn,
      signUp,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
