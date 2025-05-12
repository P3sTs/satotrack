
import React, { useState } from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import TransacoesList from '@/components/TransacoesList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransacaoBTC } from '@/contexts/types/CarteirasTypes';

interface WalletTransactionHistoryProps {
  walletId: string;
}

const WalletTransactionHistory: React.FC<WalletTransactionHistoryProps> = ({ 
  walletId 
}) => {
  const { transacoes, carregarTransacoes } = useCarteiras();
  const [isLoading, setIsLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // Load transactions if not already loaded
  React.useEffect(() => {
    const loadTransactions = async () => {
      if (!transacoes[walletId]) {
        setIsLoading(true);
        try {
          await carregarTransacoes(walletId);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadTransactions();
  }, [walletId]);
  
  const txs = transacoes[walletId] || [];
  
  // Filter transactions by time period
  const getFilteredTransactions = (): TransacaoBTC[] => {
    if (timeFilter === 'all') {
      return txs;
    }
    
    const now = new Date();
    let startDate = new Date();
    
    if (timeFilter === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFilter === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeFilter === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    return txs.filter(tx => {
      const txDate = new Date(tx.data);
      return txDate >= startDate && txDate <= now;
    });
  };
  
  // Get external link to blockchain explorer
  const getExplorerLink = (hash: string) => {
    return `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
  };
  
  const filteredTxs = getFilteredTransactions();
  
  return (
    <div className="space-y-4">
      {/* Time period filter */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant={timeFilter === 'all' ? "default" : "outline"} 
          onClick={() => setTimeFilter('all')}
        >
          Todas
        </Button>
        <Button 
          size="sm" 
          variant={timeFilter === 'today' ? "default" : "outline"} 
          onClick={() => setTimeFilter('today')}
        >
          Hoje
        </Button>
        <Button 
          size="sm" 
          variant={timeFilter === 'week' ? "default" : "outline"} 
          onClick={() => setTimeFilter('week')}
        >
          7 dias
        </Button>
        <Button 
          size="sm" 
          variant={timeFilter === 'month' ? "default" : "outline"} 
          onClick={() => setTimeFilter('month')}
        >
          30 dias
        </Button>
      </div>
      
      {/* Transaction type tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="in">Recebidas</TabsTrigger>
          <TabsTrigger value="out">Enviadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-2">
          <TransacoesList 
            transacoes={filteredTxs} 
            isLoading={isLoading} 
            getExplorerLink={getExplorerLink}
            showStatus={true}
          />
        </TabsContent>
        
        <TabsContent value="in" className="mt-2">
          <TransacoesList 
            transacoes={filteredTxs.filter(tx => tx.tipo === 'entrada')} 
            isLoading={isLoading}
            getExplorerLink={getExplorerLink}
            showStatus={true}
          />
        </TabsContent>
        
        <TabsContent value="out" className="mt-2">
          <TransacoesList 
            transacoes={filteredTxs.filter(tx => tx.tipo === 'saida')} 
            isLoading={isLoading}
            getExplorerLink={getExplorerLink}
            showStatus={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletTransactionHistory;
