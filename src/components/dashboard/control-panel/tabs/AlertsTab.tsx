
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Bell, Target, AlertTriangle } from 'lucide-react';

interface AlertsTabProps {
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  alertThreshold: number[];
  setAlertThreshold: (value: number[]) => void;
}

const AlertsTab: React.FC<AlertsTabProps> = ({
  notifications,
  setNotifications,
  alertThreshold,
  setAlertThreshold,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-satotrack-neon" />
          <span className="text-sm">Notificações Ativas</span>
        </div>
        <Switch 
          checked={notifications} 
          onCheckedChange={setNotifications}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Limite de Alerta (%)</label>
        <Slider
          value={alertThreshold}
          onValueChange={setAlertThreshold}
          max={50}
          min={1}
          step={1}
          className="w-full"
        />
        <span className="text-xs text-muted-foreground">±{alertThreshold[0]}%</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
          <Target className="h-3 w-3 mr-1" />
          Alerta Ganho
        </Button>
        <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Alerta Perda
        </Button>
      </div>
    </div>
  );
};

export default AlertsTab;
