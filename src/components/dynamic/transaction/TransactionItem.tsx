
import React from 'react';
import { TransacaoBTC } from '@/contexts/types/CarteirasTypes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ExternalLink } from 'lucide-react';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';

interface TransactionItemProps {
  transaction: TransacaoBTC;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction: tx }) => {
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

  const IconComponent = getTransactionIcon(tx.tipo);
  const colorClass = getTransactionColor(tx.tipo);

  return (
    <div className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors animate-fade-in">
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
};
