
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AuthUser, PlanType } from './types';
import { toast } from '@/hooks/use-toast';

export const useAuthPlans = (user: AuthUser | null) => {
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [apiRequestsRemaining, setApiRequestsRemaining] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  // Load user plan and API info
  useEffect(() => {
    if (user) {
      loadUserPlanData();
    }
  }, [user]);

  const loadUserPlanData = async () => {
    if (!user) return;

    try {
      // Check user plan from profiles table (premium_status)
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_status, premium_expiry')
        .eq('id', user.id)
        .single();

      if (profile) {
        const isPremium = profile.premium_status === 'active' && 
                         (!profile.premium_expiry || new Date(profile.premium_expiry) > new Date());
        setUserPlan(isPremium ? 'premium' : 'free');
      }

      // Load API data from user_plans table
      const { data: planData } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (planData) {
        setApiToken(planData.api_token);
        setApiRequestsRemaining(planData.api_requests || 1000);
      }
    } catch (error) {
      console.error('Error loading user plan data:', error);
    }
  };

  const upgradeUserPlan = async (newPlan?: PlanType) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upgrade.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // For now, we'll just simulate the upgrade process
      // In a real implementation, this would integrate with a payment processor
      
      if (newPlan === 'premium' || !newPlan) {
        toast({
          title: "Upgrade Premium",
          description: "Funcionalidade de pagamento em desenvolvimento. Use o programa de indicações para obter Premium gratuitamente!",
        });
      }
      
      await loadUserPlanData();
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o upgrade. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiToken = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const newToken = `sato_${user.id.substring(0, 8)}_${Date.now()}`;
    
    // Save token to database
    const { error } = await supabase
      .from('user_plans')
      .upsert({
        user_id: user.id,
        api_token: newToken,
        plan_type: userPlan,
        api_requests: apiRequestsRemaining
      });

    if (error) throw error;

    setApiToken(newToken);
    return newToken;
  };

  const canAddMoreWallets = (currentWallets: number): boolean => {
    if (userPlan === 'premium') return true;
    return currentWallets < 1; // Free plan limited to 1 wallet
  };

  const checkSubscriptionStatus = async (): Promise<void> => {
    await loadUserPlanData();
  };

  const createCheckoutSession = async (priceId: string): Promise<{ url: string }> => {
    // Placeholder implementation
    toast({
      title: "Em desenvolvimento",
      description: "Sistema de pagamento em desenvolvimento.",
    });
    return { url: '' };
  };

  const openCustomerPortal = async (): Promise<{ url: string }> => {
    // Placeholder implementation
    toast({
      title: "Em desenvolvimento",
      description: "Portal do cliente em desenvolvimento.",
    });
    return { url: '' };
  };

  return {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    upgradeUserPlan,
    generateApiToken,
    canAddMoreWallets,
    isLoading,
    checkSubscriptionStatus,
    createCheckoutSession,
    openCustomerPortal
  };
};
