
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
      console.log('Enviando mensagem para SatoAI:', { message, context });
      
      const { data, error } = await supabase.functions.invoke('satoai-chat', {
        body: {
          message: message.trim(),
          context: context || 'SatoTrack App'
        }
      });

      console.log('Resposta bruta do SatoAI:', { data, error });

      if (error) {
        console.error('Erro na função Supabase:', error);
        toast.error(`Erro na comunicação: ${error.message}`);
        return null;
      }

      if (data?.error) {
        console.error('Erro na função SatoAI:', data.error);
        toast.error(`Erro do SatoAI: ${data.error}`);
        return null;
      }

      if (!data?.response) {
        console.error('Resposta inválida do SatoAI:', data);
        toast.error('Resposta inválida do SatoAI');
        return null;
      }

      console.log('SatoAI respondeu com sucesso:', data.response);
      return data.response;
      
    } catch (error) {
      console.error('Erro inesperado ao consultar SatoAI:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('sobrecarregado') || errorMessage.includes('Rate limit')) {
        toast.error('SatoAI está sobrecarregado. Tente novamente em alguns segundos.');
      } else if (errorMessage.includes('API key')) {
        toast.error('Configuração da IA não encontrada. Verifique sua API key.');
      } else if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
        toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
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
