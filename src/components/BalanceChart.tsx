
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatarBTC } from '../utils/formatters';

// Simulated data structure for wallet balance history
interface BalanceHistoryPoint {
  date: string;
  saldo: number;
}

interface BalanceChartProps {
  data: BalanceHistoryPoint[];
  height?: number;
}

// Format utility for X-axis dates
const formatXAxis = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// Custom tooltip content
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('pt-BR');
    
    return (
      <div className="custom-tooltip bg-card border border-border shadow-lg p-3 rounded-lg">
        <p className="font-medium mb-1">{formattedDate}</p>
        <p className="text-bitcoin">
          <span className="label">Saldo: </span>
          <span className="font-semibold">{formatarBTC(payload[0].value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const BalanceChart: React.FC<BalanceChartProps> = ({ data, height = 300 }) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F7931A" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F7931A" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis} 
            stroke="#888888"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={formatarBTC}
            stroke="#888888"
            fontSize={12}
            width={80}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="saldo" 
            stroke="#F7931A" 
            fillOpacity={1} 
            fill="url(#colorSaldo)" 
            name="Saldo BTC"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
