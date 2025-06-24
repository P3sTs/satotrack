
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Web3Wallet } from '@/hooks/useWeb3Wallet';
import { 
  Wallet, 
  Send, 
  Download, 
  RefreshCw, 
  Copy,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface WalletCardProps {
  wallet: Web3Wallet;
  onSend: () => void;
  onReceive: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  onSend,
  onReceive,
  onRefresh,
  isLoading
}) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'BTC': return 'bg-orange-500';
      case 'ETH': return 'bg-blue-500';
      case 'MATIC': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNetworkName = (network: string) => {
    switch (network) {
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      case 'MATIC': return 'Polygon';
      default: return network;
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

  const getExplorerUrl = (network: string, address: string) => {
    switch (network) {
      case 'BTC':
        return `https://blockstream.info/address/${address}`;
      case 'ETH':
        return `https://etherscan.io/address/${address}`;
      case 'MATIC':
        return `https://polygonscan.com/address/${address}`;
      default:
        return '#';
    }
  };

  const formatBalance = (balance: string, network: string) => {
    const num = parseFloat(balance || '0');
    if (num === 0) return '0';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(6);
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Network badge */}
      <div className={`absolute top-4 right-4 ${getNetworkColor(wallet.network)} text-white px-2 py-1 rounded text-xs font-medium`}>
        {wallet.network}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-satotrack-neon" />
          <span className="truncate">{wallet.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Balance */}
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Saldo</p>
          <p className="text-2xl font-bold text-satotrack-neon">
            {formatBalance(wallet.balance, wallet.network)} {wallet.network}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Rede: {getNetworkName(wallet.network)}
          </p>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Endereço:</p>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
            <code className="text-xs flex-1 truncate">
              {wallet.address}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => copyToClipboard(wallet.address, 'Endereço')}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              asChild
            >
              <a 
                href={getExplorerUrl(wallet.network, wallet.address)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Private Key (optional) */}
        {wallet.privateKey && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Chave Privada:</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
              <code className="text-xs flex-1 truncate">
                {showPrivateKey ? wallet.privateKey : '•'.repeat(64)}
              </code>
              {showPrivateKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(wallet.privateKey!, 'Chave privada')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-xs text-red-400">
              ⚠️ Nunca compartilhe sua chave privada
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSend}
            disabled={isLoading}
            className="gap-1"
          >
            <Send className="h-3 w-3" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onReceive}
            disabled={isLoading}
            className="gap-1"
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Receber</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
