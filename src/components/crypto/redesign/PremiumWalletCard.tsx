import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Download, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { MultiChainWallet } from '@/hooks/useMultiChainWallets';
import SendCryptoModalNew from '../SendCryptoModalNew';
import ReceiveCryptoModalNew from '../ReceiveCryptoModalNew';

interface PremiumWalletCardProps {
  wallet: MultiChainWallet;
  selectedCurrency: 'USD' | 'BRL' | 'BTC';
  onRefresh: () => void;
}

export const PremiumWalletCard: React.FC<PremiumWalletCardProps> = ({
  wallet,
  selectedCurrency,
  onRefresh
}) => {
  const [showAddress, setShowAddress] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const getCryptoIcon = (currency: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      MATIC: '⬟',
      USDT: '₮',
      SOL: '◎',
      AVAX: '🔺',
      BSC: '💎'
    };
    return icons[currency as keyof typeof icons] || '●';
  };

  const getCryptoGradient = (currency: string) => {
    const gradients = {
      BTC: 'from-orange-500 to-yellow-500',
      ETH: 'from-blue-500 to-purple-500',
      MATIC: 'from-purple-500 to-pink-500',
      USDT: 'from-green-500 to-teal-500',
      SOL: 'from-purple-600 to-blue-600',
      AVAX: 'from-red-500 to-pink-500',
      BSC: 'from-yellow-500 to-orange-500'
    };
    return gradients[currency as keyof typeof gradients] || 'from-gray-500 to-gray-600';
  };

  const formatBalance = (balance: string, currency: string, displayCurrency: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0.00';
    
    switch (displayCurrency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(num * 50000); // Mock conversion
      case 'BRL':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(num * 280000); // Mock conversion
      case 'BTC':
        if (currency === 'BTC') return `${num.toFixed(8)} BTC`;
        return `${(num * 0.000001).toFixed(8)} BTC`; // Mock conversion
      default:
        return `${num.toFixed(6)} ${currency}`;
    }
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
      await onRefresh();
      toast.success('Saldo atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar saldo');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendTransaction = async (recipient: string, amount: string) => {
    // Simulated KMS transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`🚧 Transação ${wallet.currency} simulada via SatoTracker KMS!`);
    throw new Error('🚧 Envio real em desenvolvimento - Aguarde integração completa');
  };

  return (
    <>
      <Card className="group relative overflow-hidden bg-gradient-to-br from-dashboard-medium via-dashboard-dark to-dashboard-medium border border-dashboard-light/30 hover:border-satotrack-neon/50 transition-all duration-500 hover:shadow-2xl hover:shadow-satotrack-neon/20 rounded-2xl">
        {/* Crypto Icon Background */}
        <div className="absolute -top-8 -right-8 opacity-5">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getCryptoGradient(wallet.currency)} flex items-center justify-center text-6xl`}>
            {getCryptoIcon(wallet.currency)}
          </div>
        </div>

        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCryptoGradient(wallet.currency)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {getCryptoIcon(wallet.currency)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{wallet.name}</h3>
                <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon text-xs">
                  {wallet.currency}
                </Badge>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-white mb-1">
              {formatBalance(wallet.balance, wallet.currency, selectedCurrency)}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedCurrency !== wallet.currency && (
                <>≈ {formatBalance(wallet.balance, wallet.currency, wallet.currency)}</>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Endereço:</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddress(!showAddress)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
                >
                  {showAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
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
            <div className="p-3 bg-dashboard-dark/50 rounded-lg text-xs font-mono text-muted-foreground break-all border border-dashboard-light/20">
              {formatAddress(wallet.address)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReceiveModal(true)}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
            >
              <Download className="h-4 w-4 mr-1" />
              Receber
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSendModal(true)}
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl"
            >
              <Send className="h-4 w-4 mr-1" />
              Enviar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-xl"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 p-3 bg-satotrack-neon/10 border border-satotrack-neon/20 rounded-xl">
            <Shield className="h-4 w-4 text-satotrack-neon" />
            <span className="text-xs text-satotrack-neon font-medium">
              Protegido por SatoTracker KMS
            </span>
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