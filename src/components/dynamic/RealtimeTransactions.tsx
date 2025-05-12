
import React from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { TransacaoBTC } from '@/types/types';
import { useCarteiras } from '@/contexts/hooks/useCarteirasContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

interface RealtimeTransactionsProps {
  walletId: string;
  limit?: number;
  refreshInterval?: number;
  showRefreshButton?: boolean;
  showHeader?: boolean;
  className?: string;
}

/**
 * Componente que exibe transações recentes em tempo real
 */
export const RealtimeTransactions: React.FC<RealtimeTransactionsProps> = ({
  walletId,
  limit = 5,
  refreshInterval = 60000,
  showRefreshButton = true,
  showHeader = true,
  className = ""
}) => {
  const { carregarTransacoes } = useCarteiras();
  
  // Função para buscar transações
  const fetchTransactions = async (): Promise<TransacaoBTC[]> => {
    const transactions = await carregarTransacoes(walletId);
    return transactions
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, limit);
  };
  
  const { 
    data: transactions, 
    isLoading, 
    isRefreshing,
    refresh
  } = useRealtimeData<TransacaoBTC[]>(
    fetchTransactions,
    [],
    refreshInterval
  );
  
  if (isLoading) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-md">Transações Recentes</CardTitle>
            </div>
          </CardHeader>
        )}
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Animação para novas transações
  const hasTransactions = transactions && transactions.length > 0;
  
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-md">Transações Recentes</CardTitle>
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={isRefreshing}
                className="h-7 px-2 py-0"
              >
                <RefreshCw 
                  className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} 
                />
                <span className="text-xs">Atualizar</span>
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {!hasTransactions ? (
            <div className="py-6 text-center text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          ) : (
            transactions.map((tx) => (
              <div 
                key={tx.hash} 
                className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors animate-fade-in"
              >
                <div className="space-y-1">
                  <div className="flex items-center">
                    {tx.tipo === 'entrada' ? (
                      <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {tx.tipo === 'entrada' ? 'Recebido' : 'Enviado'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(tx.data)}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground truncate w-40 sm:w-auto">
                    {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                  </div>
                </div>
                <div className={`font-mono ${
                  tx.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatBitcoinValue(tx.valor)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
