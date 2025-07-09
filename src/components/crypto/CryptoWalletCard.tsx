
import React, { useState } from 'react';
import { TrustWalletCard, CryptoCardContent } from '@/components/ui/trust-wallet-card';
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
import SecureDataGuard from '@/components/security/SecureDataGuard';

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
  const [isExpanded, setIsExpanded] = useState(false);

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

  if (isExpanded) {
    const CryptoWalletCardExpanded = React.lazy(() => import('./CryptoWalletCardExpanded'));
    return (
      <React.Suspense fallback={<div>Carregando...</div>}>
        <CryptoWalletCardExpanded 
          wallet={wallet}
          onSend={onSend}
          onReceive={onReceive}
          onRefresh={onRefresh}
          onCollapse={() => setIsExpanded(false)}
        />
      </React.Suspense>
    );
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setIsExpanded(true)}>
        <TrustWalletCard variant="crypto">
          <CryptoCardContent
            icon={
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getCryptoColor(wallet.currency)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {getCryptoIcon(wallet.currency)}
              </div>
            }
            name={wallet.name}
            symbol={wallet.currency}
            balance={`${formatBalance(wallet.balance)} ${wallet.currency}`}
            balanceUSD="≈ $0.00 USD"
            change={0}
            onClick={() => {}}
          />
        
        {/* Address Section */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Endereço:</p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddress(!showAddress)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                {showAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
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
          
          <SecureDataGuard 
            dataType="endereço da carteira"
            fallbackComponent={
              <div className="p-2 bg-muted/30 rounded-lg text-xs font-mono text-muted-foreground">
                ••••••••••••••••••••••••••••••••
              </div>
            }
          >
            <div className="p-2 bg-muted/30 rounded-lg text-xs font-mono text-muted-foreground break-all">
              {formatAddress(wallet.address)}
            </div>
          </SecureDataGuard>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReceiveModal(true)}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-1" />
              Receber
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSendModal(true)}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Send className="h-4 w-4 mr-1" />
              Enviar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '' : 'Sync'}
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="px-4 pb-4">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-xs text-emerald-400 text-center font-medium">
              🔒 Secured by Tatum KMS
            </p>
          </div>
        </div>
        </TrustWalletCard>
      </div>

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
