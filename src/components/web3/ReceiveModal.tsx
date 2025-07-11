
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Web3Wallet } from '@/hooks/useWeb3Wallet';
import { 
  Download, 
  Copy, 
  Share, 
  QrCode,
  ExternalLink,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Web3Wallet;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
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
          title: `Meu endereço ${wallet.network}`,
          text: `Envie ${wallet.network} para este endereço:`,
          url: wallet.address
        });
      } catch (error) {
        copyToClipboard(wallet.address, 'Endereço');
      }
    } else {
      copyToClipboard(wallet.address, 'Endereço');
    }
  };

  const getExplorerUrl = (network: string, address: string) => {
    switch (network) {
      case 'BTC':
        return `https://blockstream.info/address/${address}`;
      case 'ETH':
        return `https://etherscan.io/address/${address}`;
      case 'MATIC':
        return `https://polygonscan.com/address/${address}`;
      default:
        return '#';
    }
  };

  const getNetworkName = (network: string) => {
    switch (network) {
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      case 'MATIC': return 'Polygon (MATIC)';
      default: return network;
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'BTC': return 'bg-orange-500';
      case 'ETH': return 'bg-blue-500';
      case 'MATIC': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-satotrack-neon" />
            Receber {wallet.network}
          </DialogTitle>
          <DialogDescription>
            Use este endereço para receber {getNetworkName(wallet.network)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Saldo atual: {wallet.balance} {wallet.network}
                  </p>
                </div>
                <Badge className={getNetworkColor(wallet.network)}>
                  {wallet.network}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeCanvas
                value={wallet.address}
                size={200}
                level="M"
                includeMargin
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Escaneie este QR Code para obter o endereço
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço da Carteira:</label>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all">
                    {wallet.address}
                  </code>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wallet.address, 'Endereço')}
                    className="flex-1 gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareAddress}
                    className="flex-1 gap-2"
                  >
                    <Share className="h-4 w-4" />
                    Compartilhar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2"
                  >
                    <a 
                      href={getExplorerUrl(wallet.network, wallet.address)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Explorer
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notes */}
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-500 font-medium">Importante:</p>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>• Envie apenas {getNetworkName(wallet.network)} para este endereço</li>
                    <li>• Transações podem levar alguns minutos para confirmar</li>
                    <li>• Sempre verifique o endereço antes de enviar</li>
                    <li>• Guarde este endereço em local seguro</li>
                  </ul>
                </div>
              </div>
            </div>

            {wallet.network !== 'BTC' && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-yellow-500 font-medium">Atenção - Tokens ERC-20/BEP-20:</p>
                    <p className="text-muted-foreground mt-1">
                      Este endereço também pode receber tokens da rede {getNetworkName(wallet.network)} 
                      (USDT, USDC, etc.)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveModal;
