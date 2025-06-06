
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Bitcoin,
  RefreshCw,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  PieChart,
  Download,
  Settings,
  Globe
} from 'lucide-react';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { useAuth } from '@/contexts/auth';
import { formatBitcoinValue, formatCurrency } from '@/utils/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeBalanceCard from './RealTimeBalanceCard';
import ProfitLossIndicator from './ProfitLossIndicator';
import TransactionSummary from './TransactionSummary';
import BalanceProjection from './BalanceProjection';
import QuickActionsPanel from './QuickActionsPanel';
import MarketOverview from './MarketOverview';
import AdvancedControlPanel from './AdvancedControlPanel';
import InteractiveWidgets from './InteractiveWidgets';
import StaticChart from './StaticChart';
import ImmersiveTools from './ImmersiveTools';

interface FinancialDashboardProps {
  refreshInterval?: number;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ 
  refreshInterval = 2000 
}) => {
  const { carteiras, carteiraPrincipal, atualizarCarteira } = useCarteiras();
  const { data: bitcoinData, isRefreshing, refresh } = useBitcoinPrice();
  const { user, userPlan } = useAuth();
  const [currency, setCurrency] = useState<'BRL' | 'USD'>('BRL');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [dashboardSettings, setDashboardSettings] = useState({
    autoRefresh: true,
    refreshInterval: 2,
    chartStyle: 'line',
    theme: 'dark',
    notifications: true,
    alertThreshold: 5,
    advancedMode: false
  });

  // Get primary wallet
  const primaryWallet = carteiras.find(c => c.id === carteiraPrincipal) || carteiras[0];

  // Auto-refresh balance every 2 seconds
  useEffect(() => {
    if (!dashboardSettings.autoRefresh || !primaryWallet) return;

    const interval = setInterval(() => {
      if (primaryWallet) {
        atualizarCarteira(primaryWallet.id);
      }
      refresh();
    }, dashboardSettings.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [primaryWallet, dashboardSettings.autoRefresh, dashboardSettings.refreshInterval, atualizarCarteira, refresh]);

  // Calculate total portfolio values
  const totalBalance = carteiras.reduce((sum, wallet) => sum + wallet.saldo, 0);
  const totalReceived = carteiras.reduce((sum, wallet) => sum + wallet.total_entradas, 0);
  const totalSent = carteiras.reduce((sum, wallet) => sum + wallet.total_saidas, 0);
  
  const fiatValueBRL = totalBalance * (bitcoinData?.price_brl || 0);
  const fiatValueUSD = totalBalance * (bitcoinData?.price_usd || 0);
  
  const displayValue = currency === 'BRL' ? fiatValueBRL : fiatValueUSD;
  const exchangeRate = bitcoinData?.price_brl && bitcoinData?.price_usd 
    ? bitcoinData.price_brl / bitcoinData.price_usd 
    : 5.5;

  const handleSettingsChange = (newSettings: any) => {
    setDashboardSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="space-y-6">
      {/* Header with currency toggle and auto-refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-orbitron satotrack-gradient-text">
            Dashboard Imersivo
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo ao futuro do trading, {user?.email?.split('@')[0] || 'Trader'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={currency === 'BRL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrency('BRL')}
            className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            🇧🇷 BRL
          </Button>
          <Button
            variant={currency === 'USD' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrency('USD')}
            className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            🇺🇸 USD
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`border-satotrack-neon/50 ${isAutoRefresh ? 'bg-green-500/20 text-green-400' : 'text-satotrack-neon'}`}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Interactive Widgets */}
      <InteractiveWidgets />

      {/* Real-time balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeBalanceCard
          title="Saldo Total"
          value={totalBalance}
          fiatValue={displayValue}
          currency={currency}
          icon={Wallet}
          trend="positive"
          bitcoinData={bitcoinData}
        />
        
        <RealTimeBalanceCard
          title="Total Recebido"
          value={totalReceived}
          fiatValue={totalReceived * (currency === 'BRL' ? bitcoinData?.price_brl || 0 : bitcoinData?.price_usd || 0)}
          currency={currency}
          icon={ArrowUpCircle}
          trend="positive"
          bitcoinData={bitcoinData}
        />
        
        <RealTimeBalanceCard
          title="Total Enviado"
          value={totalSent}
          fiatValue={totalSent * (currency === 'BRL' ? bitcoinData?.price_brl || 0 : bitcoinData?.price_usd || 0)}
          currency={currency}
          icon={ArrowDownCircle}
          trend="negative"
          bitcoinData={bitcoinData}
        />
        
        <RealTimeBalanceCard
          title="Carteiras Ativas"
          value={carteiras.length}
          fiatValue={0}
          currency={currency}
          icon={BarChart3}
          trend="neutral"
          isCount={true}
          bitcoinData={bitcoinData}
        />
      </div>

      {/* Advanced Control Panel */}
      <AdvancedControlPanel onSettingsChange={handleSettingsChange} />

      {/* Static Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <StaticChart 
          title="Preço do Bitcoin (24h)"
          type="area"
          color="#f7931a"
          height={180}
        />
        <StaticChart 
          title="Volume de Trading"
          type="line"
          color="#00d4ff"
          height={180}
        />
        <StaticChart 
          title="Evolução do Portfólio"
          type="area"
          color="#00ff88"
          height={180}
        />
      </div>

      {/* Immersive Tools */}
      <ImmersiveTools />

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Charts and analytics */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="balance" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-dashboard-dark border border-satotrack-neon/20">
              <TabsTrigger value="balance" className="data-[state=active]:bg-satotrack-neon data-[state=active]:text-black">Evolução do Saldo</TabsTrigger>
              <TabsTrigger value="distribution" className="data-[state=active]:bg-satotrack-neon data-[state=active]:text-black">Distribuição</TabsTrigger>
              <TabsTrigger value="projection" className="data-[state=active]:bg-satotrack-neon data-[state=active]:text-black">Projeção</TabsTrigger>
            </TabsList>
            
            <TabsContent value="balance" className="mt-4">
              <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-satotrack-neon">
                    <TrendingUp className="h-5 w-5" />
                    Evolução do Saldo (Linha)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfitLossIndicator 
                    carteiras={carteiras}
                    bitcoinData={bitcoinData}
                    currency={currency}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution" className="mt-4">
              <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-satotrack-neon">
                    <PieChart className="h-5 w-5" />
                    Distribuição dos Fundos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionSummary 
                    carteiras={carteiras}
                    bitcoinData={bitcoinData}
                    currency={currency}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projection" className="mt-4">
              <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-satotrack-neon">
                    <BarChart3 className="h-5 w-5" />
                    Projeção de Saldo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BalanceProjection 
                    carteiras={carteiras}
                    bitcoinData={bitcoinData}
                    currency={currency}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Quick actions and market */}
        <div className="space-y-6">
          <QuickActionsPanel />
          
          <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-satotrack-neon">
                <Globe className="h-5 w-5" />
                Mercado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketOverview currency={currency} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
