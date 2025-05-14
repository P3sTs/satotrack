
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { NotificationSettingsFormValues } from '../types';

const BalanceAlertThreshold = () => {
  const { watch, setValue } = useFormContext<NotificationSettingsFormValues>();
  const balanceAlertValue = watch('balance_alert_threshold');
  
  return (
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
  );
};

export default BalanceAlertThreshold;
