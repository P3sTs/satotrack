
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/carteiras';
import { supabase } from '@/integrations/supabase/client';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { Goal } from '../types/goalTypes';

export const useProgressTracker = () => {
  const { user } = useAuth();
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  useEffect(() => {
    if (goals.length > 0 && carteiras.length > 0 && bitcoinData) {
      updateGoalsProgress();
    }
  }, [goals, carteiras, bitcoinData]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals((data as Goal[]) || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalsProgress = async () => {
    if (!user || !bitcoinData) return;

    const totalBTC = carteiras.reduce((acc, carteira) => acc + carteira.saldo, 0);
    const totalBRL = totalBTC * bitcoinData.price_brl;
    const totalUSD = totalBTC * bitcoinData.price_usd;

    for (const goal of goals) {
      let currentAmount = 0;
      
      switch (goal.goal_type) {
        case 'btc':
          currentAmount = totalBTC;
          break;
        case 'brl':
          currentAmount = totalBRL;
          break;
        case 'usd':
          currentAmount = totalUSD;
          break;
      }

      if (currentAmount !== goal.current_amount) {
        try {
          await supabase
            .from('user_goals')
            .update({ current_amount: currentAmount })
            .eq('id', goal.id);
        } catch (error) {
          console.error('Error updating goal progress:', error);
        }
      }
    }
  };

  return {
    goals,
    loading
  };
};
