
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import { AdvancedControlPanelProps } from './control-panel/types';
import { useControlPanelState } from './control-panel/hooks/useControlPanelState';
import DisplayTab from './control-panel/tabs/DisplayTab';
import AlertsTab from './control-panel/tabs/AlertsTab';
import AutomationTab from './control-panel/tabs/AutomationTab';
import AdvancedTab from './control-panel/tabs/AdvancedTab';

const AdvancedControlPanel: React.FC<AdvancedControlPanelProps> = ({ onSettingsChange }) => {
  const {
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    alertThreshold,
    setAlertThreshold,
    theme,
    setTheme,
    chartStyle,
    setChartStyle,
    notifications,
    setNotifications,
    advancedMode,
    setAdvancedMode,
  } = useControlPanelState(onSettingsChange);

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
            <DisplayTab
              autoRefresh={autoRefresh}
              setAutoRefresh={setAutoRefresh}
              refreshInterval={refreshInterval}
              setRefreshInterval={setRefreshInterval}
              chartStyle={chartStyle}
              setChartStyle={setChartStyle}
              theme={theme}
              setTheme={setTheme}
            />
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <AlertsTab
              notifications={notifications}
              setNotifications={setNotifications}
              alertThreshold={alertThreshold}
              setAlertThreshold={setAlertThreshold}
            />
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-4">
            <AutomationTab />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <AdvancedTab
              advancedMode={advancedMode}
              setAdvancedMode={setAdvancedMode}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedControlPanel;
