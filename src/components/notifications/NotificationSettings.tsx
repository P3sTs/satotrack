
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import { NotificationSettingsFormValues } from './types';
import { useNotificationData } from '@/hooks/useNotificationData';

// Import our new components
import TelegramChannel from './channels/TelegramChannel';
import EmailChannel from './channels/EmailChannel';
import PushChannel from './channels/PushChannel';
import PriceAlertThreshold from './thresholds/PriceAlertThreshold';
import BalanceAlertThreshold from './thresholds/BalanceAlertThreshold';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { settings, updateSettings, isLoading } = useNotificationData();
  const [saving, setSaving] = useState(false);
  
  const methods = useForm<NotificationSettingsFormValues>({
    defaultValues: {
      telegram_chat_id: '',
      telegram_notifications_enabled: false,
      email_daily_summary: false,
      email_weekly_summary: false,
      push_notifications_enabled: false,
      price_alert_threshold: 5,
      balance_alert_threshold: 0
    }
  });
  
  // Update form when settings change
  useEffect(() => {
    if (settings) {
      methods.reset({
        telegram_chat_id: settings.telegram_chat_id || '',
        telegram_notifications_enabled: settings.telegram_notifications_enabled,
        email_daily_summary: settings.email_daily_summary,
        email_weekly_summary: settings.email_weekly_summary,
        push_notifications_enabled: settings.push_notifications_enabled,
        price_alert_threshold: settings.price_alert_threshold,
        balance_alert_threshold: settings.balance_alert_threshold
      });
    }
  }, [settings, methods]);
  
  const onSubmit = async (data: NotificationSettingsFormValues) => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateSettings(data);
      toast.success("Configurações salvas com sucesso");
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error("Não foi possível salvar suas configurações");
    } finally {
      setSaving(false);
    }
  };
  
  // Handle push notification permission
  const requestPushPermission = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          methods.setValue('push_notifications_enabled', true);
          toast.success("Notificações ativadas");
        } else {
          methods.setValue('push_notifications_enabled', false);
          toast.error("Permissão negada. Você precisará habilitar notificações nas configurações do navegador");
        }
      } else {
        toast.error("Seu navegador não suporta notificações push");
        methods.setValue('push_notifications_enabled', false);
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>
          Configure como e quando você deseja receber alertas sobre sua carteira
        </CardDescription>
      </CardHeader>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Canais de Notificação</h3>
              <TelegramChannel />
              <EmailChannel />
              <PushChannel requestPushPermission={requestPushPermission} />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Sensibilidade dos Alertas</h3>
              <PriceAlertThreshold />
              <BalanceAlertThreshold />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar Preferências
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
};

export default NotificationSettings;
