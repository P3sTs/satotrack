
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from './DashboardHeader';
import PrimaryWallet from './PrimaryWallet';
import QuickActionsPanel from './QuickActionsPanel';
import RealTimeBalanceCard from './RealTimeBalanceCard';
import MarketOverview from './MarketOverview';
import TransactionSummary from './TransactionSummary';
import InteractiveWidgets from './InteractiveWidgets';
import ImmersiveTools from './ImmersiveTools';
import AdvancedControlPanel from './AdvancedControlPanel';
import AchievementsPanel from './AchievementsPanel';
import StaticChart from './StaticChart';
import { GamificationProvider } from '@/contexts/gamification/GamificationContext';

const FinancialDashboard: React.FC = () => {
  const [dashboardSettings, setDashboardSettings] = useState({
    autoRefresh: true,
    refreshInterval: 2,
    chartStyle: 'line',
    theme: 'dark',
    notifications: true,
    alertThreshold: 5,
    advancedMode: false
  });

  const handleSettingsChange = (newSettings: any) => {
    setDashboardSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <GamificationProvider>
      <div className="space-y-6">
        <DashboardHeader />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="tools">Ferramentas</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PrimaryWallet />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RealTimeBalanceCard />
                  <QuickActionsPanel />
                </div>
                <MarketOverview />
                <TransactionSummary />
              </div>
              
              <div className="space-y-6">
                <StaticChart 
                  title="Bitcoin Price (24h)" 
                  type="area" 
                  color="#f7931a"
                  height={300}
                />
                <StaticChart 
                  title="Portfolio Balance" 
                  type="line" 
                  color="#00d4ff"
                  height={200}
                />
                <AdvancedControlPanel onSettingsChange={handleSettingsChange} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="widgets" className="space-y-6">
            <InteractiveWidgets />
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-6">
            <ImmersiveTools />
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AchievementsPanel />
              <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
                <CardHeader>
                  <CardTitle className="text-satotrack-neon">Estatísticas de Gamificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <div className="text-2xl font-bold text-satotrack-neon">Nível 1</div>
                        <div className="text-sm text-muted-foreground">Nível Atual</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <div className="text-2xl font-bold text-green-500">0 XP</div>
                        <div className="text-sm text-muted-foreground">Experiência</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Próximo nível em 100 XP
                      </div>
                      <div className="w-full bg-muted/20 rounded-full h-2">
                        <div className="bg-satotrack-neon h-2 rounded-full w-0 transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GamificationProvider>
  );
};

export default FinancialDashboard;
