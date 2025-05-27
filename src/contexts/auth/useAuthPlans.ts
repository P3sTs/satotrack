
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthUser, PlanType } from './types';

export const useAuthPlans = (user: AuthUser | null) => {
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [apiRequestsRemaining, setApiRequestsRemaining] = useState<number>(1000);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar plano do usuário do banco de dados
  const fetchUserPlan = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select('plan_type, api_token, api_requests')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar plano do usuário:', error);
        return;
      }
      
      if (data) {
        setUserPlan(data.plan_type as PlanType);
        setApiToken(data.api_token);
        setApiRequestsRemaining(data.api_requests || 1000);
      }
    } catch (error) {
      console.error('Erro em fetchUserPlan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar status da assinatura via Stripe
  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Erro ao verificar assinatura:', error);
        return;
      }
      
      if (data) {
        setUserPlan(data.plan_type as PlanType);
        toast({
          title: "Status da assinatura atualizado",
          description: data.subscribed ? "Você tem uma assinatura ativa!" : "Nenhuma assinatura ativa encontrada.",
        });
      }
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar sessão de checkout do Stripe
  const createCheckoutSession = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upgrade.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Erro ao criar sessão de checkout:', error);
        toast({
          title: "Erro",
          description: "Não foi possível iniciar o processo de pagamento. Tente novamente.",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.url) {
        // Abrir checkout do Stripe em nova aba
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir portal do cliente para gerenciar assinatura
  const openCustomerPortal = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Erro ao abrir portal do cliente:', error);
        toast({
          title: "Erro",
          description: "Não foi possível abrir o portal de gerenciamento.",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.url) {
        // Abrir portal do cliente em nova aba
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza o plano do usuário para premium (mantido para compatibilidade)
  const upgradeUserPlan = async () => {
    await createCheckoutSession();
  };

  // Gera token de API para usuários premium
  const generateApiToken = async () => {
    try {
      if (!user || !user.id) throw new Error('Usuário não autenticado');
      if (!user.email_confirmed_at) throw new Error('Email não verificado');
      if (userPlan !== 'premium') throw new Error('Tokens de API estão disponíveis apenas para usuários premium');
      
      setIsLoading(true);
      
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('user_plans')
        .upsert({ 
          user_id: user.id, 
          api_token: token,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setApiToken(token);
      toast({
        title: "API Token gerado",
        description: "Seu novo token de API foi gerado com sucesso.",
      });
      
      return token;
    } catch (error) {
      console.error('Erro ao gerar token de API:', error);
      
      let errorMessage = "Não foi possível gerar o token de API.";
      
      if (error instanceof Error) {
        if (error.message.includes('Email não verificado')) {
          errorMessage = "Verifique seu email antes de gerar um token de API.";
        } else if (error.message.includes('apenas para usuários premium')) {
          errorMessage = "Tokens de API estão disponíveis apenas para usuários premium.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro ao gerar token",
        description: errorMessage,
        variant: "destructive"
      });
      
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  // Calcula se o usuário pode adicionar mais carteiras com base em seu plano
  const canAddMoreWallets = (currentWallets: number): boolean => {
    if (userPlan === 'premium') return true;
    return currentWallets < 1;
  };

  // Efeito para buscar o plano quando o usuário muda
  useEffect(() => {
    if (user?.id) {
      fetchUserPlan(user.id);
    } else {
      setUserPlan('free');
      setApiToken(null);
      setApiRequestsRemaining(1000);
    }
  }, [user?.id]);

  return {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    fetchUserPlan,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
    isLoading,
    checkSubscriptionStatus,
    createCheckoutSession,
    openCustomerPortal
  };
};
