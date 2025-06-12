
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Goal } from '../types/goalTypes';

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals((data as Goal[]) || []);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const updateGoalStatus = async (goalId: string, status: 'active' | 'completed' | 'paused') => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ status })
        .eq('id', goalId);

      if (error) throw error;
      
      await loadGoals();
      toast.success(`Meta ${status === 'completed' ? 'concluída' : status === 'paused' ? 'pausada' : 'reativada'}`);
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast.error('Erro ao atualizar meta');
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;

    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      
      await loadGoals();
      toast.success('Meta excluída');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erro ao excluir meta');
    }
  };

  return {
    goals,
    loading,
    updateGoalStatus,
    deleteGoal,
    loadGoals
  };
};
