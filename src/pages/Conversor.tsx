import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, TrendingUp, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CURRENCIES = [
  { code: 'BTC', name: 'Bitcoin', icon: '₿', type: 'crypto' },
  { code: 'ETH', name: 'Ethereum', icon: 'Ξ', type: 'crypto' },
  { code: 'USDT', name: 'Tether', icon: '$', type: 'crypto' },
  { code: 'MATIC', name: 'Polygon', icon: '⟠', type: 'crypto' },
  { code: 'BRL', name: 'Real Brasileiro', icon: 'R$', type: 'fiat' },
  { code: 'USD', name: 'Dólar Americano', icon: '$', type: 'fiat' },
  { code: 'EUR', name: 'Euro', icon: '€', type: 'fiat' }
];

const Conversor: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{
    from: string;
    to: string;
    amount: number;
    result: number;
    rate: number;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      calculateConversion();
    }
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('wallet-convert', {
        body: {
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount),
          type: 'quote'
        }
      });

      if (error) throw error;

      const rate = data.exchangeRate;
      const converted = parseFloat(amount) * rate;
      
      setExchangeRate(rate);
      setConvertedAmount(converted.toFixed(8));
    } catch (error) {
      console.error('Erro ao calcular conversão:', error);
      // Fallback para valores mock
      const mockRate = getMockRate(fromCurrency, toCurrency);
      const converted = parseFloat(amount) * mockRate;
      setExchangeRate(mockRate);
      setConvertedAmount(converted.toFixed(8));
    } finally {
      setIsLoading(false);
    }
  };

  const getMockRate = (from: string, to: string): number => {
    const rates: Record<string, Record<string, number>> = {
      BTC: { USD: 43000, BRL: 215000, ETH: 18.5, USDT: 43000, EUR: 40000, MATIC: 50000 },
      ETH: { USD: 2300, BRL: 11500, BTC: 0.054, USDT: 2300, EUR: 2100, MATIC: 2700 },
      USD: { BRL: 5.0, BTC: 0.000023, ETH: 0.00043, USDT: 1.0, EUR: 0.85, MATIC: 1.15 },
      BRL: { USD: 0.2, BTC: 0.0000046, ETH: 0.000087, USDT: 0.2, EUR: 0.17, MATIC: 0.23 },
      USDT: { USD: 1.0, BRL: 5.0, BTC: 0.000023, ETH: 0.00043, EUR: 0.85, MATIC: 1.15 },
      EUR: { USD: 1.18, BRL: 5.9, BTC: 0.000025, ETH: 0.00048, USDT: 1.18, MATIC: 1.35 },
      MATIC: { USD: 0.87, BRL: 4.35, BTC: 0.00002, ETH: 0.00037, USDT: 0.87, EUR: 0.74 }
    };
    
    return rates[from]?.[to] || 1;
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount || '1');
  };

  const executeConversion = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase.functions.invoke('wallet-convert', {
        body: {
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount),
          type: 'execute'
        }
      });

      if (error) throw error;

      // Adicionar ao histórico
      const newConversion = {
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
        result: parseFloat(convertedAmount),
        rate: exchangeRate,
        timestamp: new Date()
      };
      
      setHistory(prev => [newConversion, ...prev.slice(0, 9)]);
      toast.success('Conversão realizada com sucesso!');
    } catch (error) {
      console.error('Erro na conversão:', error);
      toast.error('Erro ao realizar conversão');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Conversor Universal</h1>
        </div>
        <p className="text-muted-foreground">
          Converta entre criptomoedas e moedas tradicionais em tempo real
        </p>
      </div>

      {/* Conversor Principal */}
      <Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          {/* From Currency */}
          <div className="space-y-3">
            <label className="text-sm font-medium">De</label>
            <div className="flex space-x-3">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.icon}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-lg"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={swapCurrencies}
              className="rounded-full h-10 w-10 p-0"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Para</label>
            <div className="flex space-x-3">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.icon}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={convertedAmount}
                readOnly
                className="flex-1 text-lg bg-muted"
              />
            </div>
          </div>

          {/* Taxa de Câmbio */}
          {exchangeRate > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxa de câmbio:</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    1 {fromCurrency} = {exchangeRate.toLocaleString()} {toCurrency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botão de Conversão */}
          <Button 
            onClick={executeConversion}
            disabled={isLoading || !amount || !fromCurrency || !toCurrency}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Convertendo...' : 'Converter Agora'}
          </Button>
        </div>
      </Card>

      {/* Histórico de Conversões */}
      {history.length > 0 && (
        <Card className="max-w-2xl mx-auto p-6">
          <h3 className="text-lg font-semibold mb-4">Histórico de Conversões</h3>
          <div className="space-y-3">
            {history.map((conversion, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {conversion.amount} {conversion.from}
                  </span>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {conversion.result.toFixed(6)} {conversion.to}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {conversion.timestamp.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Conversor;