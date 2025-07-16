import React from 'react';

interface CoinChartProps {
  symbol: string;
  timeRange: string;
  data: any[];
}

export const CoinChart: React.FC<CoinChartProps> = ({ symbol, timeRange }) => {
  return (
    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-full h-32 mb-4">
          {/* Simple chart placeholder */}
          <svg viewBox="0 0 300 100" className="w-full h-full text-red-500">
            <polyline
              points="0,80 50,60 100,40 150,50 200,30 250,20 300,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">Gráfico {symbol} - {timeRange}</p>
      </div>
    </div>
  );
};