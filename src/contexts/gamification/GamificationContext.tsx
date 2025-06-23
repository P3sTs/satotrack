
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useGeminiAI } from '@/hooks/useGeminiAI';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  requirement: number; // Add for compatibility
  unlocked?: boolean;
  unlocked_at?: string;
  unlockedAt?: Date | null; // Add for compatibility
  progress?: number;
  category: 'trading' | 'portfolio' | 'social' | 'streak' | 'special';
  xpReward?: number; // Add for compatibility
}

export interface UserStats {
  id: string;
  user_id: string;
  total_likes: number;
  level: number;
  xp: number;
  streak: number;
  last_activity: string;
  total_wallets?: number;
  total_transactions?: number;
  best_roi?: number;
  days_active?: number;
}

interface GamificationContextType {
  userStats: UserStats | null;
  achievements: Achievement[];
  loading: boolean;
  updateUserStats: (xpGain?: number) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  generatePersonalizedAchievements: () => Promise<void>;
  widgetLikes: Record<string, number>;
  isWidgetLiked: (widgetId: string) => boolean;
  likeWidget: (widgetId: string) => Promise<void>;
  unlikeWidget: (widgetId: string) => Promise<void>;
  addXP: (amount: number, reason?: string) => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification deve ser usado dentro de um GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [widgetLikes, setWidgetLikes] = useState<Record<string, number>>({});
  const [likedWidgets, setLikedWidgets] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { suggestAchievements } = useGeminiAI();

  const defaultAchievements: Achievement[] = [
    {
      id: 'first-wallet',
      title: 'Primeira Carteira',
      description: 'Cadastre sua primeira carteira Bitcoin',
      icon: 'wallet',
      xp_reward: 100,
      xpReward: 100,
      requirement_type: 'wallets_count',
      requirement_value: 1,
      requirement: 1,
      category: 'portfolio'
    },
    {
      id: 'portfolio-master',
      title: 'Mestre do Portfólio',
      description: 'Cadastre 5 carteiras Bitcoin',
      icon: 'briefcase',
      xp_reward: 500,
      xpReward: 500,
      requirement_type: 'wallets_count',
      requirement_value: 5,
      requirement: 5,
      category: 'portfolio'
    },
    {
      id: 'first-profit',
      title: 'Primeiro Lucro',
      description: 'Tenha um ROI positivo pela primeira vez',
      icon: 'trending-up',
      xp_reward: 200,
      xpReward: 200,
      requirement_type: 'positive_roi',
      requirement_value: 1,
      requirement: 1,
      category: 'trading'
    },
    {
      id: 'daily-streak-7',
      title: 'Usuário Dedicado',
      description: 'Acesse o SatoTrack por 7 dias consecutivos',
      icon: 'calendar',
      xp_reward: 300,
      xpReward: 300,
      requirement_type: 'streak_days',
      requirement_value: 7,
      requirement: 7,
      category: 'streak'
    },
    {
      id: 'social-butterfly',
      title: 'Borboleta Social',
      description: 'Receba 10 curtidas da comunidade',
      icon: 'heart',
      xp_reward: 150,
      xpReward: 150,
      requirement_type: 'total_likes',
      requirement_value: 10,
      requirement: 10,
      category: 'social'
    },
    {
      id: 'level-10',
      title: 'Veterano',
      description: 'Alcance o nível 10',
      icon: 'star',
      xp_reward: 1000,
      xpReward: 1000,
      requirement_type: 'level',
      requirement_value: 10,
      requirement: 10,
      category: 'special'
    }
  ];

  const loadUserStats = async () => {
    if (!user?.id) return;

    try {
      // Carregar estatísticas do usuário
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Erro ao carregar estatísticas:', statsError);
        return;
      }

      // Se não existe, criar estatísticas iniciais
      if (!stats) {
        const { data: newStats, error: createError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_likes: 0,
            level: 1,
            xp: 0,
            streak: 1,
            last_activity: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar estatísticas:', createError);
          return;
        }

        setUserStats(newStats);
      } else {
        setUserStats(stats);
      }

      // Carregar conquistas desbloqueadas
      const { data: unlockedAchievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

      if (achievementsError) {
        console.error('Erro ao carregar conquistas:', achievementsError);
        return;
      }

      // Carregar curtidas de widgets
      const { data: widgetLikesData, error: likesError } = await supabase
        .from('widget_likes')
        .select('widget_id, likes_count')
        .eq('user_id', user.id);

      if (likesError) {
        console.error('Erro ao carregar curtidas:', likesError);
      } else {
        const likesMap: Record<string, number> = {};
        const likedSet = new Set<string>();
        
        widgetLikesData?.forEach(like => {
          likesMap[like.widget_id] = like.likes_count;
          if (like.likes_count > 0) {
            likedSet.add(like.widget_id);
          }
        });
        
        setWidgetLikes(likesMap);
        setLikedWidgets(likedSet);
      }

      // Marcar conquistas como desbloqueadas
      const achievementsWithProgress = defaultAchievements.map(achievement => ({
        ...achievement,
        unlocked: unlockedAchievements?.some(ua => ua.achievement_id === achievement.id),
        unlocked_at: unlockedAchievements?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at,
        unlockedAt: unlockedAchievements?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at ? 
          new Date(unlockedAchievements.find(ua => ua.achievement_id === achievement.id)!.unlocked_at) : null,
        progress: calculateProgress(achievement, stats)
      }));

      setAchievements(achievementsWithProgress);

    } catch (error) {
      console.error('Erro geral ao carregar gamificação:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (achievement: Achievement, stats: UserStats | null): number => {
    if (!stats) return 0;

    switch (achievement.requirement_type) {
      case 'total_likes':
        return Math.min(100, (stats.total_likes / achievement.requirement_value) * 100);
      case 'level':
        return Math.min(100, (stats.level / achievement.requirement_value) * 100);
      case 'streak_days':
        return Math.min(100, (stats.streak / achievement.requirement_value) * 100);
      case 'wallets_count':
        return Math.min(100, ((stats.total_wallets || 0) / achievement.requirement_value) * 100);
      default:
        return 0;
    }
  };

  const updateUserStats = async (xpGain: number = 0) => {
    if (!user?.id || !userStats) return;

    try {
      const newXP = userStats.xp + xpGain;
      const newLevel = Math.floor(newXP / 100) + 1;

      const { data: updatedStats, error } = await supabase
        .from('user_stats')
        .update({
          xp: newXP,
          level: newLevel,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar estatísticas:', error);
        return;
      }

      setUserStats(updatedStats);

      // Verificar conquistas desbloqueadas
      checkForNewAchievements(updatedStats);

    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error);
    }
  };

  const addXP = async (amount: number, reason?: string) => {
    console.log(`Adicionando ${amount} XP: ${reason || 'Sem motivo especificado'}`);
    await updateUserStats(amount);
  };

  const checkForNewAchievements = async (stats: UserStats) => {
    const unlockedAchievements = achievements.filter(a => 
      !a.unlocked && calculateProgress(a, stats) >= 100
    );

    for (const achievement of unlockedAchievements) {
      await unlockAchievement(achievement.id);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId
        });

      if (error) {
        console.error('Erro ao desbloquear conquista:', error);
        return;
      }

      // Atualizar estado local
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievementId 
            ? { 
                ...a, 
                unlocked: true, 
                unlocked_at: new Date().toISOString(),
                unlockedAt: new Date()
              }
            : a
        )
      );

      // Dar XP de recompensa
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        await updateUserStats(achievement.xp_reward);
      }

    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
    }
  };

  const isWidgetLiked = (widgetId: string): boolean => {
    return likedWidgets.has(widgetId);
  };

  const likeWidget = async (widgetId: string) => {
    if (!user?.id) return;

    try {
      const { data: existing } = await supabase
        .from('widget_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('widget_id', widgetId)
        .single();

      if (existing) {
        // Incrementar curtida existente
        const { error } = await supabase
          .from('widget_likes')
          .update({
            likes_count: existing.likes_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (!error) {
          setWidgetLikes(prev => ({
            ...prev,
            [widgetId]: existing.likes_count + 1
          }));
          setLikedWidgets(prev => new Set([...prev, widgetId]));
          await addXP(10, 'Widget curtido');
        }
      } else {
        // Criar nova curtida
        const { error } = await supabase
          .from('widget_likes')
          .insert({
            user_id: user.id,
            widget_id: widgetId,
            likes_count: 1
          });

        if (!error) {
          setWidgetLikes(prev => ({
            ...prev,
            [widgetId]: 1
          }));
          setLikedWidgets(prev => new Set([...prev, widgetId]));
          await addXP(10, 'Widget curtido');
        }
      }
    } catch (error) {
      console.error('Erro ao curtir widget:', error);
    }
  };

  const unlikeWidget = async (widgetId: string) => {
    if (!user?.id) return;

    try {
      const { data: existing } = await supabase
        .from('widget_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('widget_id', widgetId)
        .single();

      if (!existing) return;

      if (existing.likes_count > 1) {
        // Decrementar curtida
        const { error } = await supabase
          .from('widget_likes')
          .update({
            likes_count: existing.likes_count - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (!error) {
          setWidgetLikes(prev => ({
            ...prev,
            [widgetId]: existing.likes_count - 1
          }));
        }
      } else {
        // Remover curtida completamente
        const { error } = await supabase
          .from('widget_likes')
          .delete()
          .eq('id', existing.id);

        if (!error) {
          setWidgetLikes(prev => {
            const newLikes = { ...prev };
            delete newLikes[widgetId];
            return newLikes;
          });
          setLikedWidgets(prev => {
            const newSet = new Set(prev);
            newSet.delete(widgetId);
            return newSet;
          });
        }
      }
    } catch (error) {
      console.error('Erro ao remover curtida:', error);
    }
  };

  const generatePersonalizedAchievements = async () => {
    if (!userStats) return;

    try {
      const aiSuggestion = await suggestAchievements({
        userStats,
        currentAchievements: achievements.length,
        unlockedCount: achievements.filter(a => a.unlocked).length
      });

      if (aiSuggestion?.recommendations) {
        console.log('🎯 IA sugeriu conquistas personalizadas:', aiSuggestion.recommendations);
      }
    } catch (error) {
      console.error('Erro ao gerar conquistas personalizadas:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
    }
  }, [user?.id]);

  return (
    <GamificationContext.Provider value={{
      userStats,
      achievements,
      loading,
      updateUserStats,
      unlockAchievement,
      generatePersonalizedAchievements,
      widgetLikes,
      isWidgetLiked,
      likeWidget,
      unlikeWidget,
      addXP
    }}>
      {children}
    </GamificationContext.Provider>
  );
};
