import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CoinHeader } from '@/components/coin/CoinHeader';
import { CoinChart } from '@/components/coin/CoinChart';
import { CoinHoldings } from '@/components/coin/CoinHoldings';
import { CoinHistory } from '@/components/coin/CoinHistory';
import { CoinAbout } from '@/components/coin/CoinAbout';
import { CoinActions } from '@/components/coin/CoinActions';
import { formatCurrency } from '@/utils/formatters';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { useCarteiras } from '@/contexts/carteiras';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change24hPercent: number;
  balance?: number;
  balanceUSD?: number;
  network?: string;
}

const CoinDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { data: bitcoinData } = useBitcoinPrice();
  const { carteiras } = useCarteiras();
  
  const [timeRange, setTimeRange] = useState('1D');
  const [coinData, setCoinData] = useState<CoinData | null>(null);

  useEffect(() => {
    if (symbol && bitcoinData) {
      // Simulate coin data based on symbol and available data
      const getCoinData = (): CoinData => {
        const lowerSymbol = symbol.toLowerCase();
        
        // Find matching wallet if exists
        const wallet = carteiras.find(c => 
          c.endereco.includes(symbol) || 
          symbol === 'BTC' || 
          lowerSymbol.includes('bitcoin')
        );

        switch (lowerSymbol) {
          case 'btc':
          case 'bitcoin':
            return {
              id: 'bitcoin',
              symbol: 'BTC',
              name: 'Bitcoin',
              price: bitcoinData.price_brl,
              change24h: 0,
              change24hPercent: 0,
              balance: wallet?.saldo || 0,
              balanceUSD: wallet ? wallet.saldo * bitcoinData.price_usd : 0,
              network: 'Bitcoin'
            };
          case 'pengu':
            return {
              id: 'pudgy-penguins',
              symbol: 'PENGU',
              name: 'Pudgy Penguins',
              price: 0.156932,
              change24h: -0.010042,
              change24hPercent: -6.01,
              balance: 154.658494,
              balanceUSD: 24.27,
              network: 'Solana'
            };
          case 'eth':
          case 'ethereum':
            return {
              id: 'ethereum',
              symbol: 'ETH',
              name: 'Ethereum',
              price: 3500.00,
              change24h: -120.50,
              change24hPercent: -3.33,
              balance: 0.5,
              balanceUSD: 1750.00,
              network: 'Ethereum'
            };
          case 'sol':
          case 'solana':
            return {
              id: 'solana',
              symbol: 'SOL',
              name: 'Solana',
              price: 180.00,
              change24h: 8.50,
              change24hPercent: 4.95,
              balance: 2.5,
              balanceUSD: 450.00,
              network: 'Solana'
            };
          default:
            return {
              id: symbol,
              symbol: symbol.toUpperCase(),
              name: `${symbol.charAt(0).toUpperCase()}${symbol.slice(1)}`,
              price: 1.00,
              change24h: 0,
              change24hPercent: 0,
              balance: 0,
              balanceUSD: 0,
              network: 'Unknown'
            };
        }
      };

      setCoinData(getCoinData());
    }
  }, [symbol, bitcoinData, carteiras]);

  if (!coinData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const timeRanges = ['1H', '1D', '1S', '1M', '1A', 'Todas'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold">{coinData.symbol}</h1>
              <p className="text-sm text-muted-foreground">
                {coinData.network && `${coinData.network}`}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon">
            {/* Placeholder for favorite or menu button */}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Price Section */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold">
            {formatCurrency(coinData.price, 'BRL')}
          </div>
          
          <div className="flex items-center justify-center gap-2">
            {coinData.change24hPercent >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${
              coinData.change24hPercent >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatCurrency(coinData.change24h, 'BRL')} ({coinData.change24hPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Chart */}
        <Card>
          <CardContent className="p-0">
            <CoinChart 
              symbol={coinData.symbol}
              timeRange={timeRange}
              data={[]} // Mock data for now
            />
          </CardContent>
        </Card>

        {/* Time Range Filters */}
        <div className="flex justify-center">
          <div className="flex bg-muted rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="holdings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
          </TabsList>
          
          <TabsContent value="holdings" className="mt-6">
            <CoinHoldings 
              coinData={coinData}
              onSend={() => {}}
              onReceive={() => {}}
              onSwap={() => {}}
              onBuy={() => {}}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <CoinHistory symbol={coinData.symbol} />
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <CoinAbout coinData={coinData} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t">
          <CoinActions
            onSend={() => {}}
            onReceive={() => {}}
            onSwap={() => {}}
            onBuy={() => {}}
          />
        </div>

        {/* Spacer for fixed buttons */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default CoinDetail;