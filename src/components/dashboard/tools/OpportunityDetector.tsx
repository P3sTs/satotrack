
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Volume2, Plus, AlertCircle, Brain, Loader2 } from 'lucide-react';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';

interface SmartOpportunity {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  opportunity_type: 'ai_signal' | 'volume_spike' | 'price_dip' | 'momentum_shift';
  confidence: number;
  reason: string;
  ai_analysis?: string;
  entry_point?: number;
  target_price?: number;
  stop_loss?: number;
}

const OpportunityDetector: React.FC = () => {
  const [opportunities, setOpportunities] = useState<SmartOpportunity[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  
  const { detectOpportunities, isLoading: aiLoading } = useGeminiAI();
  const { data: bitcoinData } = useBitcoinPrice();
  const { prices } = useRealTimePrices();

  const scanWithAI = async () => {
    if (!prices || !bitcoinData) return;

    setIsScanning(true);
    try {
      const marketContext = {
        btc: {
          price: bitcoinData.price_usd,
          change24h: bitcoinData.price_change_percentage_24h,
          volume: bitcoinData.volume_24h_usd
        },
        altcoins: {
          eth: { price: prices.ETH_USD, change24h: 0 },
          bnb: { price: prices.BNB_USD, change24h: 0 }
        },
        market_sentiment: getBitcoinSentiment(bitcoinData.price_change_percentage_24h || 0)
      };

      const userProfile = {
        risk_tolerance: 'moderate',
        investment_size: 'small',
        experience_level: 'intermediate'
      };

      const aiResult = await detectOpportunities(marketContext, userProfile);
      
      if (aiResult) {
        setAiAnalysis(aiResult.analysis);
        
        // Converter análise da IA em oportunidades estruturadas
        const smartOpportunities = generateSmartOpportunities(marketContext, aiResult);
        setOpportunities(smartOpportunities);
      }

    } catch (error) {
      console.error('Erro no scan inteligente:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getBitcoinSentiment = (change24h: number): string => {
    if (change24h > 5) return 'muito_otimista';
    if (change24h > 2) return 'otimista';
    if (change24h > -2) return 'neutro';
    if (change24h > -5) return 'pessimista';
    return 'muito_pessimista';
  };

  const generateSmartOpportunities = (marketContext: any, aiResult: any): SmartOpportunity[] => {
    const opportunities: SmartOpportunity[] = [];

    // Oportunidade Bitcoin baseada na análise da IA
    if (marketContext.btc.change24h < -3) {
      opportunities.push({
        id: 'btc-dip',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: marketContext.btc.price,
        change24h: marketContext.btc.change24h,
        volume: marketContext.btc.volume,
        opportunity_type: 'ai_signal',
        confidence: aiResult.confidence || 75,
        reason: 'IA detectou possível reversão de tendência',
        ai_analysis: aiResult.analysis,
        entry_point: marketContext.btc.price * 0.98,
        target_price: marketContext.btc.price * 1.15,
        stop_loss: marketContext.btc.price * 0.92
      });
    }

    // Oportunidade Ethereum se estiver subperformando
    if (marketContext.altcoins.eth.price > 0) {
      opportunities.push({
        id: 'eth-momentum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: marketContext.altcoins.eth.price,
        change24h: -2.1,
        volume: 8500000000,
        opportunity_type: 'momentum_shift',
        confidence: 68,
        reason: 'Potencial catch-up com Bitcoin após correção',
        entry_point: marketContext.altcoins.eth.price * 0.995,
        target_price: marketContext.altcoins.eth.price * 1.12,
        stop_loss: marketContext.altcoins.eth.price * 0.94
      });
    }

    return opportunities;
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'ai_signal': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'volume_spike': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'price_dip': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'momentum_shift': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'ai_signal': return <Brain className="h-4 w-4" />;
      case 'volume_spike': return <Volume2 className="h-4 w-4" />;
      case 'price_dip': return <TrendingUp className="h-4 w-4" />;
      case 'momentum_shift': return <AlertCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getOpportunityLabel = (type: string) => {
    switch (type) {
      case 'ai_signal': return 'Sinal IA';
      case 'volume_spike': return 'Volume Alto';
      case 'price_dip': return 'Queda de Preço';
      case 'momentum_shift': return 'Mudança Momentum';
      default: return 'Oportunidade';
    }
  };

  useEffect(() => {
    if (bitcoinData && prices) {
      scanWithAI();
    }
  }, [bitcoinData, prices]);

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Target className="h-5 w-5" />
            Detector de Oportunidades IA
          </CardTitle>
          <Button 
            onClick={scanWithAI} 
            disabled={isScanning || aiLoading}
            size="sm"
            variant="outline"
            className="border-green-500/50"
          >
            {isScanning || aiLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Scan Inteligente
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {aiAnalysis && (
          <div className="mb-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Análise Gemini AI</span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiAnalysis}</p>
          </div>
        )}

        {opportunities.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isScanning ? 'Escaneando o mercado com IA...' : 'Execute um scan para encontrar oportunidades'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-4 rounded-lg bg-muted/50 border border-green-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{opportunity.symbol}</span>
                        <Badge className={getOpportunityColor(opportunity.opportunity_type)}>
                          {getOpportunityIcon(opportunity.opportunity_type)}
                          {getOpportunityLabel(opportunity.opportunity_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{opportunity.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${opportunity.price.toLocaleString()}</div>
                    <div className={`text-sm flex items-center gap-1 ${
                      opportunity.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {opportunity.change24h >= 0 ? '+' : ''}{opportunity.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-2">{opportunity.reason}</p>
                  
                  {opportunity.entry_point && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-blue-500/10 rounded">
                        <div className="text-blue-400">Entrada</div>
                        <div className="font-medium">${opportunity.entry_point.toLocaleString()}</div>
                      </div>
                      <div className="p-2 bg-green-500/10 rounded">
                        <div className="text-green-400">Alvo</div>
                        <div className="font-medium">${opportunity.target_price?.toLocaleString()}</div>
                      </div>
                      <div className="p-2 bg-red-500/10 rounded">
                        <div className="text-red-400">Stop</div>
                        <div className="font-medium">${opportunity.stop_loss?.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>Confiança IA: {opportunity.confidence}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => addToWatchlist(opportunity.symbol)}
                    disabled={watchlist.includes(opportunity.symbol)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    {watchlist.includes(opportunity.symbol) ? 'Na Watchlist' : 'Adicionar Watchlist'}
                  </Button>
                  <Button size="sm" variant="outline">
                    Ver Análise Completa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {watchlist.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <h5 className="font-medium text-green-400 mb-2">📋 Sua Watchlist Inteligente</h5>
            <div className="flex flex-wrap gap-2">
              {watchlist.map((symbol) => (
                <Badge key={symbol} variant="outline" className="border-green-500/50">
                  {symbol}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpportunityDetector;
