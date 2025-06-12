
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Award, AlertTriangle, TrendingUp } from 'lucide-react';
import { Goal } from '../types/goalTypes';

interface ProgressDetailProps {
  goal: Goal;
}

const ProgressDetail: React.FC<ProgressDetailProps> = ({ goal }) => {
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

  const calculateTimeToGoal = (goal: Goal): string => {
    const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const progress = (goal.current_amount / goal.target_amount) * 100;
    
    if (progress >= 100) return 'Meta atingida!';
    if (daysLeft <= 0) return 'Prazo esgotado';
    
    const remainingAmount = goal.target_amount - goal.current_amount;
    const dailyNeeded = remainingAmount / daysLeft;
    
    return `Precisa de ${formatAmount(dailyNeeded, goal.goal_type)} por dia`;
  };

  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-dashboard-light">
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
};

export default ProgressDetail;
