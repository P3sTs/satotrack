
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import { Crown, Trophy, Medal, Star, TrendingUp } from 'lucide-react';

const LeaderboardPanel: React.FC = () => {
  const { userStats } = useGamification();

  // Mock data for leaderboard (in a real app, this would come from Supabase)
  const leaderboardData = [
    {
      id: '1',
      name: 'CryptoWhale',
      level: 45,
      xp: 4500,
      achievements: 28,
      streak: 89,
      isCurrentUser: false
    },
    {
      id: '2',
      name: 'SatoshiFollower',
      level: 38,
      xp: 3800,
      achievements: 22,
      streak: 45,
      isCurrentUser: false
    },
    {
      id: '3',
      name: 'DiamondHands',
      level: 35,
      xp: 3500,
      achievements: 20,
      streak: 67,
      isCurrentUser: false
    },
    {
      id: '4',
      name: 'Você',
      level: userStats?.level || 1,
      xp: userStats?.xp || 0,
      achievements: 5,
      streak: userStats?.streak || 0,
      isCurrentUser: true
    },
    {
      id: '5',
      name: 'BitcoinMaxi',
      level: 25,
      xp: 2500,
      achievements: 15,
      streak: 23,
      isCurrentUser: false
    }
  ].sort((a, b) => b.xp - a.xp);

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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ranking da Comunidade</h2>
        <p className="text-muted-foreground">
          Veja como você se compara com outros usuários
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {leaderboardData.slice(0, 3).map((user, index) => (
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

      {/* Full Leaderboard */}
      <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-satotrack-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-satotrack-neon" />
            Ranking Completo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboardData.map((user, index) => (
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

      {/* Estatísticas Pessoais */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400">Suas Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-satotrack-neon">
                #{leaderboardData.findIndex(u => u.isCurrentUser) + 1}
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
    </div>
  );
};

export default LeaderboardPanel;
