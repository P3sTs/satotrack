
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SatoAIResponse {
  response: string;
  timestamp: string;
}

export const useSatoAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const askSatoAI = async (message: string, context?: string): Promise<string | null> => {
    if (!message.trim()) {
      toast.error('Por favor, digite uma mensagem para o SatoAI');
      return null;
    }

    setIsLoading(true);
    
    try {
      console.log('Sending message to SatoAI:', { message, context });
      
      const { data, error } = await supabase.functions.invoke('satoai-chat', {
        body: {
          message: message.trim(),
          context: context || 'SatoTrack App'
        }
      });

      console.log('SatoAI response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Erro na comunicação com o SatoAI');
      }

      if (data?.error) {
        console.error('SatoAI function error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.response) {
        throw new Error('Resposta inválida do SatoAI');
      }

      const result = data as SatoAIResponse;
      return result.response;
      
    } catch (error) {
      console.error('Erro ao consultar SatoAI:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('sobrecarregado') || errorMessage.includes('Rate limit')) {
        toast.error('SatoAI está sobrecarregado. Tente novamente em alguns segundos.');
      } else if (errorMessage.includes('API key')) {
        toast.error('Configuração da IA não encontrada. Contate o suporte.');
      } else {
        toast.error('Erro ao se comunicar com o SatoAI. Tente novamente.');
      }
      
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
