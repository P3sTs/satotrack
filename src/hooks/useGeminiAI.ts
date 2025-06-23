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

interface ParsedGeminiData {
  risco?: string;
  sugestao?: string;
  projecao?: string;
  alerta?: string;
  tipo?: 'baixo' | 'moderado' | 'alto';
  score?: number;
}

export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<GeminiResponse | null>(null);

  // Parser para transformar texto da IA em dados estruturados
  const parseGeminiResponse = (analysis: string): ParsedGeminiData => {
    try {
      // Tenta primeiro parse JSON direto
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: extrai informações do texto
      const parsed: ParsedGeminiData = {};
      
      // Detectar nível de risco
      if (analysis.toLowerCase().includes('alto risco') || analysis.toLowerCase().includes('risco alto')) {
        parsed.risco = 'Alto';
        parsed.tipo = 'alto';
      } else if (analysis.toLowerCase().includes('risco moderado') || analysis.toLowerCase().includes('moderado')) {
        parsed.risco = 'Moderado';  
        parsed.tipo = 'moderado';
      } else if (analysis.toLowerCase().includes('baixo risco') || analysis.toLowerCase().includes('risco baixo')) {
        parsed.risco = 'Baixo';
        parsed.tipo = 'baixo';
      }

      // Extrair sugestões
      const suggestionMatch = analysis.match(/(?:sugest[ãa]o|recomend)[^.]*[.]/gi);
      if (suggestionMatch) {
        parsed.sugestao = suggestionMatch[0];
      }

      // Extrair projeções
      const projectionMatch = analysis.match(/(?:proje[çc][ãa]o|previs[ãa]o)[^.]*[.]/gi);
      if (projectionMatch) {
        parsed.projecao = projectionMatch[0];
      }

      // Detectar alertas
      if (analysis.toLowerCase().includes('alerta') || analysis.toLowerCase().includes('aten[çc][ãa]o')) {
        const alertMatch = analysis.match(/(?:alerta|aten[çc][ãa]o)[^.]*[.]/gi);
        if (alertMatch) {
          parsed.alerta = alertMatch[0];
        }
      }

      return parsed;
    } catch (error) {
      console.error('Erro ao fazer parse da resposta Gemini:', error);
      return { risco: 'Moderado', sugestao: analysis.substring(0, 200) + '...' };
    }
  };

  const analyzeWithGemini = async (request: GeminiAnalysisRequest): Promise<GeminiResponse | null> => {
    // Evita carregar automaticamente - só se não tiver análise recente
    if (lastAnalysis && Date.now() - new Date(lastAnalysis.timestamp).getTime() < 60000) {
      console.log('🔄 Usando análise em cache');
      return lastAnalysis;
    }

    setIsLoading(true);
    
    try {
      console.log('🧠 Enviando análise para Gemini:', request.type);
      
      // Prompt melhorado para retorno estruturado
      const enhancedContext = `${request.context || 'SatoTrack Dashboard Analysis'}
      
      IMPORTANTE: Resuma o resultado em máximo 3 pontos principais. Use linguagem simples e objetiva. 
      Retorne preferencialmente no formato JSON:
      {
        "risco": "Alto/Moderado/Baixo",
        "sugestao": "Sua principal recomendação em 1 frase",
        "projecao": "Previsão objetiva para próximos dias/semanas", 
        "alerta": "Aviso importante (se houver)"
      }`;

      const { data, error } = await supabase.functions.invoke('gemini-analysis', {
        body: {
          type: request.type,
          data: request.data,
          context: enhancedContext
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
      setLastAnalysis(data);
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
    parseGeminiResponse,
    lastAnalysis,
    isLoading
  };
};
