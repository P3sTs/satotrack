
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CarteiraBTC, TransacaoBTC } from '@/types/types';
import { loadTransacoes } from '@/services/carteiras/transacoesService';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ReferenceLine
} from 'recharts';

interface BalanceChartProps {
  wallet: CarteiraBTC | undefined;
  timeRange: '1D' | '7D' | '30D';
}

interface BalanceDataPoint {
  timestamp: number;
  balance: number;
}

interface TransactionDataPoint {
  timestamp: number;
  valor: number;
  tipo: 'entrada' | 'saida';
}

const BalanceChart: React.FC<BalanceChartProps> = ({ wallet, timeRange }) => {
  const [chartData, setChartData] = useState<BalanceDataPoint[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'balance' | 'transactions'>('balance');

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!wallet) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Determine time range in milliseconds
        let timeInDays;
        switch (timeRange) {
          case '1D':
            timeInDays = 1;
            break;
          case '7D':
            timeInDays = 7;
            break;
          case '30D':
            timeInDays = 30;
            break;
          default:
            timeInDays = 7;
        }

        // Calculate start date
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - timeInDays * 24 * 60 * 60 * 1000);
        
        // Load actual transactions from the wallet
        const transactions = await loadTransacoes(wallet.id);
        
        // Filter transactions by time range
        const filteredTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.data);
          return txDate >= startDate && txDate <= endDate;
        });
        
        // Transform transactions for chart
        const txDataPoints: TransactionDataPoint[] = filteredTransactions.map(tx => ({
          timestamp: new Date(tx.data).getTime(),
          valor: tx.valor,
          tipo: tx.tipo
        }));
        
        setTransactionData(txDataPoints);
        
        // Generate balance chart data
        // We'll synthesize data points to represent balance over time
        const balanceDataPoints: BalanceDataPoint[] = [];
        
        // Start with the earliest known balance (if we had historical balance data)
        // For this demo, we'll use current balance and work backwards
        let currentDate = new Date(endDate);
        let currentBalance = wallet.saldo;
        
        // Generate data points - one per day for 30D, hourly for 7D, every 30 min for 1D
        let interval;
        let points;
        
        if (timeRange === '1D') {
          interval = 30 * 60 * 1000; // 30 minutes
          points = 48; // 48 points in a day (30 min intervals)
        } else if (timeRange === '7D') {
          interval = 3 * 60 * 60 * 1000; // 3 hours
          points = 7 * 8; // 7 days * 8 points per day
        } else {
          interval = 24 * 60 * 60 * 1000; // 1 day
          points = 30; // 30 days
        }
        
        // Add the current balance point
        balanceDataPoints.push({
          timestamp: currentDate.getTime(),
          balance: currentBalance
        });
        
        // Generate historical points (this is a simplified approach)
        for (let i = 1; i < points; i++) {
          currentDate = new Date(endDate.getTime() - i * interval);
          const timestamp = currentDate.getTime();
          
          // Find transactions that occurred between this point and the previous
          const previousTimestamp = currentDate.getTime() + interval;
          const relevantTxs = filteredTransactions.filter(tx => {
            const txTime = new Date(tx.data).getTime();
            return txTime > timestamp && txTime <= previousTimestamp;
          });
          
          // Adjust balance by reversing transactions
          let balanceAdjustment = 0;
          relevantTxs.forEach(tx => {
            if (tx.tipo === 'entrada') {
              balanceAdjustment -= tx.valor; // Subtract received amounts
            } else {
              balanceAdjustment += tx.valor; // Add sent amounts
            }
          });
          
          // Calculate historical balance
          currentBalance += balanceAdjustment;
          
          balanceDataPoints.push({
            timestamp,
            balance: Math.max(0, currentBalance) // Ensure no negative balance
          });
        }
        
        // Sort by timestamp ascending for the chart
        balanceDataPoints.sort((a, b) => a.timestamp - b.timestamp);
        
        setChartData(balanceDataPoints);
      } catch (error) {
        console.error("Erro ao carregar dados da carteira:", error);
      }
      setIsLoading(false);
    };

    fetchWalletData();
  }, [timeRange, wallet]);

  const formatBitcoinValue = (value: number) => {
    return `₿ ${value.toFixed(8)}`;
  };

  const formatXAxis = (timestamp: number) => {
    if (timeRange === '1D') {
      return format(timestamp, 'HH:mm', { locale: ptBR });
    } else if (timeRange === '7D') {
      return format(timestamp, 'EEE', { locale: ptBR });
    } else {
      return format(timestamp, 'dd/MM', { locale: ptBR });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center w-full h-60">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-satotrack-neon"></div>
    </div>;
  }
  
  if (!wallet) {
    return <div className="flex items-center justify-center w-full h-60">
      <p className="text-muted-foreground">Selecione uma carteira para visualizar dados</p>
    </div>;
  }

  if (view === 'balance') {
    return (
      <div className="w-full h-60 md:h-72">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Saldo da Carteira ao Longo do Tempo</h4>
          <button 
            onClick={() => setView('transactions')}
            className="text-xs text-muted-foreground hover:text-satotrack-neon px-2 py-1 rounded-md"
          >
            Ver Transações
          </button>
        </div>
        
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
              data={chartData}
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
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis 
                tickFormatter={formatBitcoinValue}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                width={80}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-dashboard-dark border border-dashboard-medium/50 p-2 rounded shadow-md">
                        <p className="text-xs">{format(data.timestamp, 'PPpp', { locale: ptBR })}</p>
                        <p className="text-sm font-semibold text-satotrack-neon">
                          {formatBitcoinValue(data.balance)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#00FFC2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }
  
  return (
    <div className="w-full h-60 md:h-72">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Transações da Carteira</h4>
        <button 
          onClick={() => setView('balance')}
          className="text-xs text-muted-foreground hover:text-satotrack-neon px-2 py-1 rounded-md"
        >
          Ver Saldo
        </button>
      </div>
      
      {transactionData.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground text-sm">Não há transações no período selecionado</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transactionData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
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
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-dashboard-dark border border-dashboard-medium/50 p-2 rounded shadow-md">
                      <p className="text-xs">{format(data.timestamp, 'PPpp', { locale: ptBR })}</p>
                      <p className={`text-sm font-semibold ${data.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                        {data.tipo === 'entrada' ? '+ ' : '- '}{formatBitcoinValue(Math.abs(data.valor))}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="valor">
              {transactionData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.tipo === 'entrada' ? '#10B981' : '#EF4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BalanceChart;
