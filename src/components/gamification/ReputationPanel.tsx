
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import { Trophy, Star, TrendingUp, Users, Target, Award, Crown, Zap } from 'lucide-react';

const ReputationPanel: React.FC = () => {
  const { userStats, achievements, loading } = useGamification();

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const level = userStats?.level || 1;
  const xp = userStats?.xp || 0;
  const nextLevelXP = level * 100;
  const currentLevelXP = xp % 100;
  const progressPercentage = (currentLevelXP / 100) * 100;

  const getReputationTitle = (level: number) => {
    if (level >= 50) return "Lenda Cripto";
    if (level >= 30) return "Mestre Trader";
    if (level >= 20) return "Investidor Expert";
    if (level >= 10) return "Cripto Enthusiast";
    if (level >= 5) return "Hodler Iniciante";
    return "Aprendiz Bitcoin";
  };

  const getReputationColor = (level: number) => {
    if (level >= 50) return "text-purple-400";
    if (level >= 30) return "text-yellow-400";
    if (level >= 20) return "text-blue-400";
    if (level >= 10) return "text-green-400";
    if (level >= 5) return "text-orange-400";
    return "text-gray-400";
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-6">
      {/* Header de Reputação */}
      <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className={`h-12 w-12 ${getReputationColor(level)}`} />
          </div>
          <CardTitle className={`text-2xl ${getReputationColor(level)}`}>
            {getReputationTitle(level)}
          </CardTitle>
          <p className="text-muted-foreground">
            Nível {level} • {xp} XP Total
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso do Nível</span>
                <span>{currentLevelXP}/100 XP</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/20 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-xl font-bold">{unlockedAchievements.length}</div>
                <div className="text-xs text-muted-foreground">Conquistas</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <Star className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                <div className="text-xl font-bold">{userStats?.streak || 0}</div>
                <div className="text-xs text-muted-foreground">Sequência</div>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg">
                <Zap className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                <div className="text-xl font-bold">{Math.floor((unlockedAchievements.length / totalAchievements) * 100)}%</div>
                <div className="text-xs text-muted-foreground">Completude</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conquistas Recentes */}
      <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Award className="h-5 w-5" />
            Conquistas Desbloqueadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {unlockedAchievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-yellow-400">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                </div>
                <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                  +{achievement.xpReward || 50} XP
                </Badge>
              </div>
            ))}
            
            {unlockedAchievements.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma conquista desbloqueada ainda</p>
                <p className="text-xs">Continue usando a plataforma para ganhar XP!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Próximas Conquistas */}
      <Card className="bg-gradient-to-br from-gray-900/20 to-slate-900/20 border-gray-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-400" />
            Próximas Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.filter(a => !a.unlocked).slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-muted/20"
              >
                <div className="text-2xl grayscale opacity-50">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-muted-foreground">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  <Progress 
                    value={(userStats?.total_likes || 0) / achievement.requirement * 100} 
                    className="h-2 mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {userStats?.total_likes || 0}/{achievement.requirement} curtidas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações de Gamificação */}
      <Card className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <TrendingUp className="h-5 w-5" />
            Ganhe Mais XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div>
                <div className="font-medium text-green-400">Curtir Widgets</div>
                <div className="text-xs text-muted-foreground">+10 XP por curtida</div>
              </div>
              <Button variant="outline" size="sm" className="text-green-400 border-green-500/30">
                <Star className="h-4 w-4 mr-1" />
                Curtir
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div>
                <div className="font-medium text-blue-400">Indicar Amigos</div>
                <div className="text-xs text-muted-foreground">+100 XP por indicação</div>
              </div>
              <Button variant="outline" size="sm" className="text-blue-400 border-blue-500/30">
                <Users className="h-4 w-4 mr-1" />
                Indicar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div>
                <div className="font-medium text-purple-400">Login Diário</div>
                <div className="text-xs text-muted-foreground">+25 XP por dia consecutivo</div>
              </div>
              <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                Automático
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReputationPanel;
