
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useRealtimeData, RealtimeChartData, WalletPerformanceData } from '@/hooks/useRealtimeData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RealtimeChartProps {
  title?: string;
  type?: 'price' | 'wallet';
  height?: number;
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({ 
  title = "Bitcoin Price (Real-time)", 
  type = 'price',
  height = 300 
}) => {
  const { chartData, walletData, isLoading, lastUpdate } = useRealtimeData();
  
  const data = type === 'price' ? chartData : walletData;
  
  if (isLoading || data.length === 0) {
    return (
      <Card className="cyberpunk-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-pulse text-satotrack-neon" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin text-satotrack-neon mx-auto mb-2" />
            <p className="text-muted-foreground">Carregando dados em tempo real...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentValue = data[data.length - 1];
  const previousValue = data[data.length - 2];

  // Type-safe access to price/totalValue
  const getCurrentPrice = (item: RealtimeChartData | WalletPerformanceData) => {
    return type === 'price' ? (item as RealtimeChartData).price : (item as WalletPerformanceData).totalValue;
  };

  const change = currentValue && previousValue 
    ? getCurrentPrice(currentValue) - getCurrentPrice(previousValue)
    : 0;
  const changePercent = previousValue 
    ? (change / getCurrentPrice(previousValue) * 100)
    : 0;

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 23, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          maxTicksLimit: 6,
          callback: function(value: any, index: number) {
            const date = new Date(data[index]?.timestamp || '');
            return date.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          },
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          callback: function(value: any) {
            if (type === 'price') {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value);
            } else {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value);
            }
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
    animation: {
      duration: 300,
    },
  };

  const chartDataConfig = {
    labels: data.map(item => item.timestamp),
    datasets: [
      {
        label: type === 'price' ? 'Preço BTC' : 'Valor Total',
        data: data.map(item => getCurrentPrice(item)),
        borderColor: change >= 0 ? '#22c55e' : '#ef4444',
        backgroundColor: change >= 0 
          ? 'rgba(34, 197, 94, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        pointBackgroundColor: change >= 0 ? '#22c55e' : '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <Card className="cyberpunk-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-satotrack-neon" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Última atualização: {new Date(lastUpdate).toLocaleTimeString('pt-BR')}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ height }}>
          <Line data={chartDataConfig} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeChart;
