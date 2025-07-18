import React, { useState, useEffect } from 'react';
import { ArrowUpDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WalletConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Array<{
    id: string;
    name: string;
    currency: string;
    balance: number;
  }>;
}

const SUPPORTED_CURRENCIES = [
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
  { code: 'USDT', name: 'Tether', symbol: '$' },
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$' }
];

export const WalletConverterModal: React.FC<WalletConverterModalProps> = ({
  isOpen,
  onClose,
  wallets
}) => {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      calculateConversion();
    }
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = async () => {
    try {
      setIsLoading(true);
      
      // Simular cálculo de conversão (em produção, chamaria Edge Function)
      const rate = await getExchangeRate(fromCurrency, toCurrency);
      const converted = parseFloat(amount) * rate;
      
      setExchangeRate(rate);
      setConvertedAmount(converted.toFixed(8));
    } catch (error) {
      console.error('Erro ao calcular conversão:', error);
      toast.error('Erro ao calcular conversão');
    } finally {
      setIsLoading(false);
    }
  };

  const getExchangeRate = async (from: string, to: string): Promise<number> => {
    // Mock de taxas de câmbio (em produção, usar API real)
    const mockRates: Record<string, Record<string, number>> = {
      BTC: { USD: 43000, BRL: 215000, ETH: 18.5, USDT: 43000 },
      ETH: { USD: 2300, BRL: 11500, BTC: 0.054, USDT: 2300 },
      USD: { BRL: 5.0, BTC: 0.000023, ETH: 0.00043, USDT: 1.0 },
      BRL: { USD: 0.2, BTC: 0.0000046, ETH: 0.000087, USDT: 0.2 },
      USDT: { USD: 1.0, BRL: 5.0, BTC: 0.000023, ETH: 0.00043 }
    };

    return mockRates[from]?.[to] || 1;
  };

  const handleConvert = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      
      // Chamar Edge Function para conversão real
      const { error } = await supabase.functions.invoke('wallet-convert', {
        body: {
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount)
        }
      });

      if (error) throw error;

      toast.success('Conversão realizada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast.error('Erro ao realizar conversão');
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Converter Moeda
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">De</label>
            <div className="flex space-x-2">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Moeda" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={swapCurrencies}
              className="rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Para</label>
            <div className="flex space-x-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Moeda" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={convertedAmount}
                readOnly
                className="flex-1 bg-muted"
              />
            </div>
          </div>

          {/* Exchange Rate */}
          {exchangeRate > 0 && (
            <div className="p-3 bg-muted rounded text-sm">
              <p>Taxa: 1 {fromCurrency} = {exchangeRate.toLocaleString()} {toCurrency}</p>
            </div>
          )}

          {/* Convert Button */}
          <Button 
            onClick={handleConvert} 
            disabled={isLoading || !amount || !fromCurrency || !toCurrency}
            className="w-full"
          >
            {isLoading ? 'Convertendo...' : 'Converter'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};