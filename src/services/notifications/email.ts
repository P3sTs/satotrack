
import { supabase } from '@/integrations/supabase/client';

// Function to send email summary via Edge Function
export const sendEmailSummary = async (
  userId: string,
  summaryType: 'daily' | 'weekly'
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email-summary', {
      body: {
        user_id: userId,
        summary_type: summaryType
      }
    });

    if (error) throw error;
    return data.success;
  } catch (error) {
    console.error(`Error sending ${summaryType} email summary:`, error);
    return false;
  }
};
