
import React from 'react';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import { achievementService } from './services/achievementService';
import AchievementCard from './components/AchievementCard';
import AchievementsLoading from './components/AchievementsLoading';
import AchievementsProgressOverview from './components/AchievementsProgressOverview';

const AchievementsGrid: React.FC = () => {
  const { userStats, achievements, loading } = useGamification();

  if (loading) {
    return <AchievementsLoading />;
  }

  const totalLikes = userStats?.total_likes || 0;
  const allAchievements = achievementService.getExtendedAchievements(achievements, userStats);

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
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            progressValue={achievementService.getProgressValue(achievement, userStats, totalLikes)}
            progressText={achievementService.getProgressText(achievement, userStats, totalLikes)}
          />
        ))}
      </div>

      <AchievementsProgressOverview achievements={allAchievements} />
    </div>
  );
};

export default AchievementsGrid;
