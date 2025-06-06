
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface UserStats {
  totalLikes: number;
  widgetLikes: Record<string, number>;
  achievements: Achievement[];
  level: number;
  xp: number;
  streak: number;
  lastActivity: Date;
}

interface GamificationContextType {
  userStats: UserStats;
  likeWidget: (widgetId: string) => void;
  unlikeWidget: (widgetId: string) => void;
  isWidgetLiked: (widgetId: string) => boolean;
  addXP: (amount: number, reason: string) => void;
  checkAchievements: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const defaultAchievements: Achievement[] = [
  {
    id: 'first-like',
    title: 'Primeira Curtida',
    description: 'Curtiu seu primeiro widget',
    icon: '👍',
    requirement: 1,
    unlocked: false
  },
  {
    id: 'like-collector',
    title: 'Colecionador',
    description: 'Acumulou 10 curtidas',
    icon: '❤️',
    requirement: 10,
    unlocked: false
  },
  {
    id: 'like-master',
    title: 'Mestre das Curtidas',
    description: 'Acumulou 50 curtidas',
    icon: '💎',
    requirement: 50,
    unlocked: false
  },
  {
    id: 'like-legend',
    title: 'Lenda',
    description: 'Acumulou 100 curtidas',
    icon: '👑',
    requirement: 100,
    unlocked: false
  }
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    totalLikes: 0,
    widgetLikes: {},
    achievements: [...defaultAchievements],
    level: 1,
    xp: 0,
    streak: 0,
    lastActivity: new Date()
  });

  // Load user stats from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`gamification_${user.id}`);
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setUserStats({
          ...parsed,
          lastActivity: new Date(parsed.lastActivity),
          achievements: parsed.achievements.map((ach: any) => ({
            ...ach,
            unlockedAt: ach.unlockedAt ? new Date(ach.unlockedAt) : undefined
          }))
        });
      }
    }
  }, [user]);

  // Save user stats to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`gamification_${user.id}`, JSON.stringify(userStats));
    }
  }, [userStats, user]);

  const likeWidget = (widgetId: string) => {
    setUserStats(prev => {
      const newWidgetLikes = { ...prev.widgetLikes };
      newWidgetLikes[widgetId] = (newWidgetLikes[widgetId] || 0) + 1;
      
      const newTotalLikes = prev.totalLikes + 1;
      const newXP = prev.xp + 10; // 10 XP por curtida
      
      return {
        ...prev,
        totalLikes: newTotalLikes,
        widgetLikes: newWidgetLikes,
        xp: newXP,
        level: Math.floor(newXP / 100) + 1,
        lastActivity: new Date()
      };
    });
    
    addXP(10, 'Widget curtido');
    checkAchievements();
    
    toast.success('Widget curtido!', {
      description: '+10 XP ganhos'
    });
  };

  const unlikeWidget = (widgetId: string) => {
    setUserStats(prev => {
      const newWidgetLikes = { ...prev.widgetLikes };
      if (newWidgetLikes[widgetId] && newWidgetLikes[widgetId] > 0) {
        newWidgetLikes[widgetId] -= 1;
        if (newWidgetLikes[widgetId] === 0) {
          delete newWidgetLikes[widgetId];
        }
      }
      
      return {
        ...prev,
        totalLikes: Math.max(0, prev.totalLikes - 1),
        widgetLikes: newWidgetLikes,
        lastActivity: new Date()
      };
    });
  };

  const isWidgetLiked = (widgetId: string) => {
    return (userStats.widgetLikes[widgetId] || 0) > 0;
  };

  const addXP = (amount: number, reason: string) => {
    setUserStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      if (newLevel > prev.level) {
        toast.success(`Level Up! Nível ${newLevel}`, {
          description: 'Parabéns pelo seu progresso!'
        });
      }
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        lastActivity: new Date()
      };
    });
  };

  const checkAchievements = () => {
    setUserStats(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (!achievement.unlocked && prev.totalLikes >= achievement.requirement) {
          toast.success(`Conquista Desbloqueada! ${achievement.icon}`, {
            description: achievement.title
          });
          
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
        return achievement;
      });
      
      return {
        ...prev,
        achievements: updatedAchievements
      };
    });
  };

  return (
    <GamificationContext.Provider value={{
      userStats,
      likeWidget,
      unlikeWidget,
      isWidgetLiked,
      addXP,
      checkAchievements
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
