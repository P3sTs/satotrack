
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import { Trophy, Lock, Star, Calendar, Users, TrendingUp, Target, Award, Zap, Heart } from 'lucide-react';

const AchievementsGrid: React.FC = () => {
  const { userStats, achievements, loading } = useGamification();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-muted/20">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-12 w-12 bg-muted rounded-full mx-auto"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalLikes = userStats?.total_likes || 0;

  // Expandir lista de conquistas
  const allAchievements = [
    ...achievements,
    {
      id: 'weekly-login',
      title: 'Dedicado',
      description: 'Faça login 7 dias seguidos',
      icon: '📅',
      requirement: 7,
      unlocked: (userStats?.streak || 0) >= 7,
      unlockedAt: (userStats?.streak || 0) >= 7 ? new Date() : null,
      xpReward: 150
    },
    {
      id: 'social-trader',
      title: 'Trader Social',
      description: 'Indique 5 amigos para a plataforma',
      icon: '👥',
      requirement: 5,
      unlocked: false,
      unlockedAt: null,
      xpReward: 500
    },
    {
      id: 'prediction-master',
      title: 'Oráculo Cripto',
      description: 'Acerte 10 previsões de mercado',
      icon: '🔮',
      requirement: 10,
      unlocked: false,
      unlockedAt: null,
      xpReward: 300
    },
    {
      id: 'diamond-hands',
      title: 'Diamond Hands',
      description: 'Mantenha saldo por 30 dias',
      icon: '💎',
      requirement: 30,
      unlocked: false,
      unlockedAt: null,
      xpReward: 200
    },
    {
      id: 'whale-watcher',
      title: 'Observador de Baleias',
      description: 'Monitore carteiras com +100 BTC',
      icon: '🐋',
      requirement: 1,
      unlocked: false,
      unlockedAt: null,
      xpReward: 100
    },
    {
      id: 'dex-explorer',
      title: 'Explorador DEX',
      description: 'Conecte carteira e faça swap',
      icon: '🔄',
      requirement: 1,
      unlocked: false,
      unlockedAt: null,
      xpReward: 150
    }
  ];

  const getProgressValue = (achievement: any) => {
    if (achievement.id === 'weekly-login') {
      return Math.min(((userStats?.streak || 0) / achievement.requirement) * 100, 100);
    }
    return Math.min((totalLikes / achievement.requirement) * 100, 100);
  };

  const getProgressText = (achievement: any) => {
    if (achievement.id === 'weekly-login') {
      return `${userStats?.streak || 0}/${achievement.requirement} dias`;
    }
    return `${totalLikes}/${achievement.requirement} curtidas`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Sistema de Conquistas</h2>
        <p className="text-muted-foreground">
          Complete desafios e ganhe XP para subir de nível
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((achievement) => (
          <Card
            key={achievement.id}
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
                  <Progress value={getProgressValue(achievement)} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {getProgressText(achievement)}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {achievement.xpReward || 50} XP
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas de Progresso */}
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
                {allAchievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-xs text-muted-foreground">Desbloqueadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {allAchievements.length}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round((allAchievements.filter(a => a.unlocked).length / allAchievements.length) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Completude</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {allAchievements.filter(a => a.unlocked).reduce((acc, a) => acc + (a.xpReward || 50), 0)}
              </div>
              <div className="text-xs text-muted-foreground">XP Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsGrid;
