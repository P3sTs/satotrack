
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PersonalStatsProps {
  userPosition: number;
  userStats: any;
}

const PersonalStats: React.FC<PersonalStatsProps> = ({ userPosition, userStats }) => {
  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-purple-400">Suas Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-satotrack-neon">
              #{userPosition}
            </div>
            <div className="text-xs text-muted-foreground">Posição Global</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">
              {userStats?.level || 1}
            </div>
            <div className="text-xs text-muted-foreground">Nível Atual</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">
              {userStats?.xp || 0}
            </div>
            <div className="text-xs text-muted-foreground">XP Total</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">
              {userStats?.streak || 0}
            </div>
            <div className="text-xs text-muted-foreground">Sequência</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalStats;
