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
import { useCarteiras } from '@/contexts/carteiras';
import { useAuth } from '@/contexts/auth';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { Bitcoin, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import FloatingSatoAI from './chat/FloatingSatoAI';
import AchievementsSystem from '@/components/gamification/AchievementsSystem';
import ProfitLossProjection from '@/components/projecao/ProfitLossProjection';
import WalletComparison from '@/components/wallet/WalletComparison';

const FinancialDashboard: React.FC = () => {
  const { carteiras, adicionarCarteira } = useCarteiras();
  const { userPlan } = useAuth();
  const { data: bitcoinData } = useBitcoinPrice();
  const [dashboardSettings, setDashboardSettings] = useState({
    autoRefresh: true,
    refreshInterval: 2,
    chartStyle: 'line',
    theme: 'dark',
    notifications: true,
    alertThreshold: 5,
    advancedMode: false
  });

  // Calculate wallet limit based on user plan
  const isPremium = userPlan === 'premium';
  const walletLimit = isPremium ? null : 1;
  const carteiraLimitReached = !isPremium && carteiras.length >= 1;

  const handleSettingsChange = (newSettings: any) => {
    setDashboardSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleNewWallet = () => {
    // Esta função seria implementada para abrir modal de nova carteira
    console.log('Nova carteira');
  };

  // Calcular valores totais using correct property names
  const totalBalance = carteiras.reduce((acc, carteira) => acc + carteira.saldo, 0);
  const totalReceived = carteiras.reduce((acc, carteira) => acc + (carteira.total_recebido || 0), 0);
  const totalSent = carteiras.reduce((acc, carteira) => acc + (carteira.total_enviado || 0), 0);

  const primaryWallet = carteiras.length > 0 ? carteiras[0] : null;

  return (
    <GamificationProvider>
      <div className="space-y-6">
        <DashboardHeader 
          onNewWallet={handleNewWallet}
          reachedLimit={carteiraLimitReached}
        />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="tools">Ferramentas</TabsTrigger>
            <TabsTrigger value="projections">Projeções</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {primaryWallet && <PrimaryWallet wallet={primaryWallet} />}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <RealTimeBalanceCard
                    title="Saldo Total"
                    value={totalBalance}
                    fiatValue={totalBalance * (bitcoinData?.price_brl || 0)}
                    currency="BRL"
                    icon={Bitcoin}
                    trend="positive"
                    bitcoinData={bitcoinData}
                  />
                  <RealTimeBalanceCard
                    title="Total Recebido"
                    value={totalReceived}
                    fiatValue={totalReceived * (bitcoinData?.price_brl || 0)}
                    currency="BRL"
                    icon={TrendingUp}
                    trend="positive"
                    bitcoinData={bitcoinData}
                  />
                  <RealTimeBalanceCard
                    title="Carteiras Ativas"
                    value={carteiras.length}
                    fiatValue={0}
                    currency="BRL"
                    icon={Wallet}
                    trend="neutral"
                    isCount={true}
                  />
                </div>
                <QuickActionsPanel />
                <MarketOverview currency="BRL" />
                <TransactionSummary carteiras={carteiras} currency="BRL" />
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
          
          <TabsContent value="projections" className="space-y-6">
            <ProfitLossProjection />
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6">
            <WalletComparison />
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6">
            <AchievementsSystem />
          </TabsContent>
        </Tabs>
        
        {/* SatoAI Floating Chat */}
        <FloatingSatoAI />
      </div>
    </GamificationProvider>
  );
};

export default FinancialDashboard;
