
import React from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { TransacaoBTC } from '@/types/types';
import { useCarteiras } from '@/contexts/carteiras';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { refreshTransacoes } from '@/services/carteiras/transacoesService';

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
  
  const getExplorerUrl = (hash: string) => {
    return `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
  };

  const getTransactionColor = (tipo: string) => {
    return tipo === 'entrada' ? 'text-green-500' : 'text-red-500';
  };

  const getTransactionIcon = (tipo: string) => {
    return tipo === 'entrada' ? ArrowDown : ArrowUp;
  };

  const getTransactionLabel = (tipo: string) => {
    return tipo === 'entrada' ? 'Recebido' : 'Enviado';
  };

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
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const hasTransactions = transactions && transactions.length > 0;
  
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-md">Transações Recentes</CardTitle>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Última atualização: {formatDate(lastUpdated.toISOString())}
                </p>
              )}
            </div>
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
                <span className="text-xs">
                  {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                </span>
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {!hasTransactions ? (
            <div className="py-8 text-center text-muted-foreground">
              <div className="mb-2">Nenhuma transação encontrada</div>
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Buscar Transações
              </Button>
            </div>
          ) : (
            transactions.map((tx) => {
              const IconComponent = getTransactionIcon(tx.tipo);
              const colorClass = getTransactionColor(tx.tipo);
              
              return (
                <div 
                  key={tx.hash} 
                  className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors animate-fade-in"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${colorClass}`} />
                      <Badge 
                        variant={tx.tipo === 'entrada' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {getTransactionLabel(tx.tipo)}
                      </Badge>
                      {tx.confirmations !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {tx.confirmations === 0 ? 'Não confirmada' : `${tx.confirmations} confirmações`}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatDate(tx.data)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground truncate max-w-32">
                        {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-4 w-4 p-0"
                      >
                        <a 
                          href={getExplorerUrl(tx.hash)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Ver no explorer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-mono font-bold ${colorClass}`}>
                      {tx.tipo === 'entrada' ? '+' : '-'}{formatBitcoinValue(tx.valor)}
                    </div>
                    {tx.fee !== undefined && tx.fee > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Taxa: {formatBitcoinValue(tx.fee)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {hasTransactions && transactions.length >= limit && (
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
      </CardContent>
    </Card>
  );
};
