import React, { useState } from 'react';
import { X, ExternalLink, CreditCard, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BuyCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportedCryptos: Array<{
    symbol: string;
    name: string;
    currentPrice: number;
  }>;
}

const PAYMENT_PROVIDERS = [
  {
    id: 'moonpay',
    name: 'MoonPay',
    description: 'Cartão de crédito/débito',
    fees: '1.5% + spread',
    icon: '🌙',
    minAmount: 50,
    maxAmount: 50000
  },
  {
    id: 'transak',
    name: 'Transak',
    description: 'PIX, cartão e transferência',
    fees: '0.99% + spread',
    icon: '⚡',
    minAmount: 20,
    maxAmount: 100000
  },
  {
    id: 'binance',
    name: 'Binance Connect',
    description: 'P2P e cartão',
    fees: '0.1% + spread',
    icon: '🟡',
    minAmount: 10,
    maxAmount: 200000
  }
];

export const BuyCryptoModal: React.FC<BuyCryptoModalProps> = ({
  isOpen,
  onClose,
  supportedCryptos = []
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [amountBRL, setAmountBRL] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedCryptoData = supportedCryptos.find(c => c.symbol === selectedCrypto);
  const selectedProviderData = PAYMENT_PROVIDERS.find(p => p.id === selectedProvider);
  const amountNumber = parseFloat(amountBRL) || 0;
  const estimatedCrypto = selectedCryptoData ? amountNumber / selectedCryptoData.currentPrice : 0;

  const handleBuy = async () => {
    if (!selectedCrypto || !selectedProvider || !amountNumber) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (selectedProviderData && amountNumber < selectedProviderData.minAmount) {
      toast.error(`Valor mínimo: R$ ${selectedProviderData.minAmount}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to payment provider
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock payment URL
      const paymentUrl = generatePaymentUrl();
      
      // Open payment provider in new tab
      window.open(paymentUrl, '_blank');
      
      toast.success('Redirecionando para pagamento...');
      onClose();
    } catch (error) {
      toast.error('Erro ao processar compra');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePaymentUrl = () => {
    if (!selectedProviderData || !selectedCrypto) return '#';
    
    // Mock URLs for different providers
    const baseUrls: { [key: string]: string } = {
      moonpay: 'https://buy.moonpay.com',
      transak: 'https://global.transak.com',
      binance: 'https://www.binance.com/en/crypto/buy'
    };
    
    const params = new URLSearchParams({
      currencyCode: selectedCrypto,
      baseCurrencyAmount: amountBRL,
      baseCurrencyCode: 'BRL'
    });
    
    return `${baseUrls[selectedProviderData.id]}?${params.toString()}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Comprar Criptomoeda</span>
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
          {/* Crypto Selection */}
          <div className="space-y-2">
            <Label>Criptomoeda</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a criptomoeda" />
              </SelectTrigger>
              <SelectContent>
                {supportedCryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>{crypto.name} ({crypto.symbol})</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(crypto.currentPrice)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Valor em Real (BRL)</Label>
            <div className="relative">
              <Input
                type="number"
                value={amountBRL}
                onChange={(e) => setAmountBRL(e.target.value)}
                placeholder="0,00"
                min="0"
                step="10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-xs text-muted-foreground">BRL</span>
              </div>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[100, 500, 1000, 5000].map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmountBRL(value.toString())}
                  className="flex-1 text-xs"
                >
                  R$ {value}
                </Button>
              ))}
            </div>
          </div>

          {/* Estimated Amount */}
          {selectedCryptoData && amountNumber > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Você receberá aproximadamente:</span>
                <div className="text-right">
                  <div className="font-semibold">
                    {estimatedCrypto.toFixed(6)} {selectedCrypto}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    @ {formatCurrency(selectedCryptoData.currentPrice)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Provider Selection */}
          <div className="space-y-2">
            <Label>Provedor de Pagamento</Label>
            <div className="space-y-2">
              {PAYMENT_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProvider === provider.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{provider.icon}</span>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {provider.name}
                          {provider.id === 'transak' && (
                            <Badge variant="secondary" className="text-xs">PIX</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {provider.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Taxa: {provider.fees}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Min: {formatCurrency(provider.minAmount)}</div>
                      <div>Max: {formatCurrency(provider.maxAmount)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Summary */}
          {selectedProviderData && selectedCryptoData && amountNumber > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Resumo da Compra</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span>{formatCurrency(amountNumber)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa estimada:</span>
                  <span>{selectedProviderData.fees}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provedor:</span>
                  <span>{selectedProviderData.name}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Você recebe ~:</span>
                  <span>{estimatedCrypto.toFixed(6)} {selectedCrypto}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buy Button */}
          <Button
            onClick={handleBuy}
            disabled={!selectedCrypto || !selectedProvider || !amountNumber || isLoading}
            className="w-full"
          >
            {isLoading ? (
              'Processando...'
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Continuar para Pagamento
                <ExternalLink className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            ⚠️ Você será redirecionado para o site do provedor de pagamento. As taxas podem variar conforme cotação em tempo real.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};