
export interface Widget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'alert' | 'goal';
  isMinimized: boolean;
  isFavorite: boolean;
  value?: number;
  target?: number;
  trend?: 'up' | 'down' | 'neutral';
}
