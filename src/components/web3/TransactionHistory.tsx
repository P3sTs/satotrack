
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Web3Transaction } from '@/hooks/useWeb3Wallet';
import { 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionHistoryProps {
  transactions: Web3Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNetwork, setFilterNetwork] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNetwork = filterNetwork === 'all' || tx.network === filterNetwork;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    
    return matchesSearch && matchesNetwork && matchesStatus;
  });

  const sortedTransactions = filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);

  const getExplorerUrl = (network: string, txId: string) => {
    switch (network) {
      case 'BTC':
        return `https://blockstream.info/tx/${txId}`;
      case 'ETH':
        return `https://etherscan.io/tx/${txId}`;
      case 'MATIC':
        return `https://polygonscan.com/tx/${txId}`;
      default:
        return '#';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const networks = [...new Set(transactions.map(tx => tx.network))];

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h3>
          <p className="text-muted-foreground">
            Suas transações aparecerão aqui quando você começar a usar suas carteiras
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Transações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por hash, endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={filterNetwork}
              onChange={(e) => setFilterNetwork(e.target.value)}
              className="px-3 py-2 bg-background border border-input rounded-md"
            >
              <option value="all">Todas as redes</option>
              {networks.map(network => (
                <option key={network} value={network}>{network}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-background border border-input rounded-md"
            >
              <option value="all">Todos os status</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendentes</option>
              <option value="failed">Falhou</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-3">
        {sortedTransactions.map((tx) => (
          <Card key={`${tx.network}-${tx.txId}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    tx.status === 'confirmed' ? 'bg-green-500/20' : 
                    tx.status === 'pending' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    {tx.status === 'confirmed' ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{tx.network}</Badge>
                      <Badge className={getStatusColor(tx.status)}>
                        {getStatusText(tx.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">De:</span>
                        <code className="text-xs bg-muted px-1 rounded">
                          {tx.from.slice(0, 8)}...{tx.from.slice(-8)}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Para:</span>
                        <code className="text-xs bg-muted px-1 rounded">
                          {tx.to.slice(0, 8)}...{tx.to.slice(-8)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {parseFloat(tx.amount).toFixed(6)} {tx.network}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.timestamp), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </p>
                  
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      asChild
                    >
                      <a 
                        href={getExplorerUrl(tx.network, tx.txId)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Ver no explorer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && searchTerm && (
        <Card className="p-8 text-center">
          <CardContent>
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termo de busca
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionHistory;
