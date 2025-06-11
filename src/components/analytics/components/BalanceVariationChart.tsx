
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BalanceVariationData } from '../types/riskTypes';

interface BalanceVariationChartProps {
  balanceData: BalanceVariationData[];
  selectedTimeframe: '24h' | '48h' | '7d';
  onTimeframeChange: (timeframe: '24h' | '48h' | '7d') => void;
}

const BalanceVariationChart: React.FC<BalanceVariationChartProps> = ({
  balanceData,
  selectedTimeframe,
  onTimeframeChange
}) => {
  return (
    <Card className="bg-dashboard-dark border-satotrack-neon/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-satotrack-neon" />
            Variação de Saldo - {selectedTimeframe}
          </CardTitle>
          <div className="flex gap-2">
            {(['24h', '48h', '7d'] as const).map(period => (
              <button
                key={period}
                onClick={() => onTimeframeChange(period)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedTimeframe === period
                    ? 'bg-satotrack-neon text-dashboard-dark'
                    : 'bg-dashboard-medium text-muted-foreground hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                interval="preserveStartEnd"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} sats`, 'Saldo']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#00d4ff"
                fill="rgba(0, 212, 255, 0.1)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceVariationChart;
