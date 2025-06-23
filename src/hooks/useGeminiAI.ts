
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GeminiAnalysisRequest {
  type: 'market_analysis' | 'portfolio_risk' | 'opportunity_detection' | 'trading_insights' | 'achievements_suggestion';
  data: any;
  context?: string;
}

interface GeminiResponse {
  analysis: string;
  confidence: number;
  recommendations: string[];
  insights: string[];
  timestamp: string;
}

export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const analyzeWithGemini = async (request: GeminiAnalysisRequest): Promise<GeminiResponse | null> => {
    setIsLoading(true);
    
    try {
      console.log('🧠 Enviando análise para Gemini:', request.type);
      
      const { data, error } = await supabase.functions.invoke('gemini-analysis', {
        body: {
          type: request.type,
          data: request.data,
          context: request.context || 'SatoTrack Dashboard Analysis'
        }
      });

      if (error) {
        console.error('❌ Erro Gemini:', error);
        throw new Error(error.message);
      }

      if (!data?.analysis) {
        throw new Error('Resposta inválida da IA');
      }

      console.log('✅ Análise Gemini concluída');
      return data;
      
    } catch (error) {
      console.error('💥 Erro na análise Gemini:', error);
      toast.error(`Gemini AI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMarketTrends = async (marketData: any) => {
    return analyzeWithGemini({
      type: 'market_analysis',
      data: marketData,
      context: 'Análise de tendências de mercado Bitcoin e criptomoedas'
    });
  };

  const analyzePortfolioRisk = async (portfolioData: any) => {
    return analyzeWithGemini({
      type: 'portfolio_risk',
      data: portfolioData,
      context: 'Análise de risco de portfólio cripto'
    });
  };

  const detectOpportunities = async (marketData: any, userProfile: any) => {
    return analyzeWithGemini({
      type: 'opportunity_detection',
      data: { marketData, userProfile },
      context: 'Detecção de oportunidades de trading'
    });
  };

  const generateTradingInsights = async (tradingData: any) => {
    return analyzeWithGemini({
      type: 'trading_insights',
      data: tradingData,
      context: 'Insights de trading social'
    });
  };

  const suggestAchievements = async (userStats: any) => {
    return analyzeWithGemini({
      type: 'achievements_suggestion',
      data: userStats,
      context: 'Sugestão de conquistas personalizadas'
    });
  };

  return {
    analyzeWithGemini,
    analyzeMarketTrends,
    analyzePortfolioRisk,
    detectOpportunities,
    generateTradingInsights,
    suggestAchievements,
    isLoading
  };
};
