-- Fix unique constraint issue for user_settings table
-- This prevents the "duplicate key value violates unique constraint" error

-- First, let's clean up any duplicate user_settings records
-- Keep only the most recent record for each user
DELETE FROM user_settings 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id 
  FROM user_settings 
  ORDER BY user_id, updated_at DESC
);

-- Add UPSERT function for user_settings to prevent duplicates
CREATE OR REPLACE FUNCTION upsert_user_settings(
  p_user_id UUID,
  p_telegram_notifications_enabled BOOLEAN DEFAULT false,
  p_email_daily_summary BOOLEAN DEFAULT false,
  p_email_weekly_summary BOOLEAN DEFAULT false,
  p_push_notifications_enabled BOOLEAN DEFAULT false,
  p_price_alert_threshold INTEGER DEFAULT 5,
  p_balance_alert_threshold INTEGER DEFAULT 0,
  p_telegram_chat_id TEXT DEFAULT NULL
) RETURNS user_settings AS $$
DECLARE
  result_record user_settings;
BEGIN
  INSERT INTO user_settings (
    user_id,
    telegram_notifications_enabled,
    email_daily_summary,
    email_weekly_summary,
    push_notifications_enabled,
    price_alert_threshold,
    balance_alert_threshold,
    telegram_chat_id,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_telegram_notifications_enabled,
    p_email_daily_summary,
    p_email_weekly_summary,
    p_push_notifications_enabled,
    p_price_alert_threshold,
    p_balance_alert_threshold,
    p_telegram_chat_id,
    now(),
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    telegram_notifications_enabled = EXCLUDED.telegram_notifications_enabled,
    email_daily_summary = EXCLUDED.email_daily_summary,
    email_weekly_summary = EXCLUDED.email_weekly_summary,
    push_notifications_enabled = EXCLUDED.push_notifications_enabled,
    price_alert_threshold = EXCLUDED.price_alert_threshold,
    balance_alert_threshold = EXCLUDED.balance_alert_threshold,
    telegram_chat_id = EXCLUDED.telegram_chat_id,
    updated_at = now()
  RETURNING * INTO result_record;
  
  RETURN result_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION upsert_user_settings TO authenticated;