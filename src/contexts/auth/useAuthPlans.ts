
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AuthUser, PlanType } from './types';
import { toast } from '@/hooks/use-toast';

export const useAuthPlans = (user: AuthUser | null) => {
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [apiRequestsRemaining, setApiRequestsRemaining] = useState(1000);
  const [apiRequestsUsed, setApiRequestsUsed] = useState(0);
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
        const remaining = planData.api_requests || 1000;
        const totalLimit = userPlan === 'premium' ? 10000 : 1000;
        const used = totalLimit - remaining;
        
        setApiRequestsRemaining(remaining);
        setApiRequestsUsed(Math.max(0, used));
      }
    } catch (error) {
      console.error('Error loading user plan data:', error);
    }
  };

  const createCheckoutSession = async (): Promise<{ url: string }> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upgrade.",
        variant: "destructive"
      });
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      return { url: data.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a sessão de checkout. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Update local state with subscription info
      setUserPlan(data.plan_type || 'free');
      
      // Refresh user plan data
      await loadUserPlanData();
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
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

    try {
      const { url } = await createCheckoutSession();
      // Open Stripe checkout in a new tab
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o upgrade. Tente novamente.",
        variant: "destructive"
      });
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

  const openCustomerPortal = async (): Promise<{ url: string }> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para acessar o portal.",
        variant: "destructive"
      });
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      return { url: data.url };
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal do cliente.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    userPlan,
    apiToken,
    apiRequestsRemaining,
    apiRequestsUsed,
    upgradeUserPlan,
    generateApiToken,
    isLoading,
    checkSubscriptionStatus,
    createCheckoutSession,
    openCustomerPortal
  };
};
