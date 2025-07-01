
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, X, Send, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeScanner from './QRCodeScanner';

interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: string;
}

interface SendCryptoModalNewProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: CryptoWallet;
  onSend: (recipient: string, amount: string) => Promise<void>;
}

const SendCryptoModalNew: React.FC<SendCryptoModalNewProps> = ({
  isOpen,
  onClose,
  wallet,
  onSend
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleScan = (scannedData: string) => {
    // Extrair endereço do QR code (pode vir como bitcoin:address ou apenas address)
    const address = scannedData.includes(':') ? scannedData.split(':')[1] : scannedData;
    setRecipient(address);
    setShowScanner(false);
    toast.success('Endereço escaneado com sucesso!');
  };

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    if (parseFloat(amount) > parseFloat(wallet.balance)) {
      toast.error('Saldo insuficiente');
      return;
    }

    setIsLoading(true);
    try {
      await onSend(recipient, amount);
      toast.success('🚀 Transação enviada com sucesso!');
      setRecipient('');
      setAmount('');
      onClose();
    } catch (error) {
      toast.error(`Erro ao enviar transação: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(6);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-dark border-dashboard-medium max-w-md">
        <DialogHeader>
          <DialogTitle className="text-satotrack-text flex items-center gap-2">
            <Send className="h-5 w-5 text-satotrack-neon" />
            Enviar {wallet.currency}
          </DialogTitle>
        </DialogHeader>

        {showScanner ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-satotrack-text">
                Escaneie QR Code
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScanner(false)}
                className="text-satotrack-text hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <QRCodeScanner onScan={handleScan} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wallet Info */}
            <div className="p-4 bg-dashboard-medium/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-satotrack-neon/20 flex items-center justify-center text-satotrack-neon text-lg">
                    {getCurrencyIcon(wallet.currency)}
                  </div>
                  <div>
                    <p className="font-medium text-satotrack-text">{wallet.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Saldo: {formatBalance(wallet.balance)} {wallet.currency}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-satotrack-text"
                >
                  {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {showDetails && (
                <div className="mt-3 pt-3 border-t border-dashboard-medium">
                  <p className="text-xs text-muted-foreground break-all">
                    De: {wallet.address}
                  </p>
                </div>
              )}
            </div>

            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-satotrack-text">
                Endereço de Destino
              </Label>
              <div className="flex gap-2">
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={`Endereço ${wallet.currency}...`}
                  className="bg-dashboard-medium border-dashboard-medium text-satotrack-text flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScanner(true)}
                  className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-satotrack-text">
                Valor
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
              <Button
                variant="link"
                size="sm"
                onClick={() => setAmount(wallet.balance)}
                className="text-satotrack-neon hover:text-satotrack-neon/80 p-0 h-auto text-xs"
              >
                Enviar tudo ({formatBalance(wallet.balance)} {wallet.currency})
              </Button>
            </div>

            {/* Transaction Fee Info */}
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-600">
                ⚠️ Taxas de rede serão aplicadas pela blockchain {wallet.currency}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 border-dashboard-medium text-satotrack-text hover:bg-dashboard-medium"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading || !recipient || !amount}
                className="flex-1 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendCryptoModalNew;
