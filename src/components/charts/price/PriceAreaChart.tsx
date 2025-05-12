
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
import { PriceDataPoint } from '@/hooks/usePriceChartData';
import { formatXAxis, formatCurrencyValue } from '../utils/ChartFormatters';
import PriceTooltip from '../tooltips/PriceTooltip';

interface PriceAreaChartProps {
  data: PriceDataPoint[];
  timeRange: '7D' | '30D' | '6M' | '1Y';
}

const PriceAreaChart: React.FC<PriceAreaChartProps> = ({ data, timeRange }) => {
  return (
    <ChartContainer
      config={{
        price: {
          label: "Preço USD",
          color: "#f7931a",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f7931a" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
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
            tickFormatter={formatCurrencyValue}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            width={60}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
          <Tooltip content={<PriceTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#f7931a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#priceGradient)"
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PriceAreaChart;
