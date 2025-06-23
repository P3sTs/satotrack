
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { Insight } from './insights/types';
import { InsightGenerator } from './insights/InsightGenerator';
import InsightsHeader from './insights/InsightsHeader';
import InsightCard from './insights/InsightCard';
import EmptyInsightsState from './insights/EmptyInsightsState';
import GeminiAnalysisDisplay from '@/components/ai/GeminiAnalysisDisplay';

const SmartInsights: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();
  const [insights, setInsights] = useState<Insight[]>([]);

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

  return (
    <div className="space-y-6">
      <Card className="cyberpunk-card">
        <CardHeader>
          <CardTitle>
            <InsightsHeader 
              onGenerateAnalysis={() => {}} // Removido - agora está no GeminiAnalysisDisplay
              isAnalyzing={false}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Insights básicos */}
          {insights.length === 0 ? (
            <EmptyInsightsState />
          ) : (
            insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))
          )}

          {/* Análise Avançada com IA Gemini */}
          {bitcoinData && (
            <GeminiAnalysisDisplay
              analysisType="market_analysis"
              data={bitcoinData}
              context={`
                Análise Avançada de Mercado Bitcoin:
                - Preço atual: $${bitcoinData.price_usd.toLocaleString()}
                - Variação 24h: ${bitcoinData.price_change_percentage_24h?.toFixed(2)}%
                - Volume 24h: $${bitcoinData.volume_24h_usd ? (bitcoinData.volume_24h_usd / 1e9).toFixed(2) + 'B' : 'N/A'}
                - Market Cap: $${bitcoinData.market_cap_usd ? (bitcoinData.market_cap_usd / 1e12).toFixed(2) + 'T' : 'N/A'}
              `}
              title="🤖 Análise Avançada SatoAI"
            />
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
