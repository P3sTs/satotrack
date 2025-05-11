
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, RefreshCw, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import BitcoinPriceChart from '@/components/BitcoinPriceChart';
import MarketDistributionChart from '@/components/MarketDistributionChart';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';

interface BitcoinData {
  price_usd: number;
  price_brl: number;
  price_change_percentage_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  last_updated: string;
}

const Home = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const fetchBitcoinData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
      );
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do Bitcoin');
      }
      
      const data = await response.json();
      
      setBitcoinData({
        price_usd: data.market_data.current_price.usd,
        price_brl: data.market_data.current_price.brl,
        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        market_cap_usd: data.market_data.market_cap.usd,
        volume_24h_usd: data.market_data.total_volume.usd,
        last_updated: data.market_data.last_updated
      });
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Erro ao buscar dados do Bitcoin:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter os dados mais recentes do Bitcoin.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Carregar dados iniciais
  useEffect(() => {
    fetchBitcoinData();
    
    // Configurar auto-refresh a cada 30 segundos
    const intervalId = setInterval(() => {
      fetchBitcoinData();
    }, 30000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  
  const handleRefresh = () => {
    fetchBitcoinData();
    toast({
      title: "Dados atualizados",
      description: "Os dados de mercado do Bitcoin foram atualizados.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-dashboard-dark to-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-4">
          <Bitcoin className="h-12 w-12 text-bitcoin animate-pulse-slow" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bitcoin-gradient-text">
            SatoTrack
          </h1>
          <p className="max-w-[700px] text-zinc-200 md:text-xl">
            Monitore o mercado de Bitcoin e suas carteiras em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/auth">
              <Button className="bg-bitcoin hover:bg-bitcoin-dark">
                Monitorar Carteiras BTC
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Market data section */}
      <section className="container px-4 md:px-6 py-8 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Mercado Bitcoin</h2>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar mercado
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bitcoin"></div>
          </div>
        ) : bitcoinData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Preço em USD */}
            <Card className="bitcoin-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Bitcoin (USD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{formatCurrency(bitcoinData.price_usd, 'USD')}</div>
                  <div className={`flex items-center ${bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {bitcoinData.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{bitcoinData.price_change_percentage_24h.toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Preço em BRL */}
            <Card className="bitcoin-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Bitcoin (BRL)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{formatCurrency(bitcoinData.price_brl, 'BRL')}</div>
                  <div className={`flex items-center ${bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {bitcoinData.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{bitcoinData.price_change_percentage_24h.toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Market Cap */}
            <Card className="bitcoin-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Capitalização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(bitcoinData.market_cap_usd, 'USD', 0)}</div>
              </CardContent>
            </Card>
            
            {/* Volume 24h */}
            <Card className="bitcoin-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Volume 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(bitcoinData.volume_24h_usd, 'USD', 0)}</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bitcoin-card">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Não foi possível carregar os dados do Bitcoin</p>
            </CardContent>
          </Card>
        )}
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bitcoin-card col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Preço do Bitcoin (últimos 7 dias)</CardTitle>
              <CardDescription>
                Evolução do preço em USD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <BitcoinPriceChart />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bitcoin-card">
            <CardHeader>
              <CardTitle>Distribuição de Mercado</CardTitle>
              <CardDescription>
                Dominância por capitalização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <MarketDistributionChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
