import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, 
  ExternalLink, 
  Eye, 
  EyeOff,
  RefreshCw,
  Send,
  Download,
  Shield,
  Activity,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import SendCryptoModalNew from './SendCryptoModalNew';
import ReceiveCryptoModalNew from './ReceiveCryptoModalNew';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  created_at?: string;
  user_id?: string;
  xpub?: string;
}

interface CryptoWalletCardExpandedProps {
  wallet: CryptoWallet;
  onSend?: () => void;
  onReceive?: () => void;
  onRefresh?: () => void;
  onCollapse?: () => void;
}

const CryptoWalletCardExpanded: React.FC<CryptoWalletCardExpandedProps> = ({ 
  wallet, 
  onSend, 
  onReceive,
  onRefresh,
  onCollapse 
}) => {
  const [showAddress, setShowAddress] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const getCryptoColor = (currency: string) => {
    const colors = {
      BTC: 'from-orange-500 to-yellow-500',
      ETH: 'from-blue-500 to-purple-500',
      MATIC: 'from-purple-500 to-pink-500',
      USDT: 'from-green-500 to-teal-500',
      SOL: 'from-purple-600 to-blue-600',
    };
    return colors[currency as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

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

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0.00000000';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(8);
  };

  const formatAddress = (address: string) => {
    if (showAddress) return address;
    return `${address.slice(0, 12)}...${address.slice(-12)}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado!`);
    } catch (error) {
      toast.error(`Erro ao copiar ${label}`);
    }
  };

  const getExplorerUrl = (currency: string, address: string) => {
    const explorers = {
      BTC: `https://blockstream.info/address/${address}`,
      ETH: `https://etherscan.io/address/${address}`,
      MATIC: `https://polygonscan.com/address/${address}`,
      USDT: `https://etherscan.io/address/${address}`,
      SOL: `https://explorer.solana.com/address/${address}`
    };
    return explorers[currency as keyof typeof explorers] || '#';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      toast.success('Saldo atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar saldo');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendTransaction = async (recipient: string, amount: string) => {
    console.log('🔒 Iniciando transação KMS:', { wallet: wallet.id, recipient, amount });
    
    try {
      // Simular envio via Tatum KMS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Notificar sucesso temporário
      toast.success(`🚧 Transação ${wallet.currency} simulada com sucesso! KMS em desenvolvimento.`);
      
      // TODO: Implementar integração real com Tatum KMS
      throw new Error('🚧 Envio real em desenvolvimento - Aguarde integração KMS completa');
    } catch (error) {
      console.error('Erro na transação KMS:', error);
      throw error;
    }
  };

  // Mock data for demonstration
  const mockTransactionHistory = [
    { type: 'received', amount: 0.0045, date: '2024-01-15', hash: 'abc123...def456' },
    { type: 'sent', amount: 0.0032, date: '2024-01-10', hash: 'xyz789...uvw012' },
    { type: 'received', amount: 0.0078, date: '2024-01-05', hash: 'ghi345...jkl678' }
  ];

  const totalReceived = mockTransactionHistory
    .filter(tx => tx.type === 'received')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalSent = mockTransactionHistory
    .filter(tx => tx.type === 'sent')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentBalance = parseFloat(wallet.balance);
  const securityScore = 98; // Mock security score
  const networkActivity = 75; // Mock network activity percentage

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-card via-card/90 to-dashboard-medium border-l-4 border-l-primary shadow-2xl rounded-xl overflow-hidden animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-dashboard-medium to-dashboard-dark pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCryptoColor(wallet.currency)} flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-xl font-bold">{getCryptoIcon(wallet.currency)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-2xl font-bold text-foreground truncate">{wallet.name}</CardTitle>
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      {wallet.currency}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="text-sm font-medium text-green-500">Ativa</span>
                    <Badge variant="outline" className="text-xs">
                      Tatum KMS
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              {onCollapse && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCollapse}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Address Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Endereço da Carteira:</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
              <span 
                className="font-mono text-sm cursor-pointer flex-1 select-all"
                onClick={() => setShowAddress(!showAddress)}
              >
                {formatAddress(wallet.address)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
              >
                <a 
                  href={getExplorerUrl(wallet.currency, wallet.address)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Balance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold">Saldo Atual</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {showBalance ? `${formatBalance(wallet.balance)} ${wallet.currency}` : '•••••••• ' + wallet.currency}
                </div>
                {showBalance && (
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>≈ $0.00 USD</p>
                    <p>≈ R$ 0,00 BRL</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Estatísticas</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Recebido</span>
                  <span className="font-medium text-green-500">
                    {showBalance ? `${totalReceived.toFixed(8)} ${wallet.currency}` : '••••••••'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Enviado</span>
                  <span className="font-medium text-red-500">
                    {showBalance ? `${totalSent.toFixed(8)} ${wallet.currency}` : '••••••••'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Recebido</p>
                  <p className="text-lg font-bold text-green-500">
                    {showBalance ? `${totalReceived.toFixed(6)}` : '••••••'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Enviado</p>
                  <p className="text-lg font-bold text-red-500">
                    {showBalance ? `${totalSent.toFixed(6)}` : '••••••'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Transações</p>
                  <p className="text-lg font-bold text-blue-500">{mockTransactionHistory.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Network Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold">Segurança KMS</span>
                <Badge variant="outline" className="text-xs">
                  {securityScore}%
                </Badge>
              </div>
              <Progress value={securityScore} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Básica</span>
                <span>Máxima</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">Atividade da Rede</span>
                <Badge variant="outline" className="text-xs">
                  {networkActivity}%
                </Badge>
              </div>
              <Progress value={networkActivity} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Baixa</span>
                <span>Alta</span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Histórico Recente</span>
            </div>
            <div className="space-y-2">
              {mockTransactionHistory.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {tx.type === 'received' ? (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {tx.type === 'received' ? 'Recebido' : 'Enviado'}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${tx.type === 'received' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'received' ? '+' : '-'}{tx.amount.toFixed(8)} {wallet.currency}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowReceiveModal(true)}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Receber
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowSendModal(true)}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/10"
            >
              <a 
                href={getExplorerUrl(wallet.currency, wallet.address)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Explorer
              </a>
            </Button>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-emerald-600">Protegido por Tatum KMS</p>
                <p className="text-xs text-emerald-500">Suas chaves privadas são gerenciadas com segurança máxima</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SendCryptoModalNew
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        wallet={wallet}
        onSend={handleSendTransaction}
      />

      <ReceiveCryptoModalNew
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        wallet={wallet}
      />
    </>
  );
};

export default CryptoWalletCardExpanded;