import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WalletReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet?: {
    id: string;
    name: string;
    address: string;
    currency: string;
  };
}

export const WalletReceiveModal: React.FC<WalletReceiveModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success('Endereço copiado!');
    }
  };

  if (!wallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Receber {wallet.currency}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG 
                value={wallet.address} 
                size={200}
                level="M"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Endereço da carteira
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-3 bg-muted rounded text-sm break-all">
                {wallet.address}
              </code>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCopyAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded">
            <p className="text-xs text-orange-800 dark:text-orange-200">
              ⚠️ Envie apenas {wallet.currency} para este endereço. 
              Outros ativos podem ser perdidos permanentemente.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};