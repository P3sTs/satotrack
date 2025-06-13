
import { supabase } from '@/integrations/supabase/client';

const TELEGRAM_BOT_TOKEN = '7826526912:AAG-7hTgiBjGc_kWG7ev4ik96RmRnBORwesKf7yZPrpn7XsIuXVX9Ft1CN7oHUmrqszRKTl1jlERewYvWzWwhpQ8KBPaTwNWdFD'; // Deve ser movido para variável de ambiente

export const sendTelegramNotification = async (
  userId: string,
  message: string,
  alertType: string,
  details?: any
) => {
  try {
    // Obter chat_id do usuário
    const { data: settings } = await supabase
      .from('user_settings')
      .select('telegram_chat_id')
      .eq('user_id', userId)
      .single();

    if (!settings?.telegram_chat_id) {
      console.log('Chat ID do Telegram não configurado para o usuário');
      return false;
    }

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegram_chat_id,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Erro na API do Telegram:', result);
      return false;
    }

    console.log('Notificação Telegram enviada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação via Telegram:', error);
    return false;
  }
};

// Função para configurar webhook do Telegram (futura implementação)
export const setupTelegramWebhook = async (webhookUrl: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query']
      }),
    });

    const result = await response.json();
    console.log('Webhook do Telegram configurado:', result);
    return result.ok;
  } catch (error) {
    console.error('Erro ao configurar webhook do Telegram:', error);
    return false;
  }
};
