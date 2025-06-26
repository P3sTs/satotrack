
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Download, 
  Copy, 
  QrCode, 
  Eye, 
  EyeOff,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  xpub?: string;
}

interface CryptoWalletCardProps {
  wallet: CryptoWallet;
  onSend: () => void;
  onReceive: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const CryptoWalletCard: React.FC<CryptoWalletCardProps> = ({
  wallet,
  onSend,
  onReceive,
  onRefresh,
  isLoading = false
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  const getCurrencyColor = (currency: string) => {
    const colors = {
      'BTC': 'text-orange-500 border-orange-500/20 bg-orange-500/10',
      'ETH': 'text-blue-500 border-blue-500/20 bg-blue-500/10',
      'MATIC': 'text-purple-500 border-purple-500/20 bg-purple-500/10',
      'USDT': 'text-green-500 border-green-500/20 bg-green-500/10',
      'SOL': 'text-cyan-500 border-cyan-500/20 bg-cyan-500/10',
    };
    return colors[currency] || 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  };

  const getCurrencyIcon = (currency: string) => {
    return currency.charAt(0);
  };

  const formatAddress = (address: string, show: boolean) => {
    if (show || address.length <= 16) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    toast.success('Endereço copiado!');
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance || '0');
    if (num === 0) return '0.00000000';
    return num.toFixed(8);
  };

  return (
    <Card className="bg-dashboard-dark border-satotrack-neon/20 hover:border-satotrack-neon/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold ${getCurrencyColor(wallet.currency)}`}>
              {getCurrencyIcon(wallet.currency)}
            </div>
            <div>
              <CardTitle className="text-lg text-satotrack-text">{wallet.name}</CardTitle>
              <Badge variant="outline" className={`text-xs ${getCurrencyColor(wallet.currency)}`}>
                {wallet.currency}
              </Badge>
            </div>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Saldo */}
        <div className="text-center p-4 bg-dashboard-medium/30 rounded-lg">
          <p className="text-sm text-muted-foreground">Saldo</p>
          <p className="text-2xl font-bold text-satotrack-neon">
            {formatBalance(wallet.balance)} {wallet.currency}
          </p>
        </div>

        {/* Endereço */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Endereço</p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullAddress(!showFullAddress)}
                className="h-6 w-6 p-0"
              >
                {showFullAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="p-2 bg-dashboard-medium/20 rounded text-xs font-mono break-all">
            {formatAddress(wallet.address, showFullAddress)}
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onReceive}
            variant="outline"
            className="gap-2 border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
          >
            <Download className="h-4 w-4" />
            Receber
          </Button>
          <Button
            onClick={onSend}
            className="gap-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            <Send className="h-4 w-4" />
            Enviar
          </Button>
        </div>

        {/* QR Code Button */}
        <Button
          variant="ghost"
          onClick={() => toast.info('QR Code será implementado em breve')}
          className="w-full gap-2 text-muted-foreground hover:text-satotrack-neon"
        >
          <QrCode className="h-4 w-4" />
          Mostrar QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default CryptoWalletCard;
