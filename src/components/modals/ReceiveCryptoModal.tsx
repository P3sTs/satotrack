import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, X, Check, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ReceiveCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Array<{
    id: string;
    name: string;
    currency: string;
    address: string;
    network: string;
  }>;
}

export const ReceiveCryptoModal: React.FC<ReceiveCryptoModalProps> = ({
  isOpen,
  onClose,
  wallets
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedWalletData = wallets.find(w => w.id === selectedWallet);

  const generatePaymentURI = () => {
    if (!selectedWalletData) return '';
    
    let uri = '';
    const address = selectedWalletData.address;
    const currency = selectedWalletData.currency.toLowerCase();
    
    // Generate payment URI based on cryptocurrency
    switch (currency) {
      case 'btc':
      case 'bitcoin':
        uri = `bitcoin:${address}`;
        break;
      case 'eth':
      case 'ethereum':
        uri = `ethereum:${address}`;
        break;
      case 'sol':
      case 'solana':
        uri = `solana:${address}`;
        break;
      default:
        uri = address;
    }
    
    // Add amount and memo if provided
    const params = new URLSearchParams();
    if (amount) params.append('amount', amount);
    if (memo) params.append('message', memo);
    
    if (params.toString()) {
      uri += `?${params.toString()}`;
    }
    
    return uri;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copiado para a área de transferência!`);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(`Erro ao copiar ${label.toLowerCase()}`);
    }
  };

  const sharePayment = async () => {
    if (!selectedWalletData) return;
    
    const shareData = {
      title: `Receber ${selectedWalletData.currency}`,
      text: `Envie ${selectedWalletData.currency} para: ${selectedWalletData.address}`,
      url: generatePaymentURI()
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard(selectedWalletData.address, 'Endereço');
      }
    } catch (err) {
      console.error('Error sharing:', err);
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
            <span>Receber Criptomoeda</span>
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

        <div className="space-y-4">
          {/* Wallet Selection */}
          <div className="space-y-2">
            <Label>Selecione a Carteira</Label>
            <Select value={selectedWallet} onValueChange={setSelectedWallet}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha qual carteira usar" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-white ${getNetworkColor(wallet.network)}`}
                      >
                        {wallet.currency}
                      </Badge>
                      <span>{wallet.name}</span>
                      <span className="text-muted-foreground">({wallet.network})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedWalletData && (
            <>
              {/* Amount (Optional) */}
              <div className="space-y-2">
                <Label>Valor Específico (Opcional)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Digite o valor a receber"
                    step="0.000001"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-muted-foreground">
                      {selectedWalletData.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Memo (Optional) */}
              <div className="space-y-2">
                <Label>Nota (Opcional)</Label>
                <Input
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Adicione uma descrição do pagamento"
                  maxLength={100}
                />
              </div>

              {/* QR Code */}
              <div className="text-center space-y-4">
                <div className="flex justify-center bg-white p-4 rounded-lg">
                  <QRCodeCanvas
                    value={generatePaymentURI()}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-2">
                  <Badge 
                    className={`text-white ${getNetworkColor(selectedWalletData.network)}`}
                  >
                    {selectedWalletData.network} Network
                  </Badge>
                  
                  <p className="text-xs text-muted-foreground">
                    Escaneie o QR Code ou copie o endereço abaixo
                  </p>
                </div>
              </div>

              {/* Address Display */}
              <div className="space-y-2">
                <Label>Endereço da Carteira</Label>
                <div className="relative">
                  <div className="p-3 bg-muted rounded-lg break-all text-sm font-mono">
                    {selectedWalletData.address}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(selectedWalletData.address, 'Endereço')}
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

              {/* Payment Summary */}
              {(amount || memo) && (
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <p className="text-sm font-medium">Resumo do Pagamento:</p>
                  {amount && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Valor:</span> {amount} {selectedWalletData.currency}
                    </p>
                  )}
                  {memo && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Nota:</span> {memo}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(selectedWalletData.address, 'Endereço')}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                
                <Button
                  onClick={sharePayment}
                  variant="outline"
                  className="flex-1"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* Security Warning */}
              <div className="text-xs text-muted-foreground text-center bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                💡 Certifique-se de que está recebendo na rede correta ({selectedWalletData.network})
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};