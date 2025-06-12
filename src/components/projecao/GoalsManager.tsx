import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Target, Calendar, TrendingUp, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  goal_type: 'btc' | 'usd' | 'brl';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  user_id: string;
}

const GoalsManager: React.FC = () => {
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
      setGoals(data || []);
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

  const calculateProgress = (goal: Goal): number => {
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  };

  const formatAmount = (amount: number, type: string): string => {
    switch (type) {
      case 'btc':
        return `${amount.toFixed(8)} BTC`;
      case 'usd':
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      case 'brl':
        return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      default:
        return amount.toString();
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'paused': return <AlertCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-muted/20">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Nenhuma meta criada</h3>
          <p className="text-muted-foreground mb-4">
            Crie sua primeira meta financeira e comece a acompanhar seu progresso
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const progress = calculateProgress(goal);
        const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        return (
          <Card key={goal.id} className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-dashboard-light">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={getStatusColor(goal.status)}>
                    {getStatusIcon(goal.status)}
                  </div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="outline" className={getStatusColor(goal.status)}>
                {goal.status === 'completed' ? 'Concluída' : 
                 goal.status === 'paused' ? 'Pausada' : 'Ativa'}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Atual:</span>
                  <span className="font-medium text-satotrack-neon">
                    {formatAmount(goal.current_amount, goal.goal_type)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Meta:</span>
                  <span className="font-medium">
                    {formatAmount(goal.target_amount, goal.goal_type)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {daysLeft > 0 ? `${daysLeft} dias restantes` : 
                   daysLeft === 0 ? 'Vence hoje' : 'Vencida'}
                </span>
              </div>

              {goal.status === 'active' && progress >= 100 && (
                <Button
                  size="sm"
                  onClick={() => updateGoalStatus(goal.id, 'completed')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Concluída
                </Button>
              )}

              {goal.status === 'active' && progress < 100 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateGoalStatus(goal.id, 'paused')}
                  className="w-full"
                >
                  Pausar Meta
                </Button>
              )}

              {goal.status === 'paused' && (
                <Button
                  size="sm"
                  onClick={() => updateGoalStatus(goal.id, 'active')}
                  className="w-full"
                >
                  Reativar Meta
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalsManager;
