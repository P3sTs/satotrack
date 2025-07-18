
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, AlertTriangle, QrCode } from 'lucide-react';

interface WalletBalance {
  id: string;
  currency: string;
  balance: number;
  address: string;
  usd_value: number;
}

interface WalletSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: WalletBalance[];
}

export const WalletSendModal: React.FC<WalletSendModalProps> = ({
  isOpen,
  onClose,
  wallets
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedWalletData = wallets.find(w => w.id === selectedWallet);

  const handleSend = async () => {
    if (!selectedWallet || !toAddress || !amount || !pin) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (pin.length !== 6) {
      toast.error('PIN deve ter 6 dígitos');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Valor inválido');
      return;
    }

    if (selectedWalletData && amountNumber > selectedWalletData.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('wallet-send', {
        body: {
          wallet_id: selectedWallet,
          to_address: toAddress,
          amount: amount,
          pin: pin
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Transação enviada com sucesso!');
        onClose();
        // Reset form
        setSelectedWallet('');
        setToAddress('');
        setAmount('');
        setPin('');
      } else {
        throw new Error(data?.error || 'Erro ao enviar transação');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      toast.error(error.message || 'Erro ao enviar transação');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: currency === 'BTC' ? 8 : 2,
      maximumFractionDigits: currency === 'BTC' ? 8 : 2,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-dashboard-dark border-dashboard-light/30">
        <DialogHeader>
          <DialogTitle className="text-satotrack-text flex items-center gap-2">
            <Send className="h-5 w-5 text-satotrack-neon" />
            Enviar Criptomoeda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="wallet" className="text-satotrack-text">
              Selecionar Carteira
            </Label>
            <Select value={selectedWallet} onValueChange={setSelectedWallet}>
              <SelectTrigger className="bg-dashboard-medium border-dashboard-light/30">
                <SelectValue placeholder="Escolha uma carteira" />
              </SelectTrigger>
              <SelectContent className="bg-dashboard-medium border-dashboard-light/30">
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-satotrack-text">
                        {wallet.currency}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatCurrency(wallet.balance, wallet.currency)} {wallet.currency}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWalletData && (
              <p className="text-xs text-muted-foreground mt-1">
                Saldo disponível: {formatCurrency(selectedWalletData.balance, selectedWalletData.currency)} {selectedWalletData.currency}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="toAddress" className="text-satotrack-text">
              Endereço de Destino
            </Label>
            <div className="flex gap-2">
              <Input
                id="toAddress"
                placeholder="Digite o endereço ou escaneie QR Code"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text"
              />
              <Button
                variant="outline"
                size="sm"
                className="border-dashboard-light/30 hover:bg-dashboard-light/10"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="amount" className="text-satotrack-text">
              Valor
            </Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text"
              />
              {selectedWalletData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(selectedWalletData.balance.toString())}
                  className="border-dashboard-light/30 hover:bg-dashboard-light/10 whitespace-nowrap"
                >
                  Máximo
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="pin" className="text-satotrack-text">
              PIN de Segurança
            </Label>
            <Input
              id="pin"
              type="password"
              placeholder="••••••"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="bg-dashboard-medium border-dashboard-light/30 text-satotrack-text"
            />
          </div>

          {amount && selectedWalletData && (
            <div className="p-3 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/20">
              <h4 className="text-sm font-semibold text-satotrack-text mb-2">
                Resumo da Transação
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="text-satotrack-text">
                    {amount} {selectedWalletData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa estimada:</span>
                  <span className="text-satotrack-text">
                    {(parseFloat(amount) * 0.001).toFixed(8)} {selectedWalletData.currency}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="text-satotrack-text">
                    {(parseFloat(amount) + parseFloat(amount) * 0.001).toFixed(8)} {selectedWalletData.currency}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-200">
              <strong>Atenção:</strong> Verifique cuidadosamente o endereço de destino. 
              Transações em blockchain são irreversíveis.
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-dashboard-light/30 hover:bg-dashboard-light/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || !selectedWallet || !toAddress || !amount || !pin}
              className="flex-1 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              {isLoading ? 'Enviando...' : 'Confirmar Envio'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
