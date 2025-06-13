
import { supabase } from '@/integrations/supabase/client';
import { sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';

// Tipos de alerta para melhor tipagem
export interface PriceAlertDetails {
  symbol: string;
  currentPrice: number;
  targetPrice: number;
  condition: 'above' | 'below' | 'equals';
  change24h?: number;
}

export interface TransactionAlertDetails {
  walletAddress: string;
  amount: number;
  txHash: string;
  type: 'received' | 'sent';
  timestamp: Date;
}

export interface IntelligentAlertDetails {
  type: 'pattern' | 'opportunity' | 'risk' | 'insight';
  message: string;
  data?: any;
  confidence?: number;
  source?: string;
}

export type IntelligentAlertType = 'pattern' | 'opportunity' | 'risk' | 'insight';

// Função para registrar notificações no banco
export const logNotification = async (
  userId: string,
  notificationType: string,
  status: 'sent' | 'failed' | 'pending',
  details?: any
) => {
  try {
    const { error } = await supabase
      .from('notification_logs')
      .insert({
        user_id: userId,
        notification_type: notificationType,
        status,
        details
      });

    if (error) {
      console.error('Erro ao registrar notificação:', error);
    }
  } catch (error) {
    console.error('Erro ao salvar log de notificação:', error);
  }
};

// Função para alertas de preço
export const sendPriceAlert = async (
  userId: string,
  alertDetails: PriceAlertDetails
) => {
  try {
    // Obter configurações de notificação do usuário
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!settings) return false;

    const { symbol, currentPrice, targetPrice, condition, change24h } = alertDetails;
    
    // Formatar mensagem do alerta
    const conditionText = {
      above: 'subiu acima de',
      below: 'caiu abaixo de',
      equals: 'atingiu'
    }[condition];

    const changeText = change24h ? ` (${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}% em 24h)` : '';
    
    const message = `🚨 ALERTA DE PREÇO\n\n${symbol} ${conditionText} ${targetPrice.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    })}\n\nPreço atual: ${currentPrice.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    })}${changeText}`;

    // Registrar alerta
    await logNotification(userId, 'price_alert', 'sent', alertDetails);
    
    // Enviar notificação push se habilitada
    if (settings.push_notifications_enabled && 'Notification' in window && Notification.permission === 'granted') {
      sendPushNotification('🚨 Alerta de Preço SatoTracker', {
        body: `${symbol} ${conditionText} ${targetPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        icon: '/icon-192x192.png',
        tag: 'price-alert',
        badge: '/icon-72x72.png'
      });
    }
    
    // Enviar via Telegram se configurado
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(userId, message, 'price_alert', alertDetails);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta de preço:', error);
    await logNotification(userId, 'price_alert', 'failed', { error: error.message, ...alertDetails });
    return false;
  }
};

// Função para alertas de transação
export const sendTransactionNotification = async (
  userId: string,
  alertDetails: TransactionAlertDetails
) => {
  try {
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!settings) return false;

    const { walletAddress, amount, txHash, type, timestamp } = alertDetails;
    
    const typeText = type === 'received' ? '💰 RECEBIDO' : '📤 ENVIADO';
    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-6)}`;
    
    const message = `🔔 TRANSAÇÃO DETECTADA\n\n${typeText}\n\nValor: ${amount} BTC\nCarteira: ${shortAddress}\nHash: ${shortHash}\nData: ${new Date(timestamp).toLocaleString('pt-BR')}`;

    await logNotification(userId, 'transaction_alert', 'sent', alertDetails);
    
    if (settings.push_notifications_enabled && 'Notification' in window && Notification.permission === 'granted') {
      sendPushNotification('🔔 Nova Transação', {
        body: `${typeText}: ${amount} BTC`,
        icon: '/icon-192x192.png',
        tag: 'transaction-alert'
      });
    }
    
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(userId, message, 'transaction_alert', alertDetails);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta de transação:', error);
    await logNotification(userId, 'transaction_alert', 'failed', { error: error.message, ...alertDetails });
    return false;
  }
};

// Função para alertas inteligentes baseados em IA
export const sendIntelligentAlert = async (
  userId: string,
  alertType: IntelligentAlertType,
  message: string,
  details: any = {}
) => {
  try {
    const { data: userPlan } = await supabase
      .from('user_plans')
      .select('plan_type')
      .eq('user_id', userId)
      .single();
    
    if (!userPlan || userPlan.plan_type !== 'premium') return false; // Somente para usuários premium
    
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (!settings) return false;
    
    const alertIcons = {
      pattern: '📊',
      opportunity: '💎',
      risk: '⚠️',
      insight: '🧠'
    };
    
    const fullMessage = `${alertIcons[alertType]} INSIGHT INTELIGENTE\n\n${message}`;
    
    await logNotification(userId, `intelligent_${alertType}`, 'sent', details);
    
    if (settings.push_notifications_enabled && 'Notification' in window && Notification.permission === 'granted') {
      sendPushNotification(`${alertIcons[alertType]} SatoAI Insight`, {
        body: message,
        icon: '/icon-192x192.png',
        tag: `intelligent-${alertType}`
      });
    }
    
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(userId, fullMessage, `intelligent_${alertType}`, details);
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao enviar alerta inteligente (${alertType}):`, error);
    await logNotification(userId, `intelligent_${alertType}`, 'failed', { error: error.message, ...details });
    return false;
  }
};
