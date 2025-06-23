
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { useSatoAI } from '@/hooks/useSatoAI';

interface Insight {
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  title: string;
  message: string;
  confidence: number;
  icon: React.ReactNode;
}

const SmartInsights: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();
  const { askSatoAI } = useSatoAI();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateBasicInsights();
  }, [bitcoinData]);

  const generateBasicInsights = () => {
    if (!bitcoinData) return;

    const newInsights: Insight[] = [];
    const change24h = bitcoinData.price_change_percentage_24h || 0;
    const volume = bitcoinData.volume_24h_usd || 0;
    const price = bitcoinData.price_usd;

    // Análise de tendência baseada na variação de 24h
    if (change24h > 5) {
      newInsights.push({
        type: 'bullish',
        title: 'Tendência de alta detectada',
        message: `O Bitcoin subiu ${change24h.toFixed(2)}% nas últimas 24h. Volume elevado sugere interesse dos compradores.`,
        confidence: Math.min(90, 60 + Math.abs(change24h) * 2),
        icon: <TrendingUp className="h-4 w-4" />
      });
    } else if (change24h < -5) {
      newInsights.push({
        type: 'bearish',
        title: 'Correção em andamento',
        message: `Queda de ${Math.abs(change24h).toFixed(2)}% indica pressão vendedora. Evite compras por impulso.`,
        confidence: Math.min(85, 50 + Math.abs(change24h) * 2),
        icon: <TrendingDown className="h-4 w-4" />
      });
    }

    // Análise de volume
    if (volume > 30000000000) { // > 30 bilhões
      newInsights.push({
        type: 'bullish',
        title: 'Volume excepcional',
        message: 'Alto volume de negociação indica forte interesse institucional e liquidez saudável.',
        confidence: 75,
        icon: <CheckCircle className="h-4 w-4" />
      });
    } else if (volume < 10000000000) { // < 10 bilhões
      newInsights.push({
        type: 'warning',
        title: 'Volume baixo',
        message: 'Pouca liquidez pode causar volatilidade. Aguarde maior volume antes de grandes operações.',
        confidence: 65,
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }

    // Análise de preço (resistência/suporte psicológico)
    const roundNumber = Math.round(price / 10000) * 10000;
    if (Math.abs(price - roundNumber) < 2000) {
      newInsights.push({
        type: 'neutral',
        title: 'Próximo de nível psicológico',
        message: `O preço está próximo de $${roundNumber.toLocaleString()}. Observe possível resistência ou suporte.`,
        confidence: 60,
        icon: <Brain className="h-4 w-4" />
      });
    }

    setInsights(newInsights.slice(0, 3)); // Máximo 3 insights
  };

  const generateAdvancedAIAnalysis = async () => {
    if (!bitcoinData) return;

    setIsAnalyzing(true);
    try {
      const context = `
        Análise Avançada de Mercado Bitcoin:
        - Preço atual: $${bitcoinData.price_usd.toLocaleString()}
        - Variação 24h: ${bitcoinData.price_change_percentage_24h?.toFixed(2)}%
        - Volume 24h: $${bitcoinData.volume_24h_usd ? (bitcoinData.volume_24h_usd / 1e9).toFixed(2) + 'B' : 'N/A'}
        - Market Cap: $${bitcoinData.market_cap_usd ? (bitcoinData.market_cap_usd / 1e12).toFixed(2) + 'T' : 'N/A'}
        - Dominância: ${bitcoinData.market_cap_percentage?.toFixed(1)}%
      `;

      const aiResponse = await askSatoAI(
        `Faça uma análise técnica e fundamentalista detalhada do Bitcoin considerando:
        1. Tendências de mercado e padrões técnicos
        2. Fatores macroeconômicos que podem impactar o preço
        3. Níveis de suporte e resistência importantes
        4. Recomendações específicas para investidores
        5. Cenários otimista, realista e pessimista para os próximos dias
        
        Seja específico e inclua dados quantitativos quando possível.`,
        context
      );

      if (aiResponse) {
        setAiAnalysis(aiResponse);
      }
    } catch (error) {
      console.error('Erro na análise avançada:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightColors = (type: string) => {
    switch (type) {
      case 'bullish':
        return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'bearish':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'neutral':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="cyberpunk-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-satotrack-neon" />
              🔔 Insights Inteligentes
            </CardTitle>
            <Button
              onClick={generateAdvancedAIAnalysis}
              disabled={isAnalyzing}
              className="bg-satotrack-neon hover:bg-satotrack-neon/80"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Análise Avançada IA
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aguardando dados suficientes para análise...</p>
            </div>
          ) : (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${getInsightColors(insight.type)} transition-all hover:scale-105`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{insight.title}</div>
                    <div className="text-sm opacity-90 mb-2">{insight.message}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs opacity-70">
                        Confiança: {insight.confidence}%
                      </div>
                      <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-current transition-all duration-1000"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {aiAnalysis && (
            <div className="mt-6 p-4 rounded-lg bg-satotrack-neon/10 border border-satotrack-neon/30">
              <div className="flex items-center gap-2 text-satotrack-neon mb-3">
                <Brain className="h-5 w-5" />
                <span className="font-semibold">Análise Avançada SatoAI</span>
              </div>
              <div className="text-sm whitespace-pre-wrap">{aiAnalysis}</div>
            </div>
          )}

          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">
              🤖 Análises geradas por IA baseadas em dados de mercado em tempo real
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartInsights;
