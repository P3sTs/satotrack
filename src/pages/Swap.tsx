import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Swap: React.FC = () => {
  const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const currencies = [
    { value: 'BTC', label: 'Bitcoin', symbol: '₿' },
    { value: 'ETH', label: 'Ethereum', symbol: 'Ξ' },
    { value: 'USDT', label: 'Tether', symbol: '₮' },
    { value: 'MATIC', label: 'Polygon', symbol: 'MATIC' },
    { value: 'SOL', label: 'Solana', symbol: 'SOL' },
  ];

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const executeSwap = async () => {
    if (!fromAmount || !toAmount) {
      toast.error('Preencha os valores para o swap');
      return;
    }

    setIsSwapping(true);
    try {
      // Simular swap
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Swap de ${fromAmount} ${fromCurrency} para ${toAmount} ${toCurrency} realizado!`);
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      toast.error('Erro ao realizar swap');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-satotrack-text hover:text-white hover:bg-dashboard-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-satotrack-text">Swap de Criptomoedas</h1>
        </div>

        <Card className="max-w-md mx-auto bg-dashboard-dark/80 border-satotrack-neon/20">
          <CardHeader>
            <CardTitle className="text-center text-satotrack-text">Trocar Criptomoedas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-satotrack-text">De</label>
              <div className="flex gap-2">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="rounded-full h-10 w-10 p-0 border-satotrack-neon/50 hover:bg-satotrack-neon/10"
              >
                <ArrowUpDown className="h-4 w-4 text-satotrack-neon" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-satotrack-text">Para</label>
              <div className="flex gap-2">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Execute Swap */}
            <Button
              onClick={executeSwap}
              disabled={isSwapping || !fromAmount || !toAmount}
              className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              {isSwapping ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {isSwapping ? 'Realizando Swap...' : 'Realizar Swap'}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Taxa de rede: 0.1% • Slippage: 1%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Swap;