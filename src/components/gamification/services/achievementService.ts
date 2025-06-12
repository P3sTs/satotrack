
import { Achievement } from '../types/achievementTypes';

export const achievementService = {
  // Expandir lista de conquistas
  getExtendedAchievements: (baseAchievements: Achievement[], userStats: any): Achievement[] => {
    const extendedAchievements = [
      ...baseAchievements,
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
