
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Award, TrendingUp } from 'lucide-react';
import { Goal } from '../types/goalTypes';

interface ProgressOverviewProps {
  goals: Goal[];
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ goals }) => {
  const completedGoals = goals.filter(g => (g.current_amount / g.target_amount) * 100 >= 100);
  const activeGoals = goals.filter(g => (g.current_amount / g.target_amount) * 100 < 100);

  return (
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
  );
};

export default ProgressOverview;
