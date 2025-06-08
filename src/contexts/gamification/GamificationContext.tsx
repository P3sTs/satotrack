
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { gamificationService, UserStats, UserAchievement, WidgetLike } from '@/services/gamification/gamificationService';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface GamificationContextType {
  userStats: UserStats | null;
  achievements: Achievement[];
  widgetLikes: Record<string, number>;
  likeWidget: (widgetId: string) => Promise<void>;
  unlikeWidget: (widgetId: string) => Promise<void>;
  isWidgetLiked: (widgetId: string) => boolean;
  addXP: (amount: number, reason: string) => Promise<void>;
  checkAchievements: () => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const defaultAchievements = [
  {
    id: 'first-like',
    title: 'Primeira Curtida',
    description: 'Curtiu seu primeiro widget',
    icon: '👍',
    requirement: 1
  },
  {
    id: 'like-collector',
    title: 'Colecionador',
    description: 'Acumulou 10 curtidas',
    icon: '❤️',
    requirement: 10
  },
  {
    id: 'like-master',
    title: 'Mestre das Curtidas',
    description: 'Acumulou 50 curtidas',
    icon: '💎',
    requirement: 50
  },
  {
    id: 'like-legend',
    title: 'Lenda',
    description: 'Acumulou 100 curtidas',
    icon: '👑',
    requirement: 100
  }
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [widgetLikes, setWidgetLikes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário
  const loadUserData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Carregar estatísticas
      const stats = await gamificationService.getUserStats(user.id);
      setUserStats(stats);

      // Carregar conquistas
      const userAchievements = await gamificationService.getUserAchievements(user.id);
      const achievementMap = new Map(userAchievements.map(a => [a.achievement_id, a]));
      
      const updatedAchievements = defaultAchievements.map(achievement => ({
        ...achievement,
        unlocked: achievementMap.has(achievement.id),
        unlockedAt: achievementMap.get(achievement.id)?.unlocked_at 
          ? new Date(achievementMap.get(achievement.id)!.unlocked_at) 
          : undefined
      }));
      
      setAchievements(updatedAchievements);

      // Carregar curtidas dos widgets
      const likes = await gamificationService.getUserWidgetLikes(user.id);
      const likesMap = likes.reduce((acc, like) => {
        acc[like.widget_id] = like.likes_count;
        return acc;
      }, {} as Record<string, number>);
      
      setWidgetLikes(likesMap);

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o usuário mudar
  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  const likeWidget = async (widgetId: string) => {
    if (!user?.id) return;

    try {
      const success = await gamificationService.likeWidget(user.id, widgetId);
      if (success) {
        // Atualizar estado local
        setWidgetLikes(prev => ({
          ...prev,
          [widgetId]: (prev[widgetId] || 0) + 1
        }));

        // Recarregar dados para sincronizar
        await loadUserData();
        
        toast.success('Widget curtido!', {
          description: '+10 XP ganhos'
        });
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
        // Atualizar estado local
        setWidgetLikes(prev => ({
          ...prev,
          [widgetId]: Math.max(0, (prev[widgetId] || 0) - 1)
        }));

        // Recarregar dados para sincronizar
        await loadUserData();
        
        toast.info('Curtida removida');
      }
    } catch (error) {
      console.error('Error unliking widget:', error);
      toast.error('Erro ao remover curtida');
    }
  };

  const isWidgetLiked = (widgetId: string) => {
    return (widgetLikes[widgetId] || 0) > 0;
  };

  const addXP = async (amount: number, reason: string) => {
    if (!user?.id) return;

    try {
      await gamificationService.updateUserStats(user.id, amount);
      
      // Recarregar dados para ver mudanças
      await loadUserData();
      
      toast.success(`+${amount} XP`, {
        description: reason
      });
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  const checkAchievements = async () => {
    if (!user?.id) return;

    try {
      await gamificationService.checkAchievements(user.id);
      // Recarregar dados para ver novas conquistas
      await loadUserData();
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const refreshData = async () => {
    await loadUserData();
  };

  return (
    <GamificationContext.Provider value={{
      userStats,
      achievements,
      widgetLikes,
      likeWidget,
      unlikeWidget,
      isWidgetLiked,
      addXP,
      checkAchievements,
      loading,
      refreshData
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
