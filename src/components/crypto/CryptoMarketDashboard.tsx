
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { 
  fetchMultipleCryptos, 
  fetchHistoricalData, 
  calculateTechnicalIndicators,
  CryptoData, 
  TechnicalIndicator 
} from '@/services/crypto/cryptoService';
import TechnicalIndicators from './TechnicalIndicators';
import { formatCurrency } from '@/utils/formatters';

const CryptoMarketDashboard: React.FC = () => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicator | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCryptoData = async () => {
    try {
      const data = await fetchMultipleCryptos();
      setCryptos(data);
      
      if (data.length > 0 && !selectedCrypto) {
        setSelectedCrypto(data[0]); // Bitcoin como padrão
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTechnicalData = async (cryptoId: string) => {
    try {
      const historicalData = await fetchHistoricalData(cryptoId, 30);
      const prices = historicalData.map(item => item.price);
      const technicalData = calculateTechnicalIndicators(prices);
      setIndicators(technicalData);
    } catch (error) {
      console.error('Erro ao carregar indicadores técnicos:', error);
    }
  };

  useEffect(() => {
    loadCryptoData();
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      loadTechnicalData(selectedCrypto.id);
    }
  }, [selectedCrypto]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCryptoData();
    if (selectedCrypto) {
      await loadTechnicalData(selectedCrypto.id);
    }
    setRefreshing(false);
  };

  const getMarketCapFormatted = (marketCap: number | undefined | null) => {
    if (!marketCap || marketCap === 0) return 'N/A';
    
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-satotrack-neon"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-orbitron satotrack-gradient-text">
            Análise de Mercado Avançada
          </h1>
          <p className="text-muted-foreground">
            Indicadores técnicos e análise de múltiplas criptomoedas
          </p>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
          className="border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Market Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cryptos.map((crypto) => (
          <Card 
            key={crypto.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedCrypto?.id === crypto.id 
                ? 'ring-2 ring-satotrack-neon bg-card/95' 
                : 'bg-card/80 hover:bg-card/95'
            }`}
            onClick={() => setSelectedCrypto(crypto)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name}
                    className="h-6 w-6"
                  />
                  <div>
                    <CardTitle className="text-sm">{crypto.symbol?.toUpperCase() || 'N/A'}</CardTitle>
                    <p className="text-xs text-muted-foreground">{crypto.name || 'N/A'}</p>
                  </div>
                </div>
                {crypto.id === 'bitcoin' && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="text-lg font-bold">
                  {crypto.current_price ? formatCurrency(crypto.current_price, 'USD') : 'N/A'}
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={crypto.price_change_percentage_24h && crypto.price_change_percentage_24h >= 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {crypto.price_change_percentage_24h && crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {crypto.price_change_percentage_24h ? Math.abs(crypto.price_change_percentage_24h).toFixed(2) : '0.00'}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getMarketCapFormatted(crypto.market_cap)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      {selectedCrypto && (
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="technical">Indicadores Técnicos</TabsTrigger>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical" className="space-y-4">
            <Card className="bg-card/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img 
                    src={selectedCrypto.image} 
                    alt={selectedCrypto.name}
                    className="h-6 w-6"
                  />
                  Análise Técnica - {selectedCrypto.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {indicators && selectedCrypto.current_price ? (
                  <TechnicalIndicators 
                    indicators={indicators}
                    currentPrice={selectedCrypto.current_price}
                  />
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-satotrack-neon"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-card/95">
              <CardHeader>
                <CardTitle>Informações Detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preço Atual:</span>
                      <span className="font-semibold">
                        {selectedCrypto.current_price ? formatCurrency(selectedCrypto.current_price, 'USD') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mudança 24h:</span>
                      <span className={selectedCrypto.price_change_percentage_24h && selectedCrypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {selectedCrypto.price_change_percentage_24h ? selectedCrypto.price_change_percentage_24h.toFixed(2) : '0.00'}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Cap:</span>
                      <span className="font-semibold">{getMarketCapFormatted(selectedCrypto.market_cap)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume 24h:</span>
                      <span className="font-semibold">{getMarketCapFormatted(selectedCrypto.volume_24h)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Símbolo:</span>
                      <span className="font-semibold">{selectedCrypto.symbol?.toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última Atualização:</span>
                      <span className="font-semibold text-xs">
                        {selectedCrypto.last_updated ? new Date(selectedCrypto.last_updated).toLocaleTimeString('pt-BR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <Card className="bg-card/95">
              <CardHeader>
                <CardTitle>Alertas Automáticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sistema de alertas inteligentes</p>
                  <p className="text-sm">Em desenvolvimento - Fase 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CryptoMarketDashboard;
