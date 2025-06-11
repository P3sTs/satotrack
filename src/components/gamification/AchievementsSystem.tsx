
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReputationPanel from './ReputationPanel';
import AchievementsGrid from './AchievementsGrid';
import LeaderboardPanel from './LeaderboardPanel';
import { GamificationProvider } from '@/contexts/gamification/GamificationContext';

const AchievementsSystem: React.FC = () => {
  return (
    <GamificationProvider>
      <div className="space-y-6">
        <Tabs defaultValue="reputation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reputation">Minha Reputação</TabsTrigger>
            <TabsTrigger value="achievements">Todas as Conquistas</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reputation" className="space-y-6">
            <ReputationPanel />
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <AchievementsGrid />
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-6">
            <LeaderboardPanel />
          </TabsContent>
        </Tabs>
      </div>
    </GamificationProvider>
  );
};

export default AchievementsSystem;
