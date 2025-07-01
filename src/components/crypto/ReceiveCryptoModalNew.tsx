
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Share, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
}

interface ReceiveCryptoModalNewProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: CryptoWallet;
}

const ReceiveCryptoModalNew: React.FC<ReceiveCryptoModalNewProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [amount, setAmount] = useState('');
  const [showFullAddress, setShowFullAddress] = useState(false);

  const getCurrencyIcon = (currency: string) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      MATIC: '⬟',
      USDT: '₮',
      SOL: '◎'
    };
    return icons[currency as keyof typeof icons] || '●';
  };

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const getQRValue = () => {
    // Criar URI específico da moeda com valor opcional
    let uri = '';
    const addr = wallet.address;
    
    switch (wallet.currency) {
      case 'BTC':
        uri = `bitcoin:${addr}`;
        break;
      case 'ETH':
        uri = `ethereum:${addr}`;
        break;
      case 'MATIC':
        uri = `polygon:${addr}`;
        break;
      default:
        uri = addr;
    }
    
    if (amount && parseFloat(amount) > 0) {
      uri += `?amount=${amount}`;
    }
    
    return uri;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado!`);
    } catch (error) {
      toast.error(`Erro ao copiar ${label}`);
    }
  };

  const shareAddress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Endereço ${wallet.currency}`,
          text: `Meu endereço ${wallet.currency}: ${wallet.address}`,
          url: getQRValue()
        });
      } catch (error) {
        // Fallback to copy
        copyToClipboard(wallet.address, 'Endereço');
      }
    } else {
      copyToClipboard(wallet.address, 'Endereço');
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${wallet.currency}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('QR Code baixado!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-dark border-dashboard-medium max-w-md">
        <DialogHeader>
          <DialogTitle className="text-satotrack-text flex items-center gap-2">
            <Download className="h-5 w-5 text-satotrack-neon" />
            Receber {wallet.currency}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Info */}
          <div className="p-4 bg-dashboard-medium/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-satotrack-neon/20 flex items-center justify-center text-satotrack-neon text-lg">
                {getCurrencyIcon(wallet.currency)}
              </div>
              <div>
                <p className="font-medium text-satotrack-text">{wallet.name}</p>
                <p className="text-sm text-muted-foreground">
                  Rede: {wallet.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Amount (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-satotrack-text">
              Valor Solicitado (Opcional)
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-dashboard-medium border-dashboard-medium text-satotrack-text pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {wallet.currency}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCodeSVG
                id="qr-code-svg"
                value={getQRValue()}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Escaneie este QR code para enviar {wallet.currency}
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-satotrack-text">Endereço</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullAddress(!showFullAddress)}
                className="text-satotrack-text hover:text-white"
              >
                {showFullAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-dashboard-medium/50 rounded-lg">
              <code className="text-xs text-satotrack-text flex-1 break-all">
                {formatAddress(wallet.address)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                className="text-satotrack-neon hover:text-satotrack-neon/80"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Security Warning */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400">
              🔒 Apenas envie {wallet.currency} para este endereço. 
              Outros tipos de moeda serão perdidos permanentemente.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(wallet.address, 'Endereço')}
              className="border-dashboard-medium text-satotrack-text hover:bg-dashboard-medium"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copiar
            </Button>
            
            <Button
              variant="outline"
              onClick={shareAddress}
              className="border-dashboard-medium text-satotrack-text hover:bg-dashboard-medium"
            >
              <Share className="h-4 w-4 mr-1" />
              Compartilhar
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadQR}
              className="border-dashboard-medium text-satotrack-text hover:bg-dashboard-medium"
            >
              <Download className="h-4 w-4 mr-1" />
              Baixar QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveCryptoModalNew;
