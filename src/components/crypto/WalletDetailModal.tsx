import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  Clock,
  Shield,
  RefreshCw,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';

interface WalletTransaction {
  id: string;
  hash: string;
  type: 'sent' | 'received';
  amount: string;
  from: string;
  to: string;
  timestamp: string;
  confirmations: number;
  fee?: string;
  status: 'confirmed' | 'pending' | 'failed';
}

interface WalletDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: MultiChainWallet;
  selectedCurrency: 'USD' | 'BRL' | 'BTC';
}

export const WalletDetailModal: React.FC<WalletDetailModalProps> = ({
  isOpen,
  onClose,
  wallet,
  selectedCurrency
}) => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoadingTxs, setIsLoadingTxs] = useState(false);
  const [walletStats, setWalletStats] = useState({
    totalReceived: '0',
    totalSent: '0',
    transactionCount: 0,
    firstTransaction: null as string | null,
    avgTransactionValue: '0'
  });

  const getCryptoIcon = (currency: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      MATIC: '⬟',
      USDT: '₮',
      SOL: '◎'
    };
    return icons[currency as keyof typeof icons] || '●';
  };

  const formatBalance = (balance: string, currency: string, displayCurrency: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0.00';
    
    switch (displayCurrency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(num * 50000);
      case 'BRL':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(num * 280000);
      case 'BTC':
        if (currency === 'BTC') return `${num.toFixed(8)} BTC`;
        return `${(num * 0.000001).toFixed(8)} BTC`;
      default:
        return `${num.toFixed(6)} ${currency}`;
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado!`);
    } catch (error) {
      toast.error(`Erro ao copiar ${label}`);
    }
  };

  const getExplorerUrl = (currency: string, hash: string) => {
    const explorers = {
      BTC: `https://blockstream.info/tx/${hash}`,
      ETH: `https://etherscan.io/tx/${hash}`,
      MATIC: `https://polygonscan.com/tx/${hash}`,
      USDT: `https://etherscan.io/tx/${hash}`,
      SOL: `https://explorer.solana.com/tx/${hash}`
    };
    return explorers[currency as keyof typeof explorers] || '#';
  };

  const loadTransactions = async () => {
    setIsLoadingTxs(true);
    try {
      // Simulated transaction data - replace with real API call
      const mockTransactions: WalletTransaction[] = [
        {
          id: '1',
          hash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
          type: 'received',
          amount: '0.00125000',
          from: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
          to: wallet.address,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          confirmations: 6,
          status: 'confirmed'
        },
        {
          id: '2',
          hash: '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a',
          type: 'sent',
          amount: '0.00050000',
          from: wallet.address,
          to: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          confirmations: 12,
          fee: '0.00000500',
          status: 'confirmed'
        }
      ];

      setTransactions(mockTransactions);
      
      // Calculate stats
      const received = mockTransactions
        .filter(tx => tx.type === 'received')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      
      const sent = mockTransactions
        .filter(tx => tx.type === 'sent')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      setWalletStats({
        totalReceived: received.toFixed(8),
        totalSent: sent.toFixed(8),
        transactionCount: mockTransactions.length,
        firstTransaction: mockTransactions.length > 0 ? mockTransactions[mockTransactions.length - 1].timestamp : null,
        avgTransactionValue: ((received + sent) / mockTransactions.length || 0).toFixed(8)
      });
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setIsLoadingTxs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTransactions();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white text-lg font-bold">
              {getCryptoIcon(wallet.currency)}
            </div>
            {wallet.name} - Detalhes Completos
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre sua carteira {wallet.currency}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Saldo Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatBalance(wallet.balance, wallet.currency, selectedCurrency)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ {formatBalance(wallet.balance, wallet.currency, wallet.currency)}
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Recebido</div>
                  <div className="text-lg font-bold text-green-400">
                    {walletStats.totalReceived} {wallet.currency}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Enviado</div>
                  <div className="text-lg font-bold text-red-400">
                    {walletStats.totalSent} {wallet.currency}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Transações</div>
                  <div className="text-lg font-bold">
                    {walletStats.transactionCount}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Valor Médio</div>
                  <div className="text-lg font-bold">
                    {walletStats.avgTransactionValue} {wallet.currency}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Address Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Endereço Público:</div>
                  <div className="flex items-center gap-2 p-3 bg-dashboard-dark/50 rounded-lg border">
                    <span className="font-mono text-sm break-all flex-1">{wallet.address}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {wallet.xpub && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Extended Public Key (xPub):</div>
                    <div className="flex items-center gap-2 p-3 bg-dashboard-dark/50 rounded-lg border">
                      <span className="font-mono text-sm break-all flex-1">{wallet.xpub}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.xpub!, 'xPub')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Histórico de Transações</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={loadTransactions}
                disabled={isLoadingTxs}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingTxs ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>

            <div className="space-y-2">
              {transactions.map((tx) => (
                <Card key={tx.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${tx.type === 'received' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {tx.type === 'received' ? 
                            <ArrowDown className="h-4 w-4 text-green-400" /> : 
                            <ArrowUp className="h-4 w-4 text-red-400" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={tx.type === 'received' ? 'default' : 'destructive'}>
                              {tx.type === 'received' ? 'Recebido' : 'Enviado'}
                            </Badge>
                            <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                              {tx.confirmations} confirmações
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {new Date(tx.timestamp).toLocaleDateString()} às {new Date(tx.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-4 w-4 p-0"
                            >
                              <a 
                                href={getExplorerUrl(wallet.currency, tx.hash)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-mono font-bold ${tx.type === 'received' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'received' ? '+' : '-'}{tx.amount} {wallet.currency}
                        </div>
                        {tx.fee && (
                          <div className="text-xs text-muted-foreground">
                            Taxa: {tx.fee} {wallet.currency}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {transactions.length === 0 && !isLoadingTxs && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma transação encontrada</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança da Carteira
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-satotrack-neon/10 border border-satotrack-neon/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-satotrack-neon" />
                    <span className="font-medium text-satotrack-neon">Protegido por SatoTracker KMS</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sua carteira é gerenciada por nosso sistema de gerenciamento de chaves (KMS) seguro. 
                    As chaves privadas são criptografadas e nunca expostas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Tipo de Carteira</h4>
                    <p className="text-sm text-muted-foreground">HD Wallet (Hierarchical Deterministic)</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Criptografia</h4>
                    <p className="text-sm text-muted-foreground">AES-256 + HSM</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Backup</h4>
                    <p className="text-sm text-muted-foreground">Backup automático seguro</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Auditoria</h4>
                    <p className="text-sm text-muted-foreground">Logs de segurança completos</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="font-medium text-yellow-400 mb-2">⚠️ Importante</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nunca compartilhe seu endereço xPub com terceiros não confiáveis</li>
                    <li>• Mantenha sua conta SatoTracker segura com senha forte</li>
                    <li>• Habilite autenticação de dois fatores quando disponível</li>
                    <li>• Verifique sempre os endereços de destino antes de enviar</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};