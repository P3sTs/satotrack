
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
      
      console.log("Tentando fazer login para:", sanitizedEmail);
      
      if (checkFailedLoginAttempts(sanitizedEmail)) {
        toast({
          title: "Conta bloqueada",
          description: "Muitas tentativas de login. Tente novamente em 15 minutos.",
          variant: "destructive"
        });
        throw new Error("Conta temporariamente bloqueada por muitas tentativas");
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: sanitizedEmail, 
        password 
      });
      
      if (error) {
        console.error("Erro no login:", error);
        saveLoginAttempt(sanitizedEmail, false);
        throw error;
      }
      
      if (data.session) {
        console.log("Login bem-sucedido, sessão criada:", !!data.session.access_token);
        saveLoginAttempt(sanitizedEmail, true);
        updateLastActivity();
        
        toast({
          title: "Login realizado",
          description: "Você foi autenticado com sucesso.",
        });
      } else {
        throw new Error("Sessão não foi criada após login");
      }
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao entrar:", authError);
      
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
      console.log("Fazendo logout...");
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('lastActivity');
      console.log("Logout realizado com sucesso");
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao sair:", authError);
      throw new Error(`Erro ao sair: ${authError.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Registro com login automático
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
      
      console.log("Iniciando processo de criação de conta...");
      
      // Verifica força da senha
      const { score, feedback } = checkPasswordStrength(password);
      if (score < 3) {
        throw new Error(`Senha insegura: ${feedback}`);
      }

      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedName = fullName.trim();
      
      console.log("Email sanitizado:", sanitizedEmail);
      console.log("Código de referência:", referralCode || "nenhum");
      
      // Primeiro, realizar o registro padrão
      await performStandardSignUp(sanitizedEmail, password, sanitizedName);
      
      // Aguardar um pouco para garantir que o trigger foi executado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Se há código de referência, processar depois do registro
      if (referralCode && referralCode.trim()) {
        console.log('Processando código de referência após registro...');
        
        try {
          const { data, error } = await supabase.functions.invoke('process-referral', {
            body: {
              email: sanitizedEmail,
              referral_code: referralCode.trim()
            }
          });
          
          if (error) {
            console.warn('Erro ao processar indicação, mas conta foi criada:', error);
          } else {
            console.log('Indicação processada com sucesso:', data);
            toast({
              title: "Conta criada com bônus!",
              description: data?.bonus || "Indicação registrada com sucesso!",
            });
          }
        } catch (referralError) {
          console.warn('Falha ao processar indicação, mas conta foi criada:', referralError);
        }
      }
      
      // Login automático após registro
      await performAutoLogin(sanitizedEmail, password);
      
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao registrar:", authError);
      
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

  // Função auxiliar para registro padrão
  const performStandardSignUp = async (email: string, password: string, fullName: string) => {
    console.log("Realizando registro padrão...");
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          created_at: new Date().toISOString()
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      console.error("Erro no registro padrão:", error);
      throw error;
    }
    
    console.log("Registro padrão realizado:", !!data.user);
    return data;
  };

  // Função auxiliar para login automático
  const performAutoLogin = async (email: string, password: string) => {
    console.log("Tentando login automático após registro...");
    
    try {
      // Aguardar um pouco para o usuário ser processado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (loginError) {
        console.warn("Login automático falhou:", loginError.message);
        toast({
          title: "Conta criada com sucesso",
          description: "Faça login para acessar sua conta.",
        });
        return;
      }
      
      if (loginData.session?.access_token) {
        console.log("Login automático bem-sucedido!");
        updateLastActivity();
        
        toast({
          title: "Conta criada e login realizado!",
          description: "Redirecionando para o dashboard...",
        });
        
        // Aguardar um pouco antes do redirecionamento
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
      
    } catch (autoLoginError) {
      console.warn("Erro no login automático:", autoLoginError);
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email ou faça login manualmente.",
      });
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
