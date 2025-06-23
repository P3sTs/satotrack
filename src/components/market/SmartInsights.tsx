
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { useSatoAI } from '@/hooks/useSatoAI';
import { Insight } from './insights/types';
import { InsightGenerator } from './insights/InsightGenerator';
import InsightsHeader from './insights/InsightsHeader';
import InsightCard from './insights/InsightCard';
import AIAnalysisDisplay from './insights/AIAnalysisDisplay';
import EmptyInsightsState from './insights/EmptyInsightsState';

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

    const params = {
      price: bitcoinData.price_usd,
      change24h: bitcoinData.price_change_percentage_24h || 0,
      volume: bitcoinData.volume_24h_usd || 0
    };

    const newInsights = InsightGenerator.generateBasicInsights(params);
    setInsights(newInsights);
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
        - Supply em circulação: ${bitcoinData.circulating_supply ? bitcoinData.circulating_supply.toLocaleString() : 'N/A'} BTC
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

  return (
    <div className="space-y-6">
      <Card className="cyberpunk-card">
        <CardHeader>
          <CardTitle>
            <InsightsHeader 
              onGenerateAnalysis={generateAdvancedAIAnalysis}
              isAnalyzing={isAnalyzing}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length === 0 ? (
            <EmptyInsightsState />
          ) : (
            insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))
          )}

          <AIAnalysisDisplay analysis={aiAnalysis} />

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
