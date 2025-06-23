
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { Insight, InsightGenerationParams } from './types';

export class InsightGenerator {
  static generateBasicInsights(params: InsightGenerationParams): Insight[] {
    const { price, change24h, volume } = params;
    const insights: Insight[] = [];

    // Análise de tendência baseada na variação de 24h
    if (change24h > 5) {
      insights.push({
        type: 'bullish',
        title: 'Tendência de alta detectada',
        message: `O Bitcoin subiu ${change24h.toFixed(2)}% nas últimas 24h. Volume elevado sugere interesse dos compradores.`,
        confidence: Math.min(90, 60 + Math.abs(change24h) * 2),
        icon: React.createElement(TrendingUp, { className: "h-4 w-4" })
      });
    } else if (change24h < -5) {
      insights.push({
        type: 'bearish',
        title: 'Correção em andamento',
        message: `Queda de ${Math.abs(change24h).toFixed(2)}% indica pressão vendedora. Evite compras por impulso.`,
        confidence: Math.min(85, 50 + Math.abs(change24h) * 2),
        icon: React.createElement(TrendingDown, { className: "h-4 w-4" })
      });
    }

    // Análise de volume
    if (volume > 30000000000) { // > 30 bilhões
      insights.push({
        type: 'bullish',
        title: 'Volume excepcional',
        message: 'Alto volume de negociação indica forte interesse institucional e liquidez saudável.',
        confidence: 75,
        icon: React.createElement(CheckCircle, { className: "h-4 w-4" })
      });
    } else if (volume < 10000000000) { // < 10 bilhões
      insights.push({
        type: 'warning',
        title: 'Volume baixo',
        message: 'Pouca liquidez pode causar volatilidade. Aguarde maior volume antes de grandes operações.',
        confidence: 65,
        icon: React.createElement(AlertTriangle, { className: "h-4 w-4" })
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
        icon: React.createElement(Brain, { className: "h-4 w-4" })
      });
    }

    return insights.slice(0, 3); // Máximo 3 insights
  }
}
