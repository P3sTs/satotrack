
import React from 'react';
import { Insight } from './types';

interface InsightCardProps {
  insight: Insight;
  index: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, index }) => {
  const getInsightColors = (type: string) => {
    switch (type) {
      case 'bullish':
        return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'bearish':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'neutral':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div
      key={index}
      className={`p-4 rounded-lg border-2 ${getInsightColors(insight.type)} transition-all hover:scale-105`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {insight.icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">{insight.title}</div>
          <div className="text-sm opacity-90 mb-2">{insight.message}</div>
          <div className="flex justify-between items-center">
            <div className="text-xs opacity-70">
              Confiança: {insight.confidence}%
            </div>
            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-current transition-all duration-1000"
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
