
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { NotificationSettingsFormValues } from '../types';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { sendTelegramNotification } from '@/services/notifications';
import { useAuth } from '@/contexts/auth';

const TelegramChannel = () => {
  const { register, watch, setValue, formState: { isSubmitting } } = useFormContext<NotificationSettingsFormValues>();
  const { user } = useAuth();
  const telegramEnabled = watch('telegram_notifications_enabled');
  const telegramChatId = watch('telegram_chat_id');
  const [isTesting, setIsTesting] = useState(false);
  
  const handleConnectBot = () => {
    window.open('https://t.me/satotrack_bot', '_blank');
  };
  
  const sendTestMessage = async () => {
    if (!user || !telegramChatId) return;
    
    setIsTesting(true);
    try {
      const success = await sendTelegramNotification(
        user.id,
        'Esta é uma mensagem de teste do SatoTrack. Suas notificações via Telegram estão funcionando corretamente!',
        'test_notification'
      );
      
      if (success) {
        toast.success('Mensagem de teste enviada com sucesso!');
      } else {
        toast.error('Falha ao enviar mensagem de teste. Verifique seu ID do Telegram e tente novamente.');
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('Erro ao enviar mensagem de teste.');
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="telegram-enabled" className="font-medium">Notificações via Telegram</Label>
          <p className="text-sm text-muted-foreground">Receba alertas diretamente no Telegram</p>
        </div>
        <Switch 
          id="telegram-enabled"
          checked={telegramEnabled}
          onCheckedChange={(checked) => setValue('telegram_notifications_enabled', checked)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="telegram-id">ID do Telegram</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input 
            id="telegram-id"
            placeholder="@seu_username" 
            {...register('telegram_chat_id')}
            disabled={isSubmitting || !telegramEnabled}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleConnectBot}
          >
            Conectar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Inicie uma conversa com nosso bot: @satotrack_bot
        </p>
      </div>
      
      {telegramEnabled && telegramChatId && (
        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={sendTestMessage}
            disabled={isTesting || !telegramChatId || isSubmitting}
            className="w-full"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Enviar mensagem de teste
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TelegramChannel;
