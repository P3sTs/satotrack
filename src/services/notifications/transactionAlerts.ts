
import { supabase } from '@/integrations/supabase/client';
import { sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { sendEmailSummary } from './email';
import { logNotification } from './logger';

// Interface para detalhes de alerta de transação
export interface TransactionAlertDetails {
  wallet_name: string;
  amount: number;
  type: 'received' | 'sent';
  fee?: number;
  from_address?: string;
  to_address?: string;
}

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
    if (settings.email_daily_summary || settings.email_weekly_summary) {
      // Consider transactions over 0.1 BTC as large (adjust as needed)
      const largeTransactionThreshold = 0.1;
      if (amount >= largeTransactionThreshold) {
        await sendEmailSummary(userId, 'daily', {
          includeTransactions: true,
          includeMarketAnalysis: false,
          includePriceAlerts: false
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação de transação:', error);
    return false;
  }
};
