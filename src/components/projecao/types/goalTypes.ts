
export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  goal_type: 'btc' | 'usd' | 'brl';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  user_id: string;
}
