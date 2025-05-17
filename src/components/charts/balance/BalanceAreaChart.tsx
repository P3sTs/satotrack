
import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { BalanceDataPoint } from '@/hooks/useBalanceChartData';
import { formatXAxis, formatBitcoinValue } from '../utils/ChartFormatters';
import BalanceTooltip from '../tooltips/BalanceTooltip';
import { TimeRange } from '../selectors/TimeRangeSelector';

interface BalanceAreaChartProps {
  data: BalanceDataPoint[];
  timeRange: TimeRange;
}

const BalanceAreaChart: React.FC<BalanceAreaChartProps> = ({ data, timeRange }) => {
  return (
    <ChartContainer
      config={{
        balance: {
          label: "Saldo BTC",
          color: "#00FFC2",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFC2" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00FFC2" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<BalanceTooltip />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#00FFC2"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#balanceGradient)"
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BalanceAreaChart;
