
import React from 'react';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import { leaderboardService } from './services/leaderboardService';
import LeaderboardPodium from './components/LeaderboardPodium';
import LeaderboardTable from './components/LeaderboardTable';
import PersonalStats from './components/PersonalStats';

const LeaderboardPanel: React.FC = () => {
  const { userStats } = useGamification();
  
  const leaderboardData = leaderboardService.getMockLeaderboardData(userStats);
  const { users, currentUserPosition } = leaderboardData;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ranking da Comunidade</h2>
        <p className="text-muted-foreground">
          Veja como você se compara com outros usuários
        </p>
      </div>

      {/* Top 3 Podium */}
      <LeaderboardPodium topThreeUsers={users.slice(0, 3)} />

      {/* Full Leaderboard */}
      <LeaderboardTable users={users} />

      {/* Personal Statistics */}
      <PersonalStats userPosition={currentUserPosition} userStats={userStats} />
    </div>
  );
};

export default LeaderboardPanel;
