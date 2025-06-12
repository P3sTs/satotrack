
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/carteiras';
import { supabase } from '@/integrations/supabase/client';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { TrendingUp, Target, Calendar, Award, AlertTriangle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  goal_type: 'btc' | 'usd' | 'brl';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

const ProgressTracker: React.FC = () => {
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
        .from('user_goals' as any)
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
            .from('user_goals' as any)
            .update({ current_amount: currentAmount })
            .eq('id', goal.id);
        } catch (error) {
          console.error('Error updating goal progress:', error);
        }
      }
    }
  };

  const calculateTimeToGoal = (goal: Goal): string => {
    const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const progress = (goal.current_amount / goal.target_amount) * 100;
    
    if (progress >= 100) return 'Meta atingida!';
    if (daysLeft <= 0) return 'Prazo esgotado';
    
    const remainingAmount = goal.target_amount - goal.current_amount;
    const dailyNeeded = remainingAmount / daysLeft;
    
    return `Precisa de ${formatAmount(dailyNeeded, goal.goal_type)} por dia`;
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

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'text-green-500';
    if (progress >= 75) return 'text-blue-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-muted/20">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Nenhuma meta ativa</h3>
          <p className="text-muted-foreground">
            Crie uma meta para acompanhar seu progresso aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedGoals = goals.filter(g => (g.current_amount / g.target_amount) * 100 >= 100);
  const activeGoals = goals.filter(g => (g.current_amount / g.target_amount) * 100 < 100);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Metas Ativas</p>
                <p className="text-2xl font-bold text-blue-400">{activeGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold text-green-400">{completedGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Details */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
          const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal.id} className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-dashboard-light">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <div className={`flex items-center gap-1 ${getProgressColor(progress)}`}>
                    {progress >= 100 ? <Award className="h-4 w-4" /> : 
                     daysLeft <= 7 ? <AlertTriangle className="h-4 w-4" /> : 
                     <TrendingUp className="h-4 w-4" />}
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Progresso Atual</p>
                    <p className="font-medium text-satotrack-neon">
                      {formatAmount(goal.current_amount, goal.goal_type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Meta Final</p>
                    <p className="font-medium">
                      {formatAmount(goal.target_amount, goal.goal_type)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {daysLeft > 0 ? `${daysLeft} dias restantes` : 
                       daysLeft === 0 ? 'Vence hoje' : 'Vencida'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {calculateTimeToGoal(goal)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
