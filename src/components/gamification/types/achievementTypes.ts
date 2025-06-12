
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt: Date | null;
  xpReward?: number;
}

export interface AchievementProgress {
  currentValue: number;
  requirement: number;
  progressPercentage: number;
  progressText: string;
}
