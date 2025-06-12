
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Calendar, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Goal } from '../types/goalTypes';

interface GoalCardProps {
  goal: Goal;
  onUpdateStatus: (goalId: string, status: 'active' | 'completed' | 'paused') => void;
  onDelete: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateStatus, onDelete }) => {
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

  const progress = calculateProgress(goal);
  const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-dashboard-light">
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
            onClick={() => onDelete(goal.id)}
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
            onClick={() => onUpdateStatus(goal.id, 'completed')}
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
            onClick={() => onUpdateStatus(goal.id, 'paused')}
            className="w-full"
          >
            Pausar Meta
          </Button>
        )}

        {goal.status === 'paused' && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(goal.id, 'active')}
            className="w-full"
          >
            Reativar Meta
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
