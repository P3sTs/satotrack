
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Download, RefreshCw, Eye, EyeOff, Clock } from 'lucide-react';
import SendCryptoModal from './SendCryptoModal';
import ReceiveCryptoModal from './ReceiveCryptoModal';
import { toast } from 'sonner';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
  created_at?: string;
}

interface CryptoWalletCardProps {
  wallet: CryptoWallet;
  onSend?: () => void;
  onReceive?: () => void;
}

const CryptoWalletCard: React.FC<CryptoWalletCardProps> = ({
  wallet,
  onSend,
  onReceive
}) => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatAddress = (address: string) => {
    if (showFullAddress || address.length <= 20) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const getCurrencyColor = (currency: string) => {
    const colors = {
      BTC: 'bg-orange-500',
      ETH: 'bg-blue-500',
      MATIC: 'bg-purple-500',
      USDT: 'bg-green-500',
      SOL: 'bg-gradient-to-r from-purple-400 to-pink-400'
    };
    return colors[currency] || 'bg-gray-500';
  };

  const getCurrencyIcon = (currency: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      MATIC: '◆',
      USDT: '₮',
      SOL: '◎'
    };
    return icons[currency] || '●';
  };

  const handleSend = async (recipient: string, amount: string, memo?: string) => {
    // Implementação futura - por enquanto apenas mostra toast
    toast.info(`Funcionalidade de envio será implementada em breve`);
    throw new Error('Funcionalidade em desenvolvimento');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Implementação futura - refresh do saldo
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
      toast.success('Saldo atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar saldo');
    } finally {
      setIsRefreshing(false);
    }
  };

  const isPending = wallet.address === 'pending_generation';

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${getCurrencyColor(wallet.currency)} flex items-center justify-center text-white font-bold`}>
                {getCurrencyIcon(wallet.currency)}
              </div>
              <div>
                <CardTitle className="text-lg">{wallet.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {wallet.currency}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isPending}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isPending ? (
            <div className="text-center py-4">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">Gerando endereço...</p>
              <p className="text-xs text-muted-foreground/70">Via Tatum API</p>
            </div>
          ) : (
            <>
              {/* Balance */}
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {wallet.balance || '0'} {wallet.currency}
                </p>
                <p className="text-sm text-muted-foreground">
                  ≈ $0.00 USD
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Endereço:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullAddress(!showFullAddress)}
                    className="h-6 w-6 p-0"
                  >
                    {showFullAddress ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-xs font-mono bg-muted/30 p-2 rounded break-all">
                  {formatAddress(wallet.address)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowSendModal(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowReceiveModal(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Receber
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <SendCryptoModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        wallet={wallet}
        onSend={handleSend}
      />

      <ReceiveCryptoModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        wallet={wallet}
      />
    </>
  );
};

export default CryptoWalletCard;
