
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

interface Insight {
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  title: string;
  message: string;
  confidence: number;
  icon: React.ReactNode;
}

const SmartInsights: React.FC = () => {
  const { data: bitcoinData } = useBitcoinPrice();

  const generateInsights = (): Insight[] => {
    if (!bitcoinData) return [];

    const insights: Insight[] = [];
    const change24h = bitcoinData.price_change_percentage_24h || 0;
    const volume = bitcoinData.volume_24h_usd || 0;
    const price = bitcoinData.price_usd;

    // Análise de tendência baseada na variação de 24h
    if (change24h > 5) {
      insights.push({
        type: 'bullish',
        title: 'Tendência de alta detectada',
        message: `O Bitcoin subiu ${change24h.toFixed(2)}% nas últimas 24h. Volume elevado sugere interesse dos compradores.`,
        confidence: Math.min(90, 60 + Math.abs(change24h) * 2),
        icon: <TrendingUp className="h-4 w-4" />
      });
    } else if (change24h < -5) {
      insights.push({
        type: 'bearish',
        title: 'Correção em andamento',
        message: `Queda de ${Math.abs(change24h).toFixed(2)}% indica pressão vendedora. Evite compras por impulso.`,
        confidence: Math.min(85, 50 + Math.abs(change24h) * 2),
        icon: <TrendingDown className="h-4 w-4" />
      });
    }

    // Análise de volume
    if (volume > 30000000000) { // > 30 bilhões
      insights.push({
        type: 'bullish',
        title: 'Volume excepcional',
        message: 'Alto volume de negociação indica forte interesse institucional e liquidez saudável.',
        confidence: 75,
        icon: <CheckCircle className="h-4 w-4" />
      });
    } else if (volume < 10000000000) { // < 10 bilhões
      insights.push({
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
      insights.push({
        type: 'neutral',
        title: 'Próximo de nível psicológico',
        message: `O preço está próximo de $${roundNumber.toLocaleString()}. Observe possível resistência ou suporte.`,
        confidence: 60,
        icon: <Brain className="h-4 w-4" />
      });
    }

    // Análise de volatilidade
    const absChange = Math.abs(change24h);
    if (absChange > 8) {
      insights.push({
        type: 'warning',
        title: 'Alta volatilidade detectada',
        message: 'Movimentos bruscos de preço. Considere estratégias de gestão de risco.',
        confidence: 80,
        icon: <AlertTriangle className="h-4 w-4" />
      });
    } else if (absChange < 1) {
      insights.push({
        type: 'neutral',
        title: 'Mercado estável',
        message: 'Baixa volatilidade sugere consolidação. Momento para análise técnica detalhada.',
        confidence: 70,
        icon: <CheckCircle className="h-4 w-4" />
      });
    }

    return insights.slice(0, 3); // Máximo 3 insights
  };

  const insights = generateInsights();

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

  if (insights.length === 0) {
    return (
      <Card className="cyberpunk-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-satotrack-neon" />
            🔔 Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aguardando dados suficientes para análise...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cyberpunk-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-satotrack-neon" />
          🔔 Insights Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
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
        ))}

        <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
          <div className="text-xs text-muted-foreground">
            🤖 Análises geradas por IA baseadas em dados de mercado em tempo real
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartInsights;
