
import React, { useState } from 'react';
import { CarteiraBTC } from '@/types/types';
import { useBalanceChartData } from '@/hooks/useBalanceChartData';
import BalanceAreaChart from './balance/BalanceAreaChart';
import TransactionBarChart from './balance/TransactionBarChart';
import { TimeRange } from './selectors/TimeRangeSelector';

interface BalanceChartProps {
  wallet: CarteiraBTC | undefined;
  timeRange: TimeRange;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ wallet, timeRange }) => {
  const [view, setView] = useState<'balance' | 'transactions'>('balance');
  const { balanceData, transactionData, isLoading } = useBalanceChartData(wallet, timeRange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-60">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-satotrack-neon"></div>
      </div>
    );
  }
  
  if (!wallet) {
    return (
      <div className="flex items-center justify-center w-full h-60">
        <p className="text-muted-foreground">Selecione uma carteira para visualizar dados</p>
      </div>
    );
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
        
        <BalanceAreaChart data={balanceData} timeRange={timeRange} />
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
        <TransactionBarChart data={transactionData} timeRange={timeRange} />
      )}
    </div>
  );
};

export default BalanceChart;
