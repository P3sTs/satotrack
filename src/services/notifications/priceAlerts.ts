
import { supabase } from '@/integrations/supabase/client';
import { sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { sendEmailSummary } from './email';
import { logNotification } from './logger';

// Interface para detalhes de alerta de preço
export interface PriceAlertDetails {
  percentage: string;
  direction: 'up' | 'down';
  current_price: number;
  prediction?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

// Função aprimorada para lidar com alertas de preço
export const sendPriceAlert = async (
  userId: string, 
  priceChange: number,
  currentPrice: number,
  includeAI: boolean = false
) => {
  try {
    // Obter configurações de notificação do usuário
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!settings) return false;
    
    // Verificar se a alteração de preço excede o limite configurado
    const threshold = settings.price_alert_threshold || 5;
    if (Math.abs(priceChange) < threshold) return false;
    
    const direction = priceChange > 0 ? 'subiu' : 'caiu';
    let message = `O preço do Bitcoin ${direction} ${Math.abs(priceChange).toFixed(2)}% nas últimas 24h. Valor atual: $${currentPrice.toLocaleString('pt-BR')}`;
    
    const details: PriceAlertDetails = {
      percentage: Math.abs(priceChange).toFixed(2),
      direction: priceChange > 0 ? 'up' : 'down',
      current_price: currentPrice
    };
    
    // Get user plan to check if they are premium
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', userId)
      .single();
      
    const isPremium = userPlan?.plan_type === 'premium';
    
    // Adicionar análise de IA se solicitado e o usuário for premium
    if (includeAI && isPremium) {
      try {
        const { data: aiData } = await supabase.functions.invoke('analyze-price-movement', {
          body: { price_change: priceChange, current_price: currentPrice }
        });
        
        if (aiData?.prediction && aiData?.sentiment) {
          details.prediction = aiData.prediction;
          details.sentiment = aiData.sentiment;
          
          // Adicionar análise de IA à mensagem
          message += `\n\nAnálise: ${aiData.prediction}`;
        }
      } catch (aiError) {
        console.error('Erro na análise de IA:', aiError);
      }
    }
    
    // Enviar notificação push se habilitada
    if (settings.push_notifications_enabled && Notification.permission === 'granted') {
      const icon = priceChange > 0 ? '📈' : '📉';
      sendPushNotification(`${icon} Alerta de preço Bitcoin`, {
        body: message,
        tag: 'price-alert'
      });
      
      await logNotification(userId, 'price_alert', 'sent', details);
    }
    
    // Enviar notificação Telegram se habilitada
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(
        userId,
        message,
        'price_alert',
        details
      );
    }
    
    // Enviar email se habilitado
    if (settings.email_daily_summary || settings.email_weekly_summary) {
      await sendEmailSummary(userId, 'daily', {
        includeTransactions: false,
        includeMarketAnalysis: includeAI && isPremium,
        includePriceAlerts: true
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta de preço:', error);
    return false;
  }
};
