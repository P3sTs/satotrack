
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthUser, PlanType } from './types';

export const useAuthPlans = (user: AuthUser | null) => {
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [apiRequestsRemaining, setApiRequestsRemaining] = useState<number>(1000);

  // Fetch user plan from database
  const fetchUserPlan = async (userId: string) => {
    try {
      // Use type assertion to work around the type checking
      const { data, error } = await supabase
        .from('user_plans' as any)
        .select('plan_type, api_token, api_requests')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user plan:', error);
        return;
      }
      
      if (data) {
        setUserPlan(data.plan_type as PlanType);
        setApiToken(data.api_token);
        setApiRequestsRemaining(data.api_requests || 1000);
      }
    } catch (error) {
      console.error('Error in fetchUserPlan:', error);
    }
  };

  // Upgrade user plan to premium
  const upgradeUserPlan = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      // Use type assertion to work around the type checking
      const { error } = await supabase
        .from('user_plans' as any)
        .upsert({ 
          user_id: user.id, 
          plan_type: 'premium',
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setUserPlan('premium');
      toast({
        title: "Plano atualizado",
        description: "Você agora é um usuário Premium! Aproveite todos os recursos.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error upgrading user plan:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar para o plano Premium. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Generate API token for premium users
  const generateApiToken = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      if (userPlan !== 'premium') throw new Error('API tokens are only available for premium users');
      
      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      // Use type assertion to work around the type checking
      const { error } = await supabase
        .from('user_plans' as any)
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
      console.error('Error generating API token:', error);
      toast({
        title: "Erro ao gerar token",
        description: error instanceof Error ? error.message : "Não foi possível gerar o token de API.",
        variant: "destructive"
      });
      return '';
    }
  };

  // Calculate if user can add more wallets based on their plan
  const canAddMoreWallets = userPlan === 'premium' || true;

  return {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    fetchUserPlan,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets
  };
};
