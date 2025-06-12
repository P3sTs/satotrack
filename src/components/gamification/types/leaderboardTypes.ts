
export interface LeaderboardUser {
  id: string;
  name: string;
  level: number;
  xp: number;
  achievements: number;
  streak: number;
  isCurrentUser: boolean;
}

export interface LeaderboardData {
  users: LeaderboardUser[];
  currentUserPosition: number;
}
