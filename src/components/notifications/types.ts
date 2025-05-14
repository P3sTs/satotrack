
export interface NotificationSettingsFormValues {
  telegram_chat_id: string;
  telegram_notifications_enabled: boolean;
  email_daily_summary: boolean;
  email_weekly_summary: boolean;
  push_notifications_enabled: boolean;
  price_alert_threshold: number;
  balance_alert_threshold: number;
}
