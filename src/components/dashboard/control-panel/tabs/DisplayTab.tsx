
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';

interface DisplayTabProps {
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  refreshInterval: number[];
  setRefreshInterval: (value: number[]) => void;
  chartStyle: string;
  setChartStyle: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  handleSettingChange: (key: string, value: any) => void;
}

const DisplayTab: React.FC<DisplayTabProps> = ({
  autoRefresh,
  setAutoRefresh,
  refreshInterval,
  setRefreshInterval,
  chartStyle,
  setChartStyle,
  theme,
  setTheme,
  handleSettingChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-satotrack-neon" />
          <span className="text-sm">Auto Refresh</span>
        </div>
        <Switch 
          checked={autoRefresh} 
          onCheckedChange={(checked) => {
            setAutoRefresh(checked);
            handleSettingChange('autoRefresh', checked);
          }}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Intervalo de Atualização (segundos)</label>
        <Slider
          value={refreshInterval}
          onValueChange={(value) => {
            setRefreshInterval(value);
            handleSettingChange('refreshInterval', value[0]);
          }}
          max={30}
          min={1}
          step={1}
          className="w-full"
        />
        <span className="text-xs text-muted-foreground">{refreshInterval[0]}s</span>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Estilo do Gráfico</label>
        <Select value={chartStyle} onValueChange={(value) => {
          setChartStyle(value);
          handleSettingChange('chartStyle', value);
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Linha</SelectItem>
            <SelectItem value="area">Área</SelectItem>
            <SelectItem value="candle">Candlestick</SelectItem>
            <SelectItem value="bar">Barras</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tema</label>
        <Select value={theme} onValueChange={(value) => {
          setTheme(value);
          handleSettingChange('theme', value);
        }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Escuro</SelectItem>
            <SelectItem value="neon">Neon</SelectItem>
            <SelectItem value="bitcoin">Bitcoin</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DisplayTab;
