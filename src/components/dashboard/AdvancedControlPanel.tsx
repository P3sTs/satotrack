
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Target, 
  Zap, 
  Shield, 
  Eye, 
  Bell,
  Palette,
  Activity,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface AdvancedControlPanelProps {
  onSettingsChange: (settings: any) => void;
}

const AdvancedControlPanel: React.FC<AdvancedControlPanelProps> = ({ onSettingsChange }) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState([2]);
  const [alertThreshold, setAlertThreshold] = useState([5]);
  const [theme, setTheme] = useState('dark');
  const [chartStyle, setChartStyle] = useState('line');
  const [notifications, setNotifications] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { [key]: value };
    onSettingsChange(newSettings);
  };

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-satotrack-neon">
          <Settings className="h-5 w-5" />
          Painel de Controle Avançado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="display">Exibição</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="display" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-satotrack-neon" />
                  <span className="text-sm">Notificações Ativas</span>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={(checked) => {
                    setNotifications(checked);
                    handleSettingChange('notifications', checked);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Limite de Alerta (%)</label>
                <Slider
                  value={alertThreshold}
                  onValueChange={(value) => {
                    setAlertThreshold(value);
                    handleSettingChange('alertThreshold', value[0]);
                  }}
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
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-4">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-satotrack-neon/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Auto-Trade (Premium)</span>
                  <Badge variant="outline" className="text-xs">Em Breve</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure estratégias automáticas baseadas em indicadores técnicos
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/50 border border-satotrack-neon/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Rebalanceamento</span>
                  <Badge variant="outline" className="text-xs">Premium</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Rebalanceamento automático do portfólio baseado em regras
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-satotrack-neon" />
                  <span className="text-sm">Modo Avançado</span>
                </div>
                <Switch 
                  checked={advancedMode} 
                  onCheckedChange={(checked) => {
                    setAdvancedMode(checked);
                    handleSettingChange('advancedMode', checked);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <TrendingUp className="h-3 w-3 mr-2" />
                  Análise Técnica Avançada
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Palette className="h-3 w-3 mr-2" />
                  Personalizar Interface
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Settings className="h-3 w-3 mr-2" />
                  API Management
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedControlPanel;
