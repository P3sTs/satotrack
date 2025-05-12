
import React from 'react';
import { TransacaoBTC } from '../types/types';
import { formatBitcoinValue, formatDate, formatCurrency } from '../utils/formatters';
import { ArrowDown, ArrowUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

interface TransacoesListProps {
  transacoes: TransacaoBTC[];
  isLoading?: boolean;
  getExplorerLink?: (hash: string) => string;
  showStatus?: boolean;
}

const TransacoesList: React.FC<TransacoesListProps> = ({ 
  transacoes, 
  isLoading = false, 
  getExplorerLink,
  showStatus = false 
}) => {
  const { data: bitcoinData } = useBitcoinPrice();
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index}
            className="p-4 border border-border/30 rounded-lg animate-pulse bg-muted/50"
          >
            <div className="h-5 w-40 bg-muted rounded mb-2"></div>
            <div className="h-4 w-20 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (transacoes.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
      {transacoes.map((tx) => {
        // Calculate fiat values when bitcoin price data is available
        const fiatValueUSD = bitcoinData ? tx.valor * bitcoinData.price_usd : null;
        const fiatValueBRL = bitcoinData ? tx.valor * bitcoinData.price_brl : null;
        
        // Determine transaction status (in a real app, this would come from the API)
        // For now, we'll assume all transactions are confirmed
        const status = 'confirmada';
        
        return (
          <div 
            key={tx.hash}
            className="p-4 border border-border/30 rounded-lg hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {tx.tipo === 'entrada' ? (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  )}
                  <p className="text-sm font-medium">
                    {tx.tipo === 'entrada' ? 'Recebido' : 'Enviado'}
                  </p>
                  {showStatus && (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full ml-2">
                      {status}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mb-1">
                  {formatDate(tx.data, true)} {/* Add the true parameter to include time */}
                </p>
                
                <div className="flex items-center gap-1">
                  <p className="text-xs font-mono text-muted-foreground truncate w-32 sm:w-auto">
                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                  </p>
                  
                  {getExplorerLink && (
                    <a 
                      href={getExplorerLink(tx.hash)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">Ver no Explorer</span>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-medium ${tx.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                  {formatBitcoinValue(tx.valor)}
                </div>
                
                {/* Display fiat equivalents if bitcoin price data is available */}
                {fiatValueUSD !== null && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatCurrency(fiatValueUSD, 'USD')}
                  </p>
                )}
                
                {fiatValueBRL !== null && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatCurrency(fiatValueBRL, 'BRL')}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransacoesList;
