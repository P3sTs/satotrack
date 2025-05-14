
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { NotificationSettingsFormValues } from '../types';

const EmailChannel = () => {
  const { register, watch, setValue } = useFormContext<NotificationSettingsFormValues>();
  
  return (
    <div className="border rounded-md p-4 space-y-2">
      <h4 className="font-medium">Resumos por Email</h4>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="daily-summary">Resumo Diário</Label>
        <Switch 
          id="daily-summary"
          checked={watch('email_daily_summary')}
          onCheckedChange={(checked) => setValue('email_daily_summary', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="weekly-summary">Resumo Semanal</Label>
        <Switch 
          id="weekly-summary"
          checked={watch('email_weekly_summary')}
          onCheckedChange={(checked) => setValue('email_weekly_summary', checked)}
        />
      </div>
    </div>
  );
};

export default EmailChannel;
