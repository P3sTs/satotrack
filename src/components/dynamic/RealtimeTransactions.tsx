
import React from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { TransacaoBTC } from '@/contexts/types/CarteirasTypes';
import { useCarteiras } from '@/contexts/carteiras';
import { Card, CardContent } from '@/components/ui/card';
import { refreshTransacoes } from '@/services/carteiras/transacoesService';
import { TransactionsHeader } from './transaction/TransactionsHeader';
import { TransactionsList } from './transaction/TransactionsList';
import { TransactionsLoading } from './transaction/TransactionsLoading';

interface RealtimeTransactionsProps {
  walletId: string;
  limit?: number;
  refreshInterval?: number;
  showRefreshButton?: boolean;
  showHeader?: boolean;
  className?: string;
}

/**
 * Componente que exibe transações recentes em tempo real com dados completos
 */
export const RealtimeTransactions: React.FC<RealtimeTransactionsProps> = ({
  walletId,
  limit = 10,
  refreshInterval = 30000, // 30 segundos
  showRefreshButton = true,
  showHeader = true,
  className = ""
}) => {
  const { carregarTransacoes } = useCarteiras();
  
  // Função para buscar transações com refresh forçado
  const fetchTransactions = async (): Promise<TransacaoBTC[]> => {
    console.log(`Fetching transactions for wallet: ${walletId}`);
    
    try {
      // First try to refresh from API
      const transactions = await refreshTransacoes(walletId);
      return transactions
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to refresh from API, using cached data:', error);
      // Fallback to cached data
      const transactions = await carregarTransacoes(walletId);
      return transactions
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, limit);
    }
  };
  
  const { 
    data: transactions, 
    isLoading, 
    isRefreshing,
    refresh,
    lastUpdated
  } = useRealtimeData<TransacaoBTC[]>(
    fetchTransactions,
    [],
    refreshInterval
  );

  if (isLoading) {
    return (
      <TransactionsLoading 
        showHeader={showHeader}
        className={className}
      />
    );
  }
  
  return (
    <Card className={className}>
      <TransactionsHeader
        showHeader={showHeader}
        showRefreshButton={showRefreshButton}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      />
      <CardContent className="p-0">
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          <TransactionsList
            transactions={transactions || []}
            isRefreshing={isRefreshing}
            onRefresh={refresh}
            limit={limit}
            walletId={walletId}
          />
        </div>
      </CardContent>
    </Card>
  );
};
