
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target, Users, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/carteiras';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  reward: string;
  category: 'usage' | 'social' | 'premium' | 'analytics';
}

const AchievementsSystem: React.FC = () => {
  const { user, userPlan } = useAuth();
  const { carteiras } = useCarteiras();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState({
    daysActive: 0,
    transactionsTracked: 0,
    referrals: 0,
    walletsAdded: 0,
    premiumDaysEarned: 0
  });

  const achievementDefinitions: Omit<Achievement, 'currentProgress' | 'isUnlocked'>[] = [
    {
      id: 'first_wallet',
      title: 'Primeiro Passo 🚀',
      description: 'Adicione sua primeira carteira',
      icon: Target,
      requirement: 1,
      reward: '3 dias Premium',
      category: 'usage'
    },
    {
      id: 'active_week',
      title: 'Usuário Ativo 🔥',
      description: 'Acesse a plataforma por 7 dias seguidos',
      icon: Zap,
      requirement: 7,
      reward: '7 dias Premium',
      category: 'usage'
    },
    {
      id: 'transaction_tracker',
      title: 'Analista de Cripto 🧠',
      description: 'Monitore 10 transações',
      icon: TrendingUp,
      requirement: 10,
      reward: '5 dias Premium',
      category: 'analytics'
    },
    {
      id: 'influencer',
      title: 'Influenciador 💬',
      description: 'Indique 5 pessoas para a plataforma',
      icon: Users,
      requirement: 5,
      reward: '15 dias Premium',
      category: 'social'
    },
    {
      id: 'wallet_master',
      title: 'Colecionador 📱',
      description: 'Adicione 5 carteiras',
      icon: Star,
      requirement: 5,
      reward: '10 dias Premium',
      category: 'premium'
    },
    {
      id: 'crypto_veteran',
      title: 'Veterano Bitcoin ⚡',
      description: 'Use a plataforma por 30 dias',
      icon: Trophy,
      requirement: 30,
      reward: '30 dias Premium',
      category: 'usage'
    },
    {
      id: 'super_influencer',
      title: 'Super Influenciador 🌟',
      description: 'Indique 20 pessoas (Premium vitalício!)',
      icon: Award,
      requirement: 20,
      reward: 'Premium Vitalício',
      category: 'social'
    }
  ];

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadUserAchievements();
    }
  }, [user, carteiras]);

  const loadUserStats = async () => {
    try {
      // Carregar estatísticas do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_count, created_at')
        .eq('id', user?.id)
        .single();

      // Calcular dias ativos (simulado - em produção seria baseado em logs de login)
      const daysActive = profile?.created_at ? 
        Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;

      // Calcular transações monitoradas
      const transactionsTracked = carteiras.reduce((sum, wallet) => sum + wallet.qtde_transacoes, 0);

      setUserStats({
        daysActive: Math.min(daysActive, 30), // Limitado para demo
        transactionsTracked,
        referrals: profile?.referral_count || 0,
        walletsAdded: carteiras.length,
        premiumDaysEarned: 0 // Será calculado baseado nas conquistas
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadUserAchievements = async () => {
    try {
      const { data: unlockedAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user?.id);

      const unlockedIds = new Set(unlockedAchievements?.map(a => a.achievement_id) || []);

      const processedAchievements = achievementDefinitions.map(achievement => {
        let currentProgress = 0;

        switch (achievement.id) {
          case 'first_wallet':
            currentProgress = userStats.walletsAdded;
            break;
          case 'active_week':
            currentProgress = Math.min(userStats.daysActive, 7);
            break;
          case 'transaction_tracker':
            currentProgress = userStats.transactionsTracked;
            break;
          case 'influencer':
            currentProgress = userStats.referrals;
            break;
          case 'wallet_master':
            currentProgress = userStats.walletsAdded;
            break;
          case 'crypto_veteran':
            currentProgress = userStats.daysActive;
            break;
          case 'super_influencer':
            currentProgress = userStats.referrals;
            break;
        }

        const isUnlocked = unlockedIds.has(achievement.id) || currentProgress >= achievement.requirement;

        return {
          ...achievement,
          currentProgress,
          isUnlocked
        };
      });

      setAchievements(processedAchievements);
      
      // Auto-unlock achievements
      await checkAndUnlockAchievements(processedAchievements);
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    }
  };

  const checkAndUnlockAchievements = async (achievementsList: Achievement[]) => {
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievementsList) {
      if (!achievement.isUnlocked && achievement.currentProgress >= achievement.requirement) {
        try {
          const { error } = await supabase
            .from('user_achievements')
            .insert([{
              user_id: user?.id,
              achievement_id: achievement.id
            }]);

          if (!error) {
            newlyUnlocked.push(achievement);
            achievement.isUnlocked = true;
          }
        } catch (error) {
          console.error('Erro ao desbloquear conquista:', error);
        }
      }
    }

    // Mostrar notificações para conquistas desbloqueadas
    newlyUnlocked.forEach(achievement => {
      toast.success(`🏆 Conquista desbloqueada: ${achievement.title}`, {
        description: `Recompensa: ${achievement.reward}`
      });
    });

    if (newlyUnlocked.length > 0) {
      setAchievements([...achievementsList]);
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min(100, (achievement.currentProgress / achievement.requirement) * 100);
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'usage': return 'bg-blue-500/20 text-blue-400';
      case 'social': return 'bg-purple-500/20 text-purple-400';
      case 'premium': return 'bg-yellow-500/20 text-yellow-400';
      case 'analytics': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalPremiumDays = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => {
      const days = parseInt(a.reward.match(/\d+/)?.[0] || '0');
      return sum + days;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Visão Geral */}
      <Card className="bg-gradient-to-r from-satotrack-neon/10 to-purple-500/10 border-satotrack-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-satotrack-neon" />
            Sistema de Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-satotrack-neon">{unlockedCount}</div>
              <div className="text-sm text-muted-foreground">Conquistas Desbloqueadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{achievements.length}</div>
              <div className="text-sm text-muted-foreground">Total de Conquistas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{totalPremiumDays}</div>
              <div className="text-sm text-muted-foreground">Dias Premium Ganhos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progresso Geral</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          const progressPercentage = getProgressPercentage(achievement);
          
          return (
            <Card 
              key={achievement.id} 
              className={`transition-all duration-300 ${
                achievement.isUnlocked 
                  ? 'border-satotrack-neon/50 bg-satotrack-neon/5' 
                  : 'border-border hover:border-satotrack-neon/30'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    achievement.isUnlocked 
                      ? 'bg-satotrack-neon/20 text-satotrack-neon' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.isUnlocked && (
                        <Badge className="bg-satotrack-neon/20 text-satotrack-neon border-satotrack-neon/30">
                          ✓ Desbloqueada
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Progresso: {achievement.currentProgress}/{achievement.requirement}</span>
                        <span className={getCategoryColor(achievement.category)}>
                          {achievement.category === 'usage' ? 'Uso' :
                           achievement.category === 'social' ? 'Social' :
                           achievement.category === 'premium' ? 'Premium' : 'Análise'}
                        </span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className="h-2"
                      />
                      <div className="text-sm font-medium text-satotrack-neon">
                        🎁 {achievement.reward}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsSystem;
