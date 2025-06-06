
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock } from 'lucide-react';
import { useGamification } from '@/contexts/gamification/GamificationContext';

const AchievementsPanel: React.FC = () => {
  const { userStats } = useGamification();

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Trophy className="h-5 w-5" />
          Conquistas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {userStats.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                  : 'bg-muted/20 border-muted/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className={`font-medium ${achievement.unlocked ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {achievement.unlocked ? (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      Desbloqueada
                    </Badge>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {userStats.totalLikes}/{achievement.requirement}
                    </div>
                  )}
                </div>
              </div>
              
              {!achievement.unlocked && (
                <div className="mt-2">
                  <Progress 
                    value={(userStats.totalLikes / achievement.requirement) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="text-xs text-muted-foreground mt-1">
                  Desbloqueada em {achievement.unlockedAt.toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Total</span>
            <span className="text-sm text-purple-400">{userStats.totalLikes} curtidas</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Nível {userStats.level} • {userStats.xp} XP
          </div>
          <Progress 
            value={(userStats.xp % 100)} 
            className="h-2 mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsPanel;
