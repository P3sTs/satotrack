
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowDown, ArrowUp, ExternalLink, Copy } from 'lucide-react';
import { formatBitcoinValue, formatDate } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface WalletData {
  balance: number;
  total_received: number;
  total_sent: number;
  transaction_count: number;
  transactions: Array<{
    hash: string;
    amount: number;
    transaction_type: 'entrada' | 'saida';
    transaction_date: string;
  }>;
}

const BitcoinWalletLookup: React.FC = () => {
  const [address, setAddress] = useState('');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!address.trim()) {
      toast.error('Por favor, insira um endereço Bitcoin válido');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-wallet-data', {
        body: {
          address: address.trim()
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro ao buscar dados da carteira');
      }

      setWalletData(data);
      toast.success('Dados da carteira carregados com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado para área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  const getExplorerUrl = (hash: string) => {
    return `https://www.blockchain.com/explorer/transactions/btc/${hash}`;
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-bitcoin" />
            Consultar Carteira Bitcoin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o endereço Bitcoin (ex: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !address.trim()}
              className="bg-bitcoin hover:bg-bitcoin-dark"
            >
              {isLoading ? 'Buscando...' : 'Consultar'}
            </Button>
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-500">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {walletData && (
        <div className="space-y-4">
          {/* Wallet Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💰 Carteira Bitcoin Monitorada</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded">{address}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(address)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-bitcoin">
                    {formatBitcoinValue(walletData.balance)}
                  </div>
                  <div className="text-sm text-muted-foreground">Saldo Atual</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {formatBitcoinValue(walletData.total_received)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Recebido</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {formatBitcoinValue(walletData.total_sent)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Enviado</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">
                    {walletData.transaction_count}
                  </div>
                  <div className="text-sm text-muted-foreground">Nº de Transações</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          {walletData.transactions && walletData.transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>🧾 Últimas Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {walletData.transactions.map((tx) => (
                    <div 
                      key={tx.hash} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {tx.transaction_type === 'entrada' ? (
                            <ArrowDown className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowUp className="h-4 w-4 text-red-500" />
                          )}
                          <Badge 
                            variant={tx.transaction_type === 'entrada' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {tx.transaction_type === 'entrada' ? 'Entrada' : 'Saída'}
                          </Badge>
                        </div>
                        <div>
                          <div className="font-mono text-sm">
                            {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(tx.transaction_date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${
                          tx.transaction_type === 'entrada' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatBitcoinValue(tx.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-6 w-6 p-0"
                        >
                          <a 
                            href={getExplorerUrl(tx.hash)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default BitcoinWalletLookup;
