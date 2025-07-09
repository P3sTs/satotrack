import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Bitcoin
} from 'lucide-react';
import { toast } from 'sonner';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  contractAddress?: string;
  logo?: string;
  usdValue?: number;
}

interface WalletBalance {
  address: string;
  nativeBalance: string;
  nativeSymbol: string;
  tokens: TokenBalance[];
  totalUsdValue: number;
}

interface BalanceViewerProps {
  userWallets?: any[];
}

const FIAT_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin' }
];

const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬟' },
  { id: 'bsc', name: 'BSC', symbol: 'BNB', icon: '⬟' },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿' }
];

const BalanceViewer: React.FC<BalanceViewerProps> = ({ userWallets = [] }) => {
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [balanceData, setBalanceData] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (selectedAddress && balanceData) {
      // Auto-refresh every 30 seconds
      interval = setInterval(() => {
        handleRefreshBalance();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedAddress, balanceData]);

  const handleRefreshBalance = async () => {
    if (!selectedAddress) {
      toast.error('Digite um endereço válido');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`💰 Consultando saldo para ${selectedAddress} na rede ${selectedChain}...`);
      
      // Simular chamadas Tatum API
      // GET /v3/{chain}/account/balance/{address}
      // GET /v3/exchangeRate/{crypto}/{fiat}
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockBalance = generateMockBalance(selectedAddress, selectedChain);
      setBalanceData(mockBalance);
      setLastUpdate(new Date());
      
      toast.success(`✅ Saldo atualizado para ${selectedChain.toUpperCase()}`);
      
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('❌ Erro ao consultar saldo');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockBalance = (address: string, chain: string): WalletBalance => {
    const chainInfo = SUPPORTED_CHAINS.find(c => c.id === chain);
    const nativeBalance = (Math.random() * 10).toFixed(6);
    
    const mockTokens: TokenBalance[] = chain === 'ethereum' ? [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        balance: (Math.random() * 1000).toFixed(2),
        decimals: 6,
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        usdValue: Math.random() * 1000
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: (Math.random() * 500).toFixed(2),
        decimals: 6,
        contractAddress: '0xA0b86a33E6A30d5ccD18A6DD5b65f4e3ACAB4E6F',
        usdValue: Math.random() * 500
      }
    ] : [];

    return {
      address,
      nativeBalance,
      nativeSymbol: chainInfo?.symbol || 'ETH',
      tokens: mockTokens,
      totalUsdValue: parseFloat(nativeBalance) * 2000 + mockTokens.reduce((sum, token) => sum + (token.usdValue || 0), 0)
    };
  };

  const formatCurrency = (value: number, currency: string): string => {
    const currencyInfo = FIAT_CURRENCIES.find(c => c.code === currency);
    
    if (currency === 'BTC') {
      return `₿ ${(value / 50000).toFixed(8)}`;
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const calculatePriceChange = (): number => {
    return (Math.random() - 0.5) * 10; // Mock price change
  };

  const priceChange = calculatePriceChange();

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-5 w-5 text-emerald-400" />
            Consultar Saldos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chain">Blockchain</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chain.icon}</span>
                        <span>{chain.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="0x... ou endereço da carteira"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIAT_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleRefreshBalance}
                disabled={isLoading || !selectedAddress}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Consultar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Display */}
      {balanceData && (
        <div className="space-y-4">
          {/* Total Portfolio Value */}
          <Card className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total do Portfolio</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(balanceData.totalUsdValue, selectedCurrency)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {priceChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm ${priceChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}% (24h)
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  {lastUpdate && (
                    <p className="text-xs text-muted-foreground">
                      Última atualização: {lastUpdate.toLocaleTimeString()}
                    </p>
                  )}
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 mt-2">
                    Auto-refresh 30s
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Native Balance */}
          <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {SUPPORTED_CHAINS.find(c => c.id === selectedChain)?.icon}
                </div>
                Saldo Nativo ({balanceData.nativeSymbol})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {parseFloat(balanceData.nativeBalance).toFixed(6)} {balanceData.nativeSymbol}
                  </p>
                  <p className="text-muted-foreground">
                    ≈ {formatCurrency(parseFloat(balanceData.nativeBalance) * 2000, selectedCurrency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Balances */}
          {balanceData.tokens.length > 0 && (
            <Card className="bg-dashboard-dark/50 border-dashboard-light/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Coins className="h-5 w-5 text-emerald-400" />
                  Tokens ({balanceData.tokens.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {balanceData.tokens.map((token, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-dashboard-medium/30 rounded-lg border border-dashboard-light/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {token.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{token.name}</p>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-white">
                          {parseFloat(token.balance).toFixed(2)} {token.symbol}
                        </p>
                        {token.usdValue && (
                          <p className="text-sm text-muted-foreground">
                            ≈ {formatCurrency(token.usdValue, selectedCurrency)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* API Info */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-300">💰 Recursos de Saldo:</p>
              <ul className="text-blue-200 space-y-1 text-xs">
                <li>• Consulta multi-token via Tatum API</li>
                <li>• Conversão em tempo real para múltiplas moedas</li>
                <li>• Auto-refresh automático a cada 30 segundos</li>
                <li>• Suporte a tokens ERC-20, BEP-20 e mais</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceViewer;