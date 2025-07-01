
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Send, 
  Download, 
  Copy, 
  QrCode, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ExternalLink 
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

interface CryptoWalletCardProps {
  wallet: CryptoWallet;
  onSend?: () => void;
  onReceive?: () => void;
  onRefresh?: () => void;
}

const CryptoWalletCard: React.FC<CryptoWalletCardProps> = ({ 
  wallet, 
  onSend, 
  onReceive,
  onRefresh 
}) => {
  const [showAddress, setShowAddress] = useState(false);
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
    if (num === 0) return '0.00';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(6);
  };

  const formatAddress = (address: string) => {
    if (showAddress) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
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
    // Aqui você implementaria a lógica de envio via Tatum KMS
    console.log('Enviando transação:', { wallet: wallet.id, recipient, amount });
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Em produção, você chamaria o serviço KMS aqui
    throw new Error('Funcionalidade em desenvolvimento - Tatum KMS');
  };

  return (
    <>
      <Card className="bg-dashboard-dark border-dashboard-medium hover:border-satotrack-neon/30 transition-all duration-300 overflow-hidden">
        {/* Header com gradiente */}
        <CardHeader className={`bg-gradient-to-r ${getCryptoColor(wallet.currency)} p-0`}>
          <div className="p-4 bg-black/20">
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                  {getCryptoIcon(wallet.currency)}
                </div>
                <div>
                  <h3 className="font-semibold">{wallet.name}</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                    {wallet.currency}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Balance */}
          <div className="text-center py-4 bg-dashboard-medium/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Saldo Disponível</p>
            <p className="text-2xl font-bold text-satotrack-neon">
              {formatBalance(wallet.balance)}
            </p>
            <p className="text-sm text-muted-foreground">{wallet.currency}</p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Endereço:</p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddress(!showAddress)}
                  className="h-6 w-6 p-0 text-satotrack-text hover:text-white"
                >
                  {showAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                  className="h-6 w-6 p-0 text-satotrack-text hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-6 w-6 p-0 text-satotrack-text hover:text-white"
                >
                  <a 
                    href={getExplorerUrl(wallet.currency, wallet.address)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="p-2 bg-dashboard-medium/50 rounded text-xs font-mono text-satotrack-text break-all">
              {formatAddress(wallet.address)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReceiveModal(true)}
              className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              <Download className="h-4 w-4 mr-1" />
              Receber
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSendModal(true)}
              className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              <Send className="h-4 w-4 mr-1" />
              Enviar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReceiveModal(true)}
              className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
            >
              <QrCode className="h-4 w-4 mr-1" />
              QR
            </Button>
          </div>

          {/* Security Notice */}
          <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-xs text-green-400 text-center">
              🔒 Protegido pelo Tatum KMS - Máxima Segurança
            </p>
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

export default CryptoWalletCard;
