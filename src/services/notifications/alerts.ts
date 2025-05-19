
import { supabase } from '@/integrations/supabase/client';
import { sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { sendEmailSummary } from './email';
import { logNotification } from './logger';

// Re-export a função logNotification para que esteja disponível a partir de alerts.ts
export { logNotification };

// Interface para detalhes de alerta de preço
export interface PriceAlertDetails {
  percentage: string;
  direction: 'up' | 'down';
  current_price: number;
  prediction?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

// Interface para detalhes de alerta de transação
export interface TransactionAlertDetails {
  wallet_name: string;
  amount: number;
  type: 'received' | 'sent';
  fee?: number;
  from_address?: string;
  to_address?: string;
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
    
    // Adicionar análise de IA se solicitado e o usuário for premium
    if (includeAI && settings.is_premium) {
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
    if (settings.email_notifications_enabled) {
      const subject = `${priceChange > 0 ? '📈' : '📉'} Alerta de Preço Bitcoin - ${Math.abs(priceChange).toFixed(2)}%`;
      await sendEmailSummary(userId, 'daily', {
        includeTransactions: false,
        includeMarketAnalysis: includeAI && settings.is_premium,
        includePriceAlerts: true
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta de preço:', error);
    return false;
  }
};

// Função aprimorada para notificar sobre transação em carteira
export const sendTransactionNotification = async (
  userId: string,
  walletName: string,
  amount: number,
  type: 'received' | 'sent',
  transactionDetails: Partial<TransactionAlertDetails> = {}
) => {
  try {
    // Obter configurações de notificação do usuário
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!settings) return false;
    
    // Verificar se o valor excede o limite configurado
    const threshold = settings.balance_alert_threshold || 0;
    if (amount < threshold) return false;
    
    const action = type === 'received' ? 'recebeu' : 'enviou';
    const icon = type === 'received' ? '💰' : '💸';
    const message = `Sua carteira ${walletName} ${action} ${amount.toFixed(8)} BTC`;
    
    const details: TransactionAlertDetails = {
      wallet_name: walletName,
      amount,
      type,
      ...transactionDetails
    };
    
    // Enviar notificação push se habilitada
    if (settings.push_notifications_enabled && Notification.permission === 'granted') {
      sendPushNotification(`${icon} Transação Bitcoin`, {
        body: message,
        tag: `transaction-${type}`
      });
      
      await logNotification(userId, `transaction_${type}`, 'sent', details);
    }
    
    // Enviar notificação Telegram se habilitada
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(
        userId,
        message,
        `transaction_${type}`,
        details
      );
    }
    
    // Enviar email se habilitado para transações grandes
    if (settings.email_notifications_enabled && amount >= (settings.large_transaction_threshold || 0.1)) {
      await sendEmailSummary(userId, 'daily', {
        includeTransactions: true,
        includeMarketAnalysis: false,
        includePriceAlerts: false
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de transação:', error);
    return false;
  }
};

// Nova função para alertas inteligentes baseados em padrões do usuário
export const sendIntelligentAlert = async (
  userId: string,
  alertType: 'pattern' | 'opportunity' | 'risk' | 'insight',
  message: string,
  details: any = {}
) => {
  try {
    // Verificar se o usuário é premium
    const { data: user } = await supabase
      .from('user_settings')
      .select('is_premium, push_notifications_enabled, telegram_notifications_enabled, email_notifications_enabled')
      .eq('user_id', userId)
      .single();
    
    if (!user?.is_premium) return false; // Somente para usuários premium
    
    // Registrar alerta
    await logNotification(userId, `intelligent_${alertType}`, 'created', details);
    
    // Enviar por todos os canais configurados
    if (user.push_notifications_enabled && Notification.permission === 'granted') {
      sendPushNotification(`🧠 Insight Inteligente SatoTrack`, {
        body: message,
        tag: `intelligent-${alertType}`
      });
    }
    
    if (user.telegram_notifications_enabled) {
      await sendTelegramNotification(userId, message, `intelligent_${alertType}`, details);
    }
    
    if (user.email_notifications_enabled) {
      // Incluir no próximo relatório
      // Opcionalmente, enviar email imediato para insights importantes
      if (alertType === 'opportunity' || alertType === 'risk') {
        await sendEmailSummary(userId, 'daily', {
          includeTransactions: false,
          includeMarketAnalysis: true,
          includePriceAlerts: false
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao enviar alerta inteligente (${alertType}):`, error);
    return false;
  }
};
