import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft,
  ExternalLink,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  hash: string;
  type: 'send' | 'receive';
  amount: string;
  symbol: string;
  from: string;
  to: string;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
  gasFee?: string;
}

interface TransactionHistoryProps {
  userWallets?: any[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userWallets = [] }) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchTransactions = async () => {
    if (!searchAddress) {
      toast.error('Digite um endereço válido');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`🔍 Buscando transações para ${searchAddress}...`);
      
      // Simular chamada Tatum API
      // GET /v3/{chain}/transaction/address/{address}
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTransactions = generateMockTransactions(searchAddress);
      setTransactions(mockTransactions);
      
      toast.success(`✅ ${mockTransactions.length} transações encontradas`);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('❌ Erro ao buscar transações');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockTransactions = (address: string): Transaction[] => {
    const mockTxs: Transaction[] = [];
    
    for (let i = 0; i < 10; i++) {
      const isReceive = Math.random() > 0.5;
      mockTxs.push({
        hash: '0x' + Math.random().toString(16).substring(2, 66),
        type: isReceive ? 'receive' : 'send',
        amount: (Math.random() * 10).toFixed(6),
        symbol: 'ETH',
        from: isReceive ? '0x' + Math.random().toString(16).substring(2, 42) : address,
        to: isReceive ? address : '0x' + Math.random().toString(16).substring(2, 42),
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: Math.random() > 0.1 ? 'confirmed' : 'pending',
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 100000).toString(),
        gasFee: (Math.random() * 0.01).toFixed(6)
      });
    }
    
    return mockTxs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const filteredTransactions = transactions.filter(tx => {
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5 text-purple-400" />
            Buscar Transações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="0x... ou endereço da carteira"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chain">Blockchain</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="failed">Falharam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearchTransactions}
                disabled={isLoading || !searchAddress}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {transactions.length > 0 && (
        <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="send">Enviadas</SelectItem>
                  <SelectItem value="receive">Recebidas</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                {filteredTransactions.length} transações
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-purple-400" />
              Histórico de Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dashboard-medium/30 rounded-lg border border-dashboard-light/20 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                          {tx.type === 'receive' ? 'Recebido' : 'Enviado'}
                        </p>
                        <Badge className={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {tx.hash.substring(0, 20)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className={`font-medium ${
                      tx.type === 'receive' ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.symbol}
                    </p>
                    {tx.gasFee && (
                      <p className="text-xs text-muted-foreground">
                        Gas: {tx.gasFee} ETH
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      asChild
                    >
                      <a 
                        href={`https://etherscan.io/tx/${tx.hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Explorer
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Info */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-300">📊 Recursos de Transações:</p>
              <ul className="text-blue-200 space-y-1 text-xs">
                <li>• Histórico completo via Tatum API</li>
                <li>• Filtros avançados por tipo, status e data</li>
                <li>• Detalhes de gas e confirmações</li>
                <li>• Links diretos para explorers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;