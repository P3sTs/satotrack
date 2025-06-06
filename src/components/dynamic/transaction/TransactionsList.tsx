
import React from 'react';
import { TransacaoBTC } from '@/contexts/types/CarteirasTypes';
import { TransactionItem } from './TransactionItem';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TransactionsListProps {
  transactions: TransacaoBTC[];
  isRefreshing: boolean;
  onRefresh: () => void;
  limit: number;
  walletId: string;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  isRefreshing,
  onRefresh,
  limit,
  walletId
}) => {
  const hasTransactions = transactions && transactions.length > 0;

  if (!hasTransactions) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <div className="mb-2">Nenhuma transação encontrada</div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Buscar Transações
        </Button>
      </div>
    );
  }

  return (
    <>
      {transactions.map((tx) => (
        <TransactionItem key={tx.hash} transaction={tx} />
      ))}
      
      {transactions.length >= limit && (
        <div className="p-4 border-t text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `/carteiras/${walletId}`}
          >
            Ver Todas as Transações
          </Button>
        </div>
      )}
    </>
  );
};
