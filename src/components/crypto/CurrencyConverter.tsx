import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeftRight, 
  RefreshCw, 
  TrendingUp, 
  Star,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';
import anime from 'animejs/lib/anime.es.js';

const CurrencyConverter: React.FC = () => {
  const {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    exchangeRate,
    isLoading,
    lastUpdate,
    setFromCurrency,
    setToCurrency,
    setFromAmount,
    setToAmount,
    swapCurrencies,
    updateExchangeRate,
    reverseMode,
    setReverseMode
  } = useCurrencyConverter();

  const cryptoCurrencies = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'from-orange-500 to-yellow-500' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'from-blue-500 to-purple-500' },
    { symbol: 'USDT', name: 'Tether', icon: '₮', color: 'from-green-500 to-emerald-500' },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬟', color: 'from-purple-500 to-pink-500' },
    { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'from-purple-600 to-blue-600' },
    { symbol: 'ADA', name: 'Cardano', icon: '₳', color: 'from-blue-600 to-cyan-500' },
    { symbol: 'DOT', name: 'Polkadot', icon: '●', color: 'from-pink-500 to-red-500' }
  ];

  const fiatCurrencies = [
    { symbol: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
    { symbol: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
    { symbol: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { symbol: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
    { symbol: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
    { symbol: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦' }
  ];

  const allCurrencies = [...cryptoCurrencies, ...fiatCurrencies];

  const getCurrencyDisplay = (symbol: string) => {
    const crypto = cryptoCurrencies.find(c => c.symbol === symbol);
    const fiat = fiatCurrencies.find(c => c.symbol === symbol);
    
    if (crypto) {
      return (
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${crypto.color} flex items-center justify-center text-white text-xs font-bold`}>
            {crypto.icon}
          </div>
          <span>{crypto.symbol}</span>
        </div>
      );
    }
    
    if (fiat) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">{fiat.flag}</span>
          <span>{fiat.symbol}</span>
        </div>
      );
    }
    
    return symbol;
  };

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(num);
  };

  const handleSwap = () => {
    // Animação de rotação
    anime({
      targets: '.swap-button',
      rotate: '180deg',
      duration: 300,
      easing: 'easeInOutQuad',
      complete: () => {
        swapCurrencies();
        toast.success('Moedas trocadas!');
      }
    });
  };

  const handleRefresh = () => {
    // Animação de loading
    anime({
      targets: '.refresh-button',
      rotate: '360deg',
      duration: 500,
      easing: 'easeOutQuart'
    });
    
    updateExchangeRate();
    toast.success('Taxa de câmbio atualizada!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
              <ArrowLeftRight className="h-5 w-5 text-black" />
            </div>
            Conversor de Moedas
          </h2>
          <p className="text-muted-foreground">
            Converta criptomoedas e moedas fiduciárias em tempo real
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
            <Activity className="h-3 w-3 mr-1" />
            Tempo Real
          </Badge>
          <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
            Tatum API
          </Badge>
        </div>
      </div>

      {/* Conversor Principal */}
      <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>Conversão</span>
            <div className="flex items-center gap-2">
              {lastUpdate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(lastUpdate).toLocaleTimeString('pt-BR')}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="refresh-button border-primary/30 text-primary hover:bg-primary/10"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Seção De */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">De</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="bg-dashboard-dark/50 border-dashboard-light/30">
                  <SelectValue placeholder="Selecione a moeda">
                    {fromCurrency && getCurrencyDisplay(fromCurrency)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-dashboard-medium border-dashboard-light/30">
                  {allCurrencies.map((currency) => (
                    <SelectItem 
                      key={currency.symbol} 
                      value={currency.symbol}
                      className="text-white hover:bg-dashboard-light/30"
                    >
                      <div className="flex items-center justify-between w-full">
                        {getCurrencyDisplay(currency.symbol)}
                        <span className="text-xs text-muted-foreground ml-2">
                          {currency.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="0.00"
                value={reverseMode ? '' : fromAmount}
                onChange={(e) => {
                  setReverseMode(false);
                  setFromAmount(e.target.value);
                }}
                className="bg-dashboard-dark/50 border-dashboard-light/30 text-white text-lg font-semibold text-right"
                step="any"
                min="0"
              />
            </div>
          </div>

          {/* Botão de Troca */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwap}
              variant="outline"
              size="sm"
              className="swap-button rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black border-0 hover:opacity-90"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Seção Para */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Para</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="bg-dashboard-dark/50 border-dashboard-light/30">
                  <SelectValue placeholder="Selecione a moeda">
                    {toCurrency && getCurrencyDisplay(toCurrency)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-dashboard-medium border-dashboard-light/30">
                  {allCurrencies.map((currency) => (
                    <SelectItem 
                      key={currency.symbol} 
                      value={currency.symbol}
                      className="text-white hover:bg-dashboard-light/30"
                    >
                      <div className="flex items-center justify-between w-full">
                        {getCurrencyDisplay(currency.symbol)}
                        <span className="text-xs text-muted-foreground ml-2">
                          {currency.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="0.00"
                value={reverseMode ? toAmount : ''}
                onChange={(e) => {
                  setReverseMode(true);
                  setToAmount(e.target.value);
                }}
                className="bg-dashboard-dark/50 border-dashboard-light/30 text-white text-lg font-semibold text-right"
                step="any"
                min="0"
              />
            </div>
          </div>

          {/* Resultado */}
          {fromAmount && toAmount && exchangeRate && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {formatNumber(fromAmount)} {fromCurrency} = {formatNumber(toAmount)} {toCurrency}
                </div>
                <div className="text-sm text-emerald-300 mt-1">
                  Taxa: 1 {fromCurrency} = {formatNumber(exchangeRate)} {toCurrency}
                </div>
              </div>
            </div>
          )}

          {/* Status de Loading */}
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Atualizando cotação...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taxas Favoritas */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-yellow-400" />
              Pares Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['BTC/BRL', 'ETH/USD', 'USDT/BRL'].map((pair) => (
                <div key={pair} className="flex items-center justify-between p-2 bg-dashboard-dark/30 rounded-lg">
                  <span className="text-white font-medium">{pair}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const [from, to] = pair.split('/');
                      setFromCurrency(from);
                      setToCurrency(to);
                    }}
                    className="text-satotrack-neon hover:bg-satotrack-neon/10"
                  >
                    Usar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aviso */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-300">
              <AlertCircle className="h-5 w-5" />
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-200">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Cotações fornecidas pela Tatum em tempo real</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Atualização mínima a cada 10 segundos</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Valores são apenas informativos</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyConverter;