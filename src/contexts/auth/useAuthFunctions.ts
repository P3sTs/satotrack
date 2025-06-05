
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthError } from '@supabase/supabase-js';
import { checkPasswordStrength } from './passwordUtils';

export const useAuthFunctions = (
  updateLastActivity: () => void,
  saveLoginAttempt: (email: string, success: boolean) => void,
  checkFailedLoginAttempts: (email: string) => boolean
) => {
  const [loading, setLoading] = useState(false);

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e senha são obrigatórios.",
        variant: "destructive"
      });
      throw new Error("Email e senha são obrigatórios");
    }
    
    try {
      setLoading(true);
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (checkFailedLoginAttempts(sanitizedEmail)) {
        toast({
          title: "Conta bloqueada",
          description: "Muitas tentativas de login. Tente novamente em 15 minutos.",
          variant: "destructive"
        });
        throw new Error("Conta temporariamente bloqueada por muitas tentativas");
      }

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
      
      // Sem toast de sucesso para não atrapalhar a experiência
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao entrar:", authError);
      
      // Msg de erro amigável
      if (authError.message?.includes('Invalid login')) {
        throw new Error("Email ou senha incorretos");
      } else {
        throw new Error(`Erro ao entrar: ${authError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar atividade de usuário
      localStorage.removeItem('lastActivity');
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao sair:", authError);
      throw new Error(`Erro ao sair: ${authError.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Registro com validação de senha e código de referência
  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    if (!email || !password || !fullName) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome completo, email e senha são obrigatórios.",
        variant: "destructive"
      });
      throw new Error("Todos os campos são obrigatórios");
    }
    
    try {
      setLoading(true);
      
      // Verifica força da senha
      const { score, feedback } = checkPasswordStrength(password);
      if (score < 3) {
        throw new Error(`Senha insegura: ${feedback}`);
      }

      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = fullName.trim();
      
      // Se há código de referência, usar a Edge Function
      if (referralCode) {
        console.log('Using Edge Function for referral registration');
        
        const { data, error } = await supabase.functions.invoke('process-referral', {
          body: {
            email: sanitizedEmail,
            password,
            full_name: sanitizedName,
            referral_code: referralCode
          }
        });
        
        if (error) {
          console.error('Edge Function error:', error);
          throw new Error(error.message || 'Erro ao processar indicação');
        }
        
        toast({
          title: "Conta criada com sucesso!",
          description: data?.bonus || "Indicação registrada com sucesso!",
        });
        
      } else {
        // Registro normal sem referência
        const { error } = await supabase.auth.signUp({ 
          email: sanitizedEmail, 
          password,
          options: {
            data: {
              full_name: sanitizedName,
              created_at: new Date().toISOString()
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para ativar sua conta.",
        });
      }
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao registrar:", authError);
      
      // Melhor tratamento de erros
      if (authError.message?.includes('already registered')) {
        throw new Error("Este email já está registrado");
      } else if (authError.message?.includes('password')) {
        throw new Error("A senha não atende aos requisitos de segurança");
      } else {
        throw new Error(`Erro ao criar conta: ${authError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    signUp,
    loading,
    setLoading
  };
};
