
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { NotificationSettingsFormValues } from '../types';

const PriceAlertThreshold = () => {
  const { watch, setValue } = useFormContext<NotificationSettingsFormValues>();
  const priceAlertValue = watch('price_alert_threshold');
  
  return (
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
  );
};

export default PriceAlertThreshold;
