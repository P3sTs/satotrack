
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, Star, Zap } from 'lucide-react';
import { Achievement } from '../types/achievementTypes';

interface AchievementCardProps {
  achievement: Achievement;
  progressValue: number;
  progressText: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement, 
  progressValue, 
  progressText 
}) => {
  return (
    <Card
      className={`transition-all duration-300 hover:scale-105 ${
        achievement.unlocked
          ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30'
          : 'bg-muted/20 border-muted/20 hover:border-muted/40'
      }`}
    >
      <CardHeader className="text-center pb-2">
        <div className={`text-4xl mb-2 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
          {achievement.unlocked ? achievement.icon : <Lock className="h-10 w-10 mx-auto text-muted-foreground" />}
        </div>
        <CardTitle className={`text-lg ${achievement.unlocked ? 'text-yellow-400' : 'text-muted-foreground'}`}>
          {achievement.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-center text-muted-foreground">
          {achievement.description}
        </p>
        
        {achievement.unlocked ? (
          <div className="space-y-2">
            <Badge variant="outline" className="w-full justify-center bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Trophy className="h-3 w-3 mr-1" />
              Desbloqueada
            </Badge>
            {achievement.unlockedAt && (
              <p className="text-xs text-center text-muted-foreground">
                {achievement.unlockedAt.toLocaleDateString('pt-BR')}
              </p>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-green-400">
              <Zap className="h-3 w-3" />
              +{achievement.xpReward || 50} XP
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Progress value={progressValue} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {progressText}
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3" />
              {achievement.xpReward || 50} XP
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
