import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, X, Check, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface WalletInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletData: {
    name: string;
    address: string;
    network: string;
    balance?: string;
    currency?: string;
  };
}

export const WalletInfoModal: React.FC<WalletInfoModalProps> = ({
  isOpen,
  onClose,
  walletData
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletData.address);
      setCopied(true);
      toast.success('Endereço copiado para a área de transferência!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar endereço');
    }
  };

  const getNetworkColor = (network: string) => {
    const colors: { [key: string]: string } = {
      'Bitcoin': 'bg-orange-500',
      'Ethereum': 'bg-gray-700',
      'Solana': 'bg-purple-600',
      'Polygon': 'bg-purple-500',
      'BSC': 'bg-yellow-500'
    };
    return colors[network] || 'bg-primary';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Informações da Carteira</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Name */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {walletData.name}
            </h3>
            <Badge 
              className={`mt-2 text-white ${getNetworkColor(walletData.network)}`}
            >
              {walletData.network}
            </Badge>
          </div>

          {/* QR Code */}
          <div className="flex justify-center bg-white p-4 rounded-lg">
            <QRCodeCanvas
              value={walletData.address}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={true}
            />
          </div>

          {/* Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Endereço da Carteira
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullAddress(!showFullAddress)}
                className="h-6 w-6 p-0"
              >
                {showFullAddress ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="relative">
              <div className="p-3 bg-muted rounded-lg break-all text-sm font-mono">
                {formatAddress(walletData.address)}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="absolute right-2 top-2 h-6 w-6 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Balance Info */}
          {walletData.balance && walletData.currency && (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Saldo Atual</p>
              <p className="text-xl font-bold text-foreground">
                {walletData.balance} {walletData.currency}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={copyToClipboard}
              className="flex-1"
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Endereço
            </Button>
            
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-xs text-muted-foreground text-center bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            ⚠️ Nunca compartilhe sua chave privada. Este QR Code contém apenas seu endereço público.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};