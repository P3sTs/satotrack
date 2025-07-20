import React, { useState } from 'react';
import { X, Copy, QrCode, Send, ArrowDownToLine, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: {
    symbol: string;
    name: string;
    address: string;
    balance: number;
    value: number;
    change: number;
    network: string;
    icon?: string;
  };
}

export const WalletDetailsModal: React.FC<WalletDetailsModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    toast.success('Endereço copiado!');
  };

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleOpenExplorer = () => {
    // Implement blockchain explorer link based on network
    const explorerUrls: Record<string, string> = {
      'Bitcoin': `https://blockstream.info/address/${wallet.address}`,
      'Ethereum': `https://etherscan.io/address/${wallet.address}`,
      'Polygon': `https://polygonscan.com/address/${wallet.address}`,
      'BSC': `https://bscscan.com/address/${wallet.address}`,
    };
    
    const url = explorerUrls[wallet.network];
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {wallet.icon && (
              <img src={wallet.icon} alt={wallet.symbol} className="w-8 h-8 rounded-full" />
            )}
            <div>
              <h3 className="font-semibold text-foreground">{wallet.name}</h3>
              <p className="text-sm text-muted-foreground">{wallet.network}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Balance Section */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-foreground">
              {typeof wallet.balance === 'number' ? wallet.balance.toFixed(8) : parseFloat(wallet.balance || '0').toFixed(8)} {wallet.symbol}
            </div>
            <div className="text-lg text-muted-foreground">
              R$ {wallet.value.toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <div className={cn(
              "flex items-center justify-center gap-1 text-sm",
              wallet.change >= 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {wallet.change >= 0 ? '+' : ''}{wallet.change.toFixed(2)}%
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Endereço da Carteira</h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-foreground break-all">
                  {formatAddress(wallet.address)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className="ml-2"
                >
                  {showFullAddress ? 'Ocultar' : 'Ver'}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenExplorer}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Explorer
                </Button>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">QR Code</h4>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                <QrCode className="w-20 h-20 text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                QR Code para receber {wallet.symbol}
              </p>
            </div>
          </div>

          {/* Network Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Informações da Rede</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rede:</span>
              <Badge variant="outline">{wallet.network}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Símbolo:</span>
              <span className="text-sm font-medium">{wallet.symbol}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
            <Button variant="outline" className="w-full">
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Receber
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};