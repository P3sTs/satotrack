
import React from 'react';
import AchievementsSystem from '@/components/gamification/AchievementsSystem';

const Achievements = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Conquistas e Recompensas</h1>
        <p className="text-muted-foreground">
          Desbloqueie conquistas usando a plataforma e ganhe dias de Premium gratuitos!
        </p>
      </div>
      
      <AchievementsSystem />
    </div>
  );
};

export default Achievements;
