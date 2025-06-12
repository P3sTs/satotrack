
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Medal, Trophy, Star } from 'lucide-react';
import { LeaderboardUser } from '../types/leaderboardTypes';

interface LeaderboardPodiumProps {
  topThreeUsers: LeaderboardUser[];
}

const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ topThreeUsers }) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-400" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'from-yellow-900/40 to-orange-900/40 border-yellow-500/30';
      case 2: return 'from-gray-900/40 to-slate-900/40 border-gray-500/30';
      case 3: return 'from-orange-900/40 to-red-900/40 border-orange-500/30';
      default: return 'from-muted/20 to-muted/10 border-muted/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {topThreeUsers.map((user, index) => (
        <Card
          key={user.id}
          className={`bg-gradient-to-br ${getRankColor(index + 1)} text-center`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-2">
              {getRankIcon(index + 1)}
            </div>
            <Avatar className="mx-auto mb-2">
              <AvatarFallback className="bg-muted text-lg">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-satotrack-neon">
              {user.xp.toLocaleString()} XP
            </div>
            <div className="text-sm text-muted-foreground">
              Nível {user.level}
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {user.achievements}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {user.streak}d
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeaderboardPodium;
