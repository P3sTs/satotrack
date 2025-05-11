
import React from 'react';
import { TransacaoBTC } from '@/types/types';
import { CarteiraBTC } from '@/contexts/types/CarteirasTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBitcoinValue, formatBitcoinPrice, formatDate } from '@/utils/formatters';
import { ArrowDownIcon, ArrowUpIcon, Bitcoin, ChevronRight } from 'lucide-react';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Button } from '@/components/ui/button';

interface CompactViewProps {
  wallet: CarteiraBTC;
  transacoes: TransacaoBTC[];
  bitcoinPrice?: number;
}

const CompactView: React.FC<CompactViewProps> = ({ wallet, transacoes, bitcoinPrice }) => {
  const { setViewMode } = useViewMode();
  
  // Get latest 3 transactions
  const latestTransactions = [...transacoes]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 3);
    
  const walletValueUsd = bitcoinPrice ? wallet.saldo * bitcoinPrice : 0;
  
  return (
    <div className="space-y-4 max-w-md mx-auto animate-fade-in">
      <Card className="border-satotrack-neon/30 hover:border-satotrack-neon/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Resumo da Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 space-y-2">
            <Bitcoin className="h-8 w-8 text-bitcoin mx-auto mb-2" />
            <div className="text-3xl font-orbitron font-bold satotrack-gradient-text">
              {formatBitcoinValue(wallet.saldo)}
            </div>
            {bitcoinPrice && (
              <div className="text-muted-foreground">
                ≈ {formatBitcoinPrice(walletValueUsd)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex justify-between items-center">
            <span>Últimas Transações</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center"
              onClick={() => setViewMode('list')}
            >
              Ver todas <ChevronRight className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {latestTransactions.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Nenhuma transação encontrada
              </div>
            ) : (
              latestTransactions.map((tx) => (
                <div key={tx.txid} className="flex justify-between items-center p-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      {tx.tipo === 'entrada' ? (
                        <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className="text-sm font-medium">
                        {tx.tipo === 'entrada' ? 'Recebido' : 'Enviado'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(tx.data)}
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
      
      <div className="flex justify-center gap-2 pt-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setViewMode('chart')}
          className="flex-1"
        >
          Ver Gráficos
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setViewMode('list')}
          className="flex-1"
        >
          Ver Lista
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setViewMode('card')}
          className="flex-1"
        >
          Ver Cards
        </Button>
      </div>
    </div>
  );
};

export default CompactView;
