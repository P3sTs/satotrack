
import React from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { formatBitcoinValue } from '@/utils/formatters';
import { useRealtimeData, useValueChange } from '@/hooks/useRealtimeData';
import { DynamicValue } from '@/components/dynamic/DynamicValue';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface WalletBalanceInsightsProps {
  walletId: string;
  bitcoinData?: BitcoinPriceData | null;
}

const WalletBalanceInsights: React.FC<WalletBalanceInsightsProps> = ({ 
  walletId,
  bitcoinData
}) => {
  const { carteiras } = useCarteiras();
  const carteira = carteiras.find(c => c.id === walletId);
  
  if (!carteira) return null;
  
  // Get the wallet's transaction data
  const { transacoes, carregarTransacoes } = useCarteiras();
  
  // Real-time data fetching for transactions
  const fetchTransactionsData = async () => {
    const txs = await carregarTransacoes(walletId);
    return txs;
  };
  
  const { data: walletTransactions } = useRealtimeData(
    fetchTransactionsData,
    transacoes[walletId] || [],
    60000 // Update every 60 seconds
  );
  
  // Calculate average transactions amount for last 7 days
  const calculateRecentAverage = () => {
    if (!walletTransactions || walletTransactions.length === 0) {
      return 0;
    }
    
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const recentTxs = walletTransactions.filter(tx => {
      const txDate = new Date(tx.data);
      return txDate >= sevenDaysAgo && txDate <= now;
    });
    
    if (recentTxs.length === 0) return 0;
    
    const totalAmount = recentTxs.reduce((sum, tx) => sum + tx.valor, 0);
    return totalAmount / recentTxs.length;
  };
  
  // Simulating previous balance with a slight difference
  // In a real app, you'd store previous balance values
  const currentBalance = carteira.saldo;
  const previousBalance = currentBalance * 0.99; // Simulating a 1% change
  
  const balanceDiff = currentBalance - previousBalance;
  const percentChange = (balanceDiff / previousBalance) * 100;
  
  const averageTransactionAmount = calculateRecentAverage();
  
  // Determine change state
  const balanceChangeState = useValueChange(currentBalance, previousBalance);
  
  return (
    <div className="space-y-4 pt-2 border-t border-border">
      <h4 className="text-sm font-medium mt-2">Insights do Saldo</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Variação desde o último saldo</p>
          <div className="flex items-center">
            <DynamicValue 
              value={balanceDiff}
              formatFunc={(val) => formatBitcoinValue(val)}
              changeState={balanceChangeState}
              size="md"
            />
            <span className="ml-2 text-xs">
              ({percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Média (últimos 7 dias)</p>
          <div className="font-medium">{formatBitcoinValue(averageTransactionAmount)}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceInsights;
