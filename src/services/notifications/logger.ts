
import { supabase } from '@/integrations/supabase/client';

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
