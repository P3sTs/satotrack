
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { Achievement } from '../types/achievementTypes';

interface AchievementsProgressOverviewProps {
  achievements: Achievement[];
}

const AchievementsProgressOverview: React.FC<AchievementsProgressOverviewProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);
  const totalXP = achievements.filter(a => a.unlocked).reduce((acc, a) => acc + (a.xpReward || 50), 0);

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Award className="h-5 w-5" />
          Progresso Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {unlockedCount}
            </div>
            <div className="text-xs text-muted-foreground">Desbloqueadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {totalCount}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {completionPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">Completude</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {totalXP}
            </div>
            <div className="text-xs text-muted-foreground">XP Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsProgressOverview;
