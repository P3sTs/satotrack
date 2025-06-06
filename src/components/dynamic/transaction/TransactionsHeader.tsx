
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface TransactionsHeaderProps {
  showHeader: boolean;
  showRefreshButton: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  showHeader,
  showRefreshButton,
  isRefreshing,
  lastUpdated,
  onRefresh
}) => {
  if (!showHeader) return null;

  return (
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
            onClick={onRefresh}
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
  );
};
