
import { Achievement } from '../types/achievementTypes';

export const achievementService = {
  // Expandir lista de conquistas
  getExtendedAchievements: (baseAchievements: Achievement[], userStats: any): Achievement[] => {
    const extendedAchievements: Achievement[] = [
      ...baseAchievements,
      {
        id: 'weekly-login',
        title: 'Dedicado',
        description: 'Faça login 7 dias seguidos',
        icon: '📅',
        requirement: 7,
        requirement_value: 7,
        unlocked: (userStats?.streak || 0) >= 7,
        unlockedAt: (userStats?.streak || 0) >= 7 ? new Date() : null,
        xpReward: 150,
        xp_reward: 150,
        category: 'streak',
        requirement_type: 'streak_days'
      },
      {
        id: 'social-trader',
        title: 'Trader Social',
        description: 'Indique 5 amigos para a plataforma',
        icon: '👥',
        requirement: 5,
        requirement_value: 5,
        unlocked: false,
        unlockedAt: null,
        xpReward: 500,
        xp_reward: 500,
        category: 'social',
        requirement_type: 'referrals'
      },
      {
        id: 'prediction-master',
        title: 'Oráculo Cripto',
        description: 'Acerte 10 previsões de mercado',
        icon: '🔮',
        requirement: 10,
        requirement_value: 10,
        unlocked: false,
        unlockedAt: null,
        xpReward: 300,
        xp_reward: 300,
        category: 'trading',
        requirement_type: 'predictions'
      },
      {
        id: 'diamond-hands',
        title: 'Diamond Hands',
        description: 'Mantenha saldo por 30 dias',
        icon: '💎',
        requirement: 30,
        requirement_value: 30,
        unlocked: false,
        unlockedAt: null,
        xpReward: 200,
        xp_reward: 200,
        category: 'portfolio',
        requirement_type: 'days_holding'
      },
      {
        id: 'whale-watcher',
        title: 'Observador de Baleias',
        description: 'Monitore carteiras com +100 BTC',
        icon: '🐋',
        requirement: 1,
        requirement_value: 1,
        unlocked: false,
        unlockedAt: null,
        xpReward: 100,
        xp_reward: 100,
        category: 'portfolio',
        requirement_type: 'whale_tracking'
      },
      {
        id: 'dex-explorer',
        title: 'Explorador DEX',
        description: 'Conecte carteira e faça swap',
        icon: '🔄',
        requirement: 1,
        requirement_value: 1,
        unlocked: false,
        unlockedAt: null,
        xpReward: 150,
        xp_reward: 150,
        category: 'trading',
        requirement_type: 'dex_usage'
      }
    ];

    return extendedAchievements;
  },

  getProgressValue: (achievement: Achievement, userStats: any, totalLikes: number): number => {
    if (achievement.id === 'weekly-login') {
      return Math.min(((userStats?.streak || 0) / achievement.requirement) * 100, 100);
    }
    return Math.min((totalLikes / achievement.requirement) * 100, 100);
  },

  getProgressText: (achievement: Achievement, userStats: any, totalLikes: number): string => {
    if (achievement.id === 'weekly-login') {
      return `${userStats?.streak || 0}/${achievement.requirement} dias`;
    }
    return `${totalLikes}/${achievement.requirement} curtidas`;
  }
};
