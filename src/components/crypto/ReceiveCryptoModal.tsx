
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Copy, QrCode, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
}

interface ReceiveCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: CryptoWallet;
}

const ReceiveCryptoModal: React.FC<ReceiveCryptoModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      toast.success('Endereço copiado para a área de transferência!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar endereço');
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Receber {wallet.currency}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Info */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Carteira:</span>
              <span className="font-medium">{wallet.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Saldo atual:</span>
              <span className="font-medium">{wallet.balance} {wallet.currency}</span>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
            <QrCode className="h-24 w-24 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              QR Code será implementado em breve
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Seu endereço {wallet.currency}</Label>
            <div className="flex gap-2">
              <Input
                value={wallet.address}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Compartilhe este endereço para receber {wallet.currency}
            </p>
          </div>

          {/* Instructions */}
          <Alert className="border-blue-500/30 bg-blue-500/10">
            <Download className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-600">
              <strong>Como receber {wallet.currency}:</strong>
              <ol className="mt-2 list-decimal list-inside space-y-1">
                <li>Copie o endereço acima</li>
                <li>Compartilhe com quem vai enviar</li>
                <li>Aguarde a confirmação na rede</li>
                <li>O saldo será atualizado automaticamente</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Warning */}
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertDescription className="text-yellow-600">
              <strong>Importante:</strong> Envie apenas {wallet.currency} para este endereço. 
              Outros tokens podem ser perdidos permanentemente.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
            <Button onClick={handleCopyAddress} className="flex-1">
              {copied ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copiado!' : 'Copiar Endereço'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveCryptoModal;
