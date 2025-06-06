
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface StaticChartProps {
  data?: any[];
  title: string;
  type?: 'line' | 'area';
  color?: string;
  height?: number;
}

const StaticChart: React.FC<StaticChartProps> = ({ 
  data = [], 
  title, 
  type = 'line', 
  color = '#f7931a',
  height = 200 
}) => {
  // Dados estáticos mais realistas
  const staticData = data.length > 0 ? data : [
    { time: '00:00', value: 45000, volume: 1200 },
    { time: '04:00', value: 45500, volume: 1100 },
    { time: '08:00', value: 46200, volume: 1350 },
    { time: '12:00', value: 45800, volume: 1250 },
    { time: '16:00', value: 46800, volume: 1400 },
    { time: '20:00', value: 47200, volume: 1300 },
    { time: '24:00', value: 47500, volume: 1500 }
  ];

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={staticData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                  dot={false}
                />
              </AreaChart>
            ) : (
              <LineChart data={staticData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#666' }}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: color }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaticChart;
