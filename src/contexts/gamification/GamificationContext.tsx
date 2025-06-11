
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gamificationService, UserStats, UserAchievement } from '@/services/gamification/gamificationService';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt: Date | null;
  xpReward?: number;
}

interface GamificationContextType {
  userStats: UserStats | null;
  achievements: Achievement[];
  loading: boolean;
  likeWidget: (widgetId: string) => Promise<void>;
  unlikeWidget: (widgetId: string) => Promise<void>;
  isWidgetLiked: (widgetId: string) => Promise<boolean>;
  getWidgetLikeCount: (widgetId: string) => Promise<number>;
  refreshStats: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

// Definição das conquistas
const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-like',
    title: 'Primeiro Passo',
    description: 'Curta seu primeiro widget',
    icon: '👍',
    requirement: 1,
    xpReward: 50
  },
  {
    id: 'like-collector',
    title: 'Colecionador',
    description: 'Curta 10 widgets',
    icon: '⭐',
    requirement: 10,
    xpReward: 100
  },
  {
    id: 'like-master',
    title: 'Mestre dos Likes',
    description: 'Curta 50 widgets',
    icon: '🏆',
    requirement: 50,
    xpReward: 250
  },
  {
    id: 'like-legend',
    title: 'Lenda da Plataforma',
    description: 'Curta 100 widgets',
    icon: '👑',
    requirement: 100,
    xpReward: 500
  }
];

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Carregar estatísticas do usuário
      const stats = await gamificationService.getUserStats(user.id);
      setUserStats(stats);

      // Carregar conquistas desbloqueadas
      const userAchievements = await gamificationService.getUserAchievements(user.id);
      const unlockedIds = userAchievements.map(ua => ua.achievement_id);

      // Mapear conquistas com status de desbloqueio
      const mappedAchievements = ACHIEVEMENTS.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
        return {
          ...achievement,
          unlocked: unlockedIds.includes(achievement.id),
          unlockedAt: userAchievement ? new Date(userAchievement.unlocked_at) : null
        };
      });

      setAchievements(mappedAchievements);
    } catch (error) {
      console.error('Error loading gamification data:', error);
      toast.error('Erro ao carregar dados de gamificação');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    await loadUserData();
  };

  const likeWidget = async (widgetId: string) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para curtir widgets');
      return;
    }

    try {
      const success = await gamificationService.likeWidget(user.id, widgetId);
      if (success) {
        toast.success('Widget curtido! +10 XP');
        await loadUserData(); // Recarregar dados para atualizar XP e conquistas
      } else {
        toast.error('Erro ao curtir widget');
      }
    } catch (error) {
      console.error('Error liking widget:', error);
      toast.error('Erro ao curtir widget');
    }
  };

  const unlikeWidget = async (widgetId: string) => {
    if (!user?.id) return;

    try {
      const success = await gamificationService.unlikeWidget(user.id, widgetId);
      if (success) {
        toast.success('Curtida removida');
        await loadUserData();
      }
    } catch (error) {
      console.error('Error unliking widget:', error);
      toast.error('Erro ao remover curtida');
    }
  };

  const isWidgetLiked = async (widgetId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      return await gamificationService.isWidgetLiked(user.id, widgetId);
    } catch (error) {
      console.error('Error checking widget like:', error);
      return false;
    }
  };

  const getWidgetLikeCount = async (widgetId: string): Promise<number> => {
    if (!user?.id) return 0;

    try {
      return await gamificationService.getWidgetLikeCount(user.id, widgetId);
    } catch (error) {
      console.error('Error getting widget like count:', error);
      return 0;
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  const value: GamificationContextType = {
    userStats,
    achievements,
    loading,
    likeWidget,
    unlikeWidget,
    isWidgetLiked,
    getWidgetLikeCount,
    refreshStats
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
