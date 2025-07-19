import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, Bitcoin, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: {
    id: string;
    name: string;
    currency: string;
    balance: number;
  };
}

export const WalletBuyModal: React.FC<WalletBuyModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [amount, setAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const cryptoPrice = 45000; // Mock BTC price
  const fee = 0.5; // 0.5% fee

  const handleAmountChange = (value: string, type: 'crypto' | 'fiat') => {
    if (type === 'crypto') {
      setAmount(value);
      const fiat = (parseFloat(value) || 0) * cryptoPrice;
      setFiatAmount(fiat.toFixed(2));
    } else {
      setFiatAmount(value);
      const crypto = (parseFloat(value) || 0) / cryptoPrice;
      setAmount(crypto.toFixed(8));
    }
  };

  const totalFiatAmount = parseFloat(fiatAmount || '0') + (parseFloat(fiatAmount || '0') * fee / 100);

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Valor Inválido",
        description: "Digite um valor válido para comprar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Compra Realizada",
        description: `${amount} ${wallet.currency} adicionado à sua carteira`,
        variant: "default"
      });

      setAmount('');
      setFiatAmount('');
      onClose();
    } catch (error) {
      toast({
        title: "Erro na Compra",
        description: "Falha ao processar a compra. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Comprar {wallet.currency}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Price */}
          <Card className="p-4 bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bitcoin className="w-5 h-5 text-orange-500" />
                <span className="font-medium">{wallet.currency}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${cryptoPrice.toLocaleString()}</div>
                <div className="text-sm text-green-600">+2.5% 24h</div>
              </div>
            </div>
          </Card>

          {/* Amount Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cryptoAmount">Quantidade {wallet.currency}</Label>
                <Input
                  id="cryptoAmount"
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value, 'crypto')}
                  placeholder="0.00000000"
                  step="0.00000001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiatAmount">Valor em USD</Label>
                <Input
                  id="fiatAmount"
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => handleAmountChange(e.target.value, 'fiat')}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            {/* Quick amounts */}
            <div className="flex space-x-2">
              {[100, 500, 1000, 5000].map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAmountChange(value.toString(), 'fiat')}
                  className="flex-1"
                >
                  ${value}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">
                <CreditCard className="w-4 h-4 mr-2" />
                Cartão
              </TabsTrigger>
              <TabsTrigger value="pix">
                <DollarSign className="w-4 h-4 mr-2" />
                PIX
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Compra instantânea com cartão de crédito/débito
              </div>
            </TabsContent>

            <TabsContent value="pix" className="space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Transferência via PIX (processamento em até 10 minutos)
              </div>
            </TabsContent>
          </Tabs>

          {/* Summary */}
          {amount && fiatAmount && (
            <Card className="p-4 space-y-3">
              <h4 className="font-medium">Resumo da Compra</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Quantidade</span>
                  <span>{amount} {wallet.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor</span>
                  <span>${fiatAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa ({fee}%)</span>
                  <span>${(parseFloat(fiatAmount) * fee / 100).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalFiatAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleBuy}
              className="flex-1"
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            >
              {isProcessing ? "Processando..." : `Comprar ${wallet.currency}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};