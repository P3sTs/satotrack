
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Medal, Star, TrendingUp } from 'lucide-react';
import { LeaderboardUser } from '../types/leaderboardTypes';

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users }) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-400" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-satotrack-neon" />
          Ranking Completo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
              user.isCurrentUser
                ? 'bg-satotrack-neon/10 border border-satotrack-neon/30'
                : 'bg-muted/20 hover:bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10">
              {getRankIcon(index + 1)}
            </div>
            
            <Avatar>
              <AvatarFallback className="bg-muted">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${user.isCurrentUser ? 'text-satotrack-neon' : ''}`}>
                  {user.name}
                </span>
                {user.isCurrentUser && (
                  <Badge variant="outline" className="text-satotrack-neon border-satotrack-neon/30">
                    Você
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Nível {user.level} • {user.achievements} conquistas
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-satotrack-neon">
                {user.xp.toLocaleString()} XP
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3" />
                {user.streak} dias
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
