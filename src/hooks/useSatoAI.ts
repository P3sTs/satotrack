
import { useState } from 'react';
import { useSupabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SatoAIResponse {
  response: string;
  timestamp: string;
}

export const useSatoAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabase();

  const askSatoAI = async (message: string, context?: string): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('satoai-chat', {
        body: {
          message,
          context: context || 'SatoTrack App'
        }
      });

      if (error) {
        throw error;
      }

      const result = data as SatoAIResponse;
      return result.response;
      
    } catch (error) {
      console.error('Erro ao consultar SatoAI:', error);
      toast.error('Erro ao se comunicar com o SatoAI');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickInsight = async (walletData?: any): Promise<string | null> => {
    const context = walletData 
      ? `Análise de carteira com saldo: ${walletData.saldo} BTC`
      : 'Insight geral do mercado';
      
    return askSatoAI(
      'Me dê um insight rápido sobre o mercado de Bitcoin atual e uma recomendação.',
      context
    );
  };

  const analyzePortfolio = async (portfolioData: any): Promise<string | null> => {
    const context = `Portfolio: ${JSON.stringify(portfolioData)}`;
    
    return askSatoAI(
      'Analise meu portfolio e dê recomendações de otimização e diversificação.',
      context
    );
  };

  return {
    askSatoAI,
    getQuickInsight,
    analyzePortfolio,
    isLoading
  };
};
