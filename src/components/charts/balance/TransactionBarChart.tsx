
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import { TransactionDataPoint } from '@/hooks/useBalanceChartData';
import { formatXAxis, formatBitcoinValue } from '../utils/ChartFormatters';
import TransactionTooltip from '../tooltips/TransactionTooltip';

interface TransactionBarChartProps {
  data: TransactionDataPoint[];
  timeRange: '7D' | '30D' | '6M' | '1Y';
}

const TransactionBarChart: React.FC<TransactionBarChartProps> = ({ data, timeRange }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={(value) => formatXAxis(value, timeRange)}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          axisLine={{ stroke: '#374151' }}
          tickLine={{ stroke: '#374151' }}
          minTickGap={30}
        />
        <YAxis 
          tickFormatter={formatBitcoinValue}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          width={80}
          axisLine={{ stroke: '#374151' }}
          tickLine={{ stroke: '#374151' }}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
        <ReferenceLine y={0} stroke="#525252" />
        <Tooltip content={<TransactionTooltip />} />
        <Bar dataKey="valor" animationDuration={1000} animationEasing="ease-out">
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.tipo === 'entrada' ? '#10B981' : '#EF4444'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TransactionBarChart;
