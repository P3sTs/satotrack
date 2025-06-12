
import { LeaderboardUser, LeaderboardData } from '../types/leaderboardTypes';

export const leaderboardService = {
  // Mock data for leaderboard (in a real app, this would come from Supabase)
  getMockLeaderboardData: (userStats: any): LeaderboardData => {
    const users: LeaderboardUser[] = [
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

    const currentUserPosition = users.findIndex(u => u.isCurrentUser) + 1;

    return {
      users,
      currentUserPosition
    };
  }
};
