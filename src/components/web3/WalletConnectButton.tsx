
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/contexts/web3/Web3Context';
import { Wallet, Unplug, Zap, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const WalletConnectButton: React.FC = () => {
  const { isConnected, address, balance, chainId, connect, disconnect } = useWeb3();

  const handleConnect = () => {
    try {
      connect();
      toast.success('Conectando carteira...');
    } catch (error) {
      toast.error('Erro ao conectar carteira');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Carteira desconectada');
  };

  const getChainName = (id?: number) => {
    switch (id) {
      case 1: return 'Ethereum';
      case 56: return 'BSC';
      case 137: return 'Polygon';
      case 42161: return 'Arbitrum';
      case 43114: return 'Avalanche';
      default: return 'Unknown';
    }
  };

  const formatAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-r from-dashboard-dark to-dashboard-medium border-satotrack-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-satotrack-neon" />
            Conectar Carteira Web3
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Conecte sua carteira para acessar recursos avançados como verificação de saldo em tempo real e assinatura de transações.
            </p>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-green-400" />
                <span>MetaMask</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-blue-400" />
                <span>WalletConnect</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-orange-400" />
                <span>Trust Wallet</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-purple-400" />
                <span>Coinbase</span>
              </div>
            </div>

            <Button onClick={handleConnect} className="w-full">
              <Wallet className="h-4 w-4 mr-2" />
              Conectar Carteira
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-green-900/20 to-dashboard-medium border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-400" />
            Carteira Conectada
          </div>
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
            {getChainName(chainId)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Endereço</span>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            <p className="font-mono text-sm">{formatAddress(address)}</p>
          </div>

          {balance && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-xs text-muted-foreground">Saldo</span>
              <p className="font-bold text-lg text-satotrack-neon">
                {parseFloat(balance).toFixed(4)} ETH
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Verificar Saldo
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDisconnect}
              className="flex-1"
            >
              <Unplug className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnectButton;
