import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Repeat, 
  AlertTriangle,
  ArrowUpDown,
  Clock,
  Info,
  ArrowLeftRight,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
const anime = require('animejs');

interface TokenPair {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  balance?: string;
}

interface SwapQuote {
  rate: number;
  fromAmount: string;
  toAmount: string;
  estimatedFee: string;
  fromCurrency: string;
  toCurrency: string;
  validUntil: string;
}

const TokenSwapAdvanced: React.FC = () => {
  const [fromToken, setFromToken] = useState('BTC');
  const [toToken, setToToken] = useState('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const tokens: TokenPair[] = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'from-orange-500 to-yellow-500', balance: '0.5234' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'from-blue-500 to-purple-500', balance: '2.1456' },
    { symbol: 'USDT', name: 'Tether', icon: '₮', color: 'from-green-500 to-emerald-500', balance: '1250.00' },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬟', color: 'from-purple-500 to-pink-500', balance: '850.50' },
    { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'from-purple-600 to-blue-600', balance: '15.75' }
  ];

  const getTokenDisplay = (symbol: string) => {
    const token = tokens.find(t => t.symbol === symbol);
    if (!token) return symbol;
    
    return (
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${token.color} flex items-center justify-center text-white text-xs font-bold`}>
          {token.icon}
        </div>
        <span>{token.symbol}</span>
      </div>
    );
  };

  const fetchSwapQuote = async () => {
    if (!fromToken || !toToken || !fromAmount || fromToken === toToken) return;

    setIsLoadingQuote(true);
    try {
      // Simulação de quote usando edge function
      const response = await fetch('/api/tatum-token-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quote',
          fromCurrency: fromToken,
          toCurrency: toToken,
          amount: fromAmount
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQuote(data.data);
          setToAmount(data.data.toAmount);
          setLastUpdate(new Date());
          
          // Animação de sucesso
          anime({
            targets: '.quote-result',
            scale: [0.95, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
          });
        }
      } else {
        throw new Error('Failed to get quote');
      }
    } catch (error) {
      console.error('Quote error:', error);
      toast.error('Erro ao obter cotação');
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleSwap = async () => {
    if (!quote || !fromAmount) return;

    setIsSwapping(true);
    try {
      // Animação de loading
      anime({
        targets: '.swap-button',
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutQuad'
      });

      const response = await fetch('/api/tatum-token-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          fromCurrency: fromToken,
          toCurrency: toToken,
          amount: fromAmount,
          fromAddress: 'user_wallet_address',
          toAddress: 'user_wallet_address',
          privateKey: 'encrypted_private_key'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(`Swap executado! TX: ${data.data.transactionHash.slice(0, 8)}...`);
          
          // Animação de sucesso
          anime({
            targets: '.swap-success',
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutBack'
          });

          // Reset form
          setFromAmount('');
          setToAmount('');
          setQuote(null);
        }
      }
    } catch (error) {
      console.error('Swap error:', error);
      toast.error('Erro no swap');
    } finally {
      setIsSwapping(false);
    }
  };

  const swapTokens = () => {
    // Animação de rotação
    anime({
      targets: '.swap-arrow',
      rotate: '180deg',
      duration: 300,
      easing: 'easeInOutQuad'
    });

    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
    setQuote(null);
  };

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const timer = setTimeout(() => {
        fetchSwapQuote();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fromAmount, fromToken, toToken]);

  useEffect(() => {
    // Animação de entrada
    anime({
      targets: '.swap-card',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100),
      easing: 'easeOutQuart'
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Repeat className="h-5 w-5 text-black" />
            </div>
            Token Swap Avançado
          </h2>
          <p className="text-muted-foreground">
            Troque tokens usando a Tatum DEX API
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
            Tatum DEX
          </Badge>
          <Badge variant="outline" className="border-orange-500/30 text-orange-400">
            Beta
          </Badge>
        </div>
      </div>

      {/* Swap Principal */}
      <Card className="swap-card bg-dashboard-medium/30 border-dashboard-light/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>Swap de Tokens</span>
            {lastUpdate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {lastUpdate.toLocaleTimeString('pt-BR')}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* De */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">De</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="bg-dashboard-dark/50 border-dashboard-light/30">
                  <SelectValue placeholder="Selecione o token">
                    {fromToken && getTokenDisplay(fromToken)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-dashboard-medium border-dashboard-light/30">
                  {tokens.map((token) => (
                    <SelectItem 
                      key={token.symbol} 
                      value={token.symbol}
                      className="text-white hover:bg-dashboard-light/30"
                    >
                      <div className="flex items-center justify-between w-full">
                        {getTokenDisplay(token.symbol)}
                        <span className="text-xs text-muted-foreground ml-2">
                          {token.balance} {token.symbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-dashboard-dark/50 border-dashboard-light/30 text-white text-lg font-semibold text-right"
                step="any"
                min="0"
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              Disponível: {tokens.find(t => t.symbol === fromToken)?.balance || '0'} {fromToken}
            </div>
          </div>

          {/* Botão de Troca */}
          <div className="flex justify-center">
            <Button
              onClick={swapTokens}
              variant="outline"
              size="sm"
              className="swap-arrow rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 hover:opacity-90"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Para */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Para</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="bg-dashboard-dark/50 border-dashboard-light/30">
                  <SelectValue placeholder="Selecione o token">
                    {toToken && getTokenDisplay(toToken)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-dashboard-medium border-dashboard-light/30">
                  {tokens.map((token) => (
                    <SelectItem 
                      key={token.symbol} 
                      value={token.symbol}
                      className="text-white hover:bg-dashboard-light/30"
                    >
                      <div className="flex items-center justify-between w-full">
                        {getTokenDisplay(token.symbol)}
                        <span className="text-xs text-muted-foreground ml-2">
                          {token.balance} {token.symbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="0.00"
                value={toAmount}
                readOnly
                className="bg-dashboard-dark/30 border-dashboard-light/30 text-white text-lg font-semibold text-right cursor-not-allowed"
              />
            </div>
          </div>

          {/* Quote */}
          {quote && (
            <div className="quote-result p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {quote.fromAmount} {quote.fromCurrency} = {quote.toAmount} {quote.toCurrency}
                </div>
                <div className="text-sm text-emerald-300 mt-1">
                  Taxa: 1 {quote.fromCurrency} = {quote.rate.toFixed(6)} {quote.toCurrency}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Taxa estimada: {quote.estimatedFee}
                </div>
              </div>
            </div>
          )}

          {/* Loading Quote */}
          {isLoadingQuote && (
            <div className="flex items-center justify-center p-4 text-muted-foreground">
              <TrendingUp className="h-4 w-4 animate-pulse mr-2" />
              Obtendo cotação...
            </div>
          )}

          {/* Botão de Swap */}
          <Button
            onClick={handleSwap}
            disabled={!quote || isSwapping || !fromAmount}
            className="swap-button w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:opacity-90 disabled:opacity-50"
            size="lg"
          >
            {isSwapping ? (
              <>
                <ArrowUpDown className="h-4 w-4 animate-spin mr-2" />
                Executando Swap...
              </>
            ) : (
              'Executar Swap'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Informações */}
      <Card className="swap-card bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-300">
            <Info className="h-5 w-5" />
            Informações do Swap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-200">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Taxas e cotações fornecidas pela Tatum DEX</span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Cotações válidas por 5 minutos</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Funcionalidade em desenvolvimento - use com cautela</span>
          </div>
        </CardContent>
      </Card>

      {/* Elemento de sucesso oculto */}
      <div className="swap-success opacity-0" />
    </div>
  );
};

export default TokenSwapAdvanced;