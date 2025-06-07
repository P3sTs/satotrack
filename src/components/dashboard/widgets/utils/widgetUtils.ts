
import { TrendingUp, TrendingDown, Activity, Target, Zap } from 'lucide-react';

export const getWidgetIcon = (type: string, trend?: string) => {
  switch (type) {
    case 'metric':
      return trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
    case 'goal':
      return Target;
    case 'alert':
      return Zap;
    default:
      return Activity;
  }
};
