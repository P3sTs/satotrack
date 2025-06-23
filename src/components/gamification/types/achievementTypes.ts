
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  requirement_value: number;
  unlocked: boolean;
  unlockedAt: Date | null;
  unlocked_at?: string;
  xpReward?: number;
  xp_reward: number;
  category: 'trading' | 'portfolio' | 'social' | 'streak' | 'special';
  requirement_type: string;
  progress?: number;
}

export interface AchievementProgress {
  currentValue: number;
  requirement: number;
  progressPercentage: number;
  progressText: string;
}
