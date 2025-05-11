
import React from 'react';
import { TransacaoBTC } from '../types/types';
import { formatarBTC, formatarData } from '../utils/formatters';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface TransacoesListProps {
  transacoes: TransacaoBTC[];
  isLoading?: boolean; // Make isLoading optional
}

const TransacoesList: React.FC<TransacoesListProps> = ({ transacoes, isLoading = false }) => {
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
      {transacoes.map((tx) => (
        <div 
          key={tx.hash}
          className="p-4 border border-border/30 rounded-lg hover:bg-muted/20 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {tx.tipo === 'entrada' ? 'Recebido' : 'Enviado'} • {formatarData(tx.data)}
              </p>
              <p className="text-xs font-mono text-muted-foreground truncate w-56 sm:w-auto">
                {tx.hash}
              </p>
            </div>
            <div className={`flex items-center ${tx.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
              {tx.tipo === 'entrada' ? (
                <ArrowDown className="h-3 w-3 mr-1" />
              ) : (
                <ArrowUp className="h-3 w-3 mr-1" />
              )}
              <span className="font-medium">{formatarBTC(tx.valor)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransacoesList;
