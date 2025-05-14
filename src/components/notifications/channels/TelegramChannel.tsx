
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { NotificationSettingsFormValues } from '../types';

const TelegramChannel = () => {
  const { register, watch, setValue } = useFormContext<NotificationSettingsFormValues>();
  const telegramEnabled = watch('telegram_notifications_enabled');
  
  return (
    <div className="border rounded-md p-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="telegram-enabled">Notificações via Telegram</Label>
        <Switch 
          id="telegram-enabled"
          checked={telegramEnabled}
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
  );
};

export default TelegramChannel;
