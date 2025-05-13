
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Function to check if push notifications are supported and enabled
export const checkPushNotificationsSupport = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Function to request push notification permission
export const requestPushPermission = async (): Promise<boolean> => {
  if (!checkPushNotificationsSupport()) {
    toast.error('Este navegador não suporta notificações push');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Function to send a browser notification
export const sendPushNotification = (
  title: string,
  options: NotificationOptions = {}
) => {
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      notification.onclick = function() {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
  
  return false;
};

// Function to log notification in the database
export const logNotification = async (
  userId: string,
  notificationType: string,
  status: 'sent' | 'failed' | 'skipped',
  details: any = {}
) => {
  try {
    await supabase.from('notification_logs').insert({
      user_id: userId,
      notification_type: notificationType,
      status,
      details
    });
    return true;
  } catch (error) {
    console.error('Error logging notification:', error);
    return false;
  }
};

// Function to send a Telegram notification via Edge Function
export const sendTelegramNotification = async (
  userId: string,
  message: string,
  notificationType: string,
  details: any = {}
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-telegram', {
      body: {
        user_id: userId,
        message,
        notification_type: notificationType,
        details
      }
    });

    if (error) throw error;
    return data.success;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

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
