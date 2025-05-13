
import { supabase } from '@/integrations/supabase/client';

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
