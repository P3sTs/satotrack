
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface NotificationSettings {
  telegram_chat_id: string;
  telegram_notifications_enabled: boolean;
  email_daily_summary: boolean;
  email_weekly_summary: boolean;
  push_notifications_enabled: boolean;
  price_alert_threshold: number;
  balance_alert_threshold: number;
}

const NotificationSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<NotificationSettings>({
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

  const priceAlertValue = watch('price_alert_threshold');
  const balanceAlertValue = watch('balance_alert_threshold');
  
  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw error;
        }
        
        if (data) {
          // Update form with existing settings
          setValue('telegram_chat_id', data.telegram_chat_id || '');
          setValue('telegram_notifications_enabled', data.telegram_notifications_enabled || false);
          setValue('email_daily_summary', data.email_daily_summary || false);
          setValue('email_weekly_summary', data.email_weekly_summary || false);
          setValue('push_notifications_enabled', data.push_notifications_enabled || false);
          setValue('price_alert_threshold', data.price_alert_threshold || 5);
          setValue('balance_alert_threshold', data.balance_alert_threshold || 0);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas configurações de notificação",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [user, setValue, toast]);
  
  const onSubmit = async (data: NotificationSettings) => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Upsert user settings
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de notificação foram atualizadas",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas configurações",
        variant: "destructive"
      });
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
          setValue('push_notifications_enabled', true);
          toast({
            title: "Notificações ativadas",
            description: "Você receberá alertas push no seu navegador",
          });
        } else {
          setValue('push_notifications_enabled', false);
          toast({
            title: "Permissão negada",
            description: "Você precisará habilitar notificações nas configurações do navegador",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Não suportado",
          description: "Seu navegador não suporta notificações push",
          variant: "destructive"
        });
        setValue('push_notifications_enabled', false);
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
    }
  };
  
  if (loading) {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Canais de Notificação</h3>
            
            {/* Telegram settings */}
            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="telegram-enabled">Notificações via Telegram</Label>
                <Switch 
                  id="telegram-enabled"
                  {...register('telegram_notifications_enabled')} 
                  checked={watch('telegram_notifications_enabled')}
                  onCheckedChange={(checked) => setValue('telegram_notifications_enabled', checked)}
                />
              </div>
              
              <div>
                <Label htmlFor="telegram-id">ID do Telegram</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    id="telegram-id"
                    placeholder="@seu_username" 
                    {...register('telegram_chat_id')}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://t.me/satotrack_bot', '_blank')}
                  >
                    Conectar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Inicie uma conversa com nosso bot: @satotrack_bot
                </p>
              </div>
            </div>
            
            {/* Email settings */}
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Resumos por Email</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-summary">Resumo Diário</Label>
                <Switch 
                  id="daily-summary"
                  {...register('email_daily_summary')}
                  checked={watch('email_daily_summary')}
                  onCheckedChange={(checked) => setValue('email_daily_summary', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-summary">Resumo Semanal</Label>
                <Switch 
                  id="weekly-summary"
                  {...register('email_weekly_summary')}
                  checked={watch('email_weekly_summary')}
                  onCheckedChange={(checked) => setValue('email_weekly_summary', checked)}
                />
              </div>
            </div>
            
            {/* Push notification settings */}
            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-enabled">Notificações Push no Navegador</Label>
                <Switch 
                  id="push-enabled"
                  {...register('push_notifications_enabled')}
                  checked={watch('push_notifications_enabled')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      requestPushPermission();
                    } else {
                      setValue('push_notifications_enabled', false);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Receba alertas mesmo quando não estiver usando o aplicativo
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Sensibilidade dos Alertas</h3>
            
            {/* Price threshold */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="price-threshold">Alerta de Variação de Preço</Label>
                <span className="text-sm font-medium">{priceAlertValue}%</span>
              </div>
              <Slider
                id="price-threshold"
                min={1}
                max={20}
                step={1}
                value={[priceAlertValue]}
                onValueChange={(values) => setValue('price_alert_threshold', values[0])}
              />
              <p className="text-xs text-muted-foreground">
                Notificar quando o preço do Bitcoin variar mais que {priceAlertValue}%
              </p>
            </div>
            
            {/* Balance threshold */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="balance-threshold">Alerta de Mudança de Saldo</Label>
                <span className="text-sm font-medium">{balanceAlertValue} BTC</span>
              </div>
              <Slider
                id="balance-threshold"
                min={0}
                max={1}
                step={0.01}
                value={[balanceAlertValue]}
                onValueChange={(values) => setValue('balance_alert_threshold', values[0])}
              />
              <p className="text-xs text-muted-foreground">
                {balanceAlertValue === 0 
                  ? "Notificar sobre qualquer movimentação na carteira" 
                  : `Notificar apenas movimentações maiores que ${balanceAlertValue} BTC`}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar Preferências
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NotificationSettings;
