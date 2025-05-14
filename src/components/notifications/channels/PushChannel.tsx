
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { NotificationSettingsFormValues } from '../types';

interface PushChannelProps {
  requestPushPermission: () => Promise<void>;
}

const PushChannel: React.FC<PushChannelProps> = ({ requestPushPermission }) => {
  const { watch, setValue } = useFormContext<NotificationSettingsFormValues>();
  const pushEnabled = watch('push_notifications_enabled');
  
  return (
    <div className="border rounded-md p-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="push-enabled">Notificações Push no Navegador</Label>
        <Switch 
          id="push-enabled"
          checked={pushEnabled}
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
  );
};

export default PushChannel;
