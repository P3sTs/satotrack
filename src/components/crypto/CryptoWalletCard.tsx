
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CryptoWallet, useCryptoWallets } from '@/hooks/useCryptoWallets';
import { 
  Send, 
  Download, 
  RefreshCw, 
  Copy,
  ExternalLink,
  QrCode,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CryptoWalletCardProps {
  wallet: CryptoWallet;
  onSend: () => void;
  onReceive: () => void;
}

const CryptoWalletCard: React.FC<CryptoWalletCardProps> = ({
  wallet,
  onSend,
  onReceive
}) => {
  const { getBalance, isLoading } = useCryptoWallets();
  const [localBalance, setLocalBalance] = useState(wallet.balance || '0');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const getCurrencyConfig = (networkId: string) => {
    switch (networkId) {
      case 'BTC':
        return { 
          name: 'Bitcoin', 
          color: 'from-orange-500 to-yellow-600',
          icon: '₿',
          explorer: 'https://blockstream.info/address/',
          currency: 'BTC'
        };
      case 'ETH':
        return { 
          name: 'Ethereum', 
          color: 'from-blue-500 to-purple-600',
          icon: 'Ξ',
          explorer: 'https://etherscan.io/address/',
          currency: 'ETH'
        };
      case 'MATIC':
        return { 
          name: 'Polygon', 
          color: 'from-purple-500 to-pink-600',
          icon: '⬟',
          explorer: 'https://polygonscan.com/address/',
          currency: 'MATIC'
        };
      case 'USDT':
        return { 
          name: 'Tether', 
          color: 'from-green-500 to-emerald-600',
          icon: '₮',
          explorer: 'https://etherscan.io/address/',
          currency: 'USDT'
        };
      case 'SOL':
        return { 
          name: 'Solana', 
          color: 'from-purple-600 to-blue-500',
          icon: '◎',
          explorer: 'https://explorer.solana.com/account/',
          currency: 'SOL'
        };
      default:
        return { 
          name: wallet.name, 
          color: 'from-gray-500 to-gray-600',
          icon: '●',
          explorer: '#',
          currency: wallet.network_id
        };
    }
  };

  const config = getCurrencyConfig(wallet.network_id);

  const handleRefresh = async () => {
    if (wallet.address === 'pending_generation') {
      toast.error('Carteira ainda não foi gerada');
      return;
    }

    setIsRefreshing(true);
    try {
      const newBalance = await getBalance(wallet);
      setLocalBalance(newBalance);
      toast.success(`Saldo ${config.currency} atualizado`);
    } catch (error) {
      toast.error('Erro ao atualizar saldo');
    } finally {
      setIsRefreshing(false);
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

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance || '0');
    if (num === 0) return '0.00';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(6);
  };

  const isPending = wallet.address === 'pending_generation';

  // Update local balance when wallet balance changes
  useEffect(() => {
    setLocalBalance(wallet.balance || '0');
  }, [wallet.balance]);

  return (
    <>
      <Card className={`
        relative overflow-hidden group cursor-pointer transform-gpu
        transition-all duration-500 ease-out
        hover:scale-105 hover:shadow-2xl hover:-translate-y-2
        bg-gradient-to-br ${config.color}
        border-0 shadow-lg
        ${isPending ? 'opacity-60' : ''}
      `}>
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500
                        animate-pulse" />

        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-white drop-shadow-lg">
                {config.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white drop-shadow-md">
                  {config.name}
                </h3>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {config.currency}
                </Badge>
              </div>
            </div>
            
            {isPending && (
              <div className="flex items-center gap-2 text-white/80">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Gerando...</span>
              </div>
            )}
          </div>

          {/* Balance */}
          <div className="text-center mb-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white/80 mb-1">Saldo Disponível</p>
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              {formatBalance(localBalance)} {config.currency}
            </p>
          </div>

          {/* Address */}
          {!isPending && (
            <div className="mb-4">
              <p className="text-sm text-white/80 mb-2">Endereço:</p>
              <div className="flex items-center gap-2 p-2 bg-white/10 rounded backdrop-blur-sm">
                <code className="text-xs flex-1 truncate text-white">
                  {wallet.address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  asChild
                >
                  <a 
                    href={`${config.explorer}${wallet.address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={isPending || isRefreshing}
              className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowReceiveModal(true)}
              disabled={isPending}
              className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Receber</span>
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onSend}
              disabled={isPending || parseFloat(localBalance) === 0}
              className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1"
            >
              <Send className="h-3 w-3" />
              <span className="hidden sm:inline">Enviar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Receive Modal */}
      {!isPending && (
        <Dialog open={showReceiveModal} onOpenChange={setShowReceiveModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-satotrack-neon" />
                Receber {config.currency}
              </DialogTitle>
              <DialogDescription>
                Use este endereço ou QR Code para receber {config.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode 
                  value={wallet.address} 
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Endereço da Carteira:</label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="text-sm flex-1 break-all">
                    {wallet.address}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600">
                  ⚠️ Certifique-se de enviar apenas {config.currency} para este endereço.
                  Enviar outras moedas pode resultar em perda permanente.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CryptoWalletCard;
