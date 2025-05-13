
import { supabase } from '@/integrations/supabase/client';
import { sendPushNotification } from './push';
import { sendTelegramNotification } from './telegram';
import { logNotification } from './logger';

// Re-export the logNotification function so it's available from alerts.ts
export { logNotification };

// Function to handle price alert notifications
export const sendPriceAlert = async (
  userId: string, 
  priceChange: number,
  currentPrice: number
) => {
  try {
    // Get user notification settings
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!settings) return false;
    
    // Check if price change exceeds threshold
    const threshold = settings.price_alert_threshold || 5;
    if (Math.abs(priceChange) < threshold) return false;
    
    const direction = priceChange > 0 ? 'subiu' : 'caiu';
    const message = `O preço do Bitcoin ${direction} ${Math.abs(priceChange).toFixed(2)}% nas últimas 24h. Valor atual: $${currentPrice.toLocaleString('pt-BR')}`;
    
    const details = {
      percentage: Math.abs(priceChange).toFixed(2),
      direction: priceChange > 0 ? 'up' : 'down',
      current_price: currentPrice
    };
    
    // Send push notification if enabled
    if (settings.push_notifications_enabled && Notification.permission === 'granted') {
      const icon = priceChange > 0 ? '📈' : '📉';
      sendPushNotification(`${icon} Alerta de preço Bitcoin`, {
        body: message,
        tag: 'price-alert'
      });
      
      await logNotification(userId, 'price_alert', 'sent', details);
    }
    
    // Send Telegram notification if enabled
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(
        userId,
        message,
        'price_alert',
        details
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error sending price alert:', error);
    return false;
  }
};

// Function to notify about transaction in wallet
export const sendTransactionNotification = async (
  userId: string,
  walletName: string,
  amount: number,
  type: 'received' | 'sent'
) => {
  try {
    // Get user notification settings
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!settings) return false;
    
    // Check if amount exceeds threshold
    const threshold = settings.balance_alert_threshold || 0;
    if (amount < threshold) return false;
    
    const action = type === 'received' ? 'recebeu' : 'enviou';
    const icon = type === 'received' ? '💰' : '💸';
    const message = `Sua carteira ${walletName} ${action} ${amount} BTC`;
    
    const details = {
      wallet_name: walletName,
      amount,
      type
    };
    
    // Send push notification if enabled
    if (settings.push_notifications_enabled && Notification.permission === 'granted') {
      sendPushNotification(`${icon} Transação Bitcoin`, {
        body: message,
        tag: `transaction-${type}`
      });
      
      await logNotification(userId, `transaction_${type}`, 'sent', details);
    }
    
    // Send Telegram notification if enabled
    if (settings.telegram_notifications_enabled && settings.telegram_chat_id) {
      await sendTelegramNotification(
        userId,
        message,
        `transaction_${type}`,
        details
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error sending transaction notification:', error);
    return false;
  }
};
