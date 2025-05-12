
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

  // Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('lastActivity');
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao sair:", authError);
      throw new Error(`Erro ao sair: ${authError.message}`);
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

  return {
    signIn,
    signOut,
    signUp,
    loading,
    setLoading
  };
};
