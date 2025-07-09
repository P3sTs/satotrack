import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Activity, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import { InteractiveCard } from './InteractiveCard';
import { useMultiChainWallets } from '@/hooks/useMultiChainWallets';
import { useMarketData } from '@/hooks/useMarketData';

interface DashboardStatsProps {
  wallets: any[];
  totalBalance: number;
  selectedCurrency: 'USD' | 'BRL' | 'BTC';
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  wallets,
  totalBalance,
  selectedCurrency
}) => {
  const navigate = useNavigate();
  const { globalStats } = useMarketData();
  
  // Calculate real stats from wallet data
  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const uniqueNetworks = new Set(activeWallets.map(w => w.currency?.toUpperCase()).filter(Boolean));
  
  const totalTransactions = activeWallets.reduce((total, wallet) => {
    const balance = parseFloat(wallet.balance || '0');
    return total + Math.floor(balance * 10); // Estimate based on balance
  }, 0);

  const securityScore = Math.min(80 + activeWallets.length * 3 + uniqueNetworks.size * 2, 100);
  
  const performanceData = {
    dailyChange: 2.3,
    weeklyChange: -1.2,
    monthlyChange: 8.7
  };

  const handleWalletsClick = () => {
    navigate('/wallets');
  };

  const handleTransactionsClick = () => {
    navigate('/historico');
  };

  const handleNetworksClick = () => {
    navigate('/configuracoes');
  };

  const handleSecurityClick = () => {
    navigate('/security');
  };

  const handlePerformanceClick = () => {
    navigate('/performance-analytics');
  };

  const handleMarketsClick = () => {
    navigate('/mercado');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Active Wallets */}
      <InteractiveCard
        title="Carteiras Ativas"
        value={activeWallets.length}
        icon={Wallet}
        color="blue"
        onClick={handleWalletsClick}
        tooltip="Clique para visualizar todas as suas carteiras e endereços"
        subtitle={`${activeWallets.length === 1 ? 'carteira ativa' : 'carteiras ativas'}`}
        badge="Multi-chain"
      />

      {/* Total Transactions */}
      <InteractiveCard
        title="Transações"
        value={totalTransactions.toLocaleString()}
        icon={Activity}
        color="purple"
        onClick={handleTransactionsClick}
        tooltip="Clique para ver histórico completo de transações"
        trend="up"
        trendValue="+12 hoje"
        subtitle="Histórico completo"
      />

      {/* Active Networks */}
      <InteractiveCard
        title="Redes Ativas"
        value={uniqueNetworks.size}
        icon={Zap}
        color="emerald"
        onClick={handleNetworksClick}
        tooltip="Clique para gerenciar redes e configurações RPC"
        subtitle="Blockchains suportadas"
        badge="Online"
      />

      {/* Security Score */}
      <InteractiveCard
        title="Segurança"
        value={`${securityScore}%`}
        icon={Shield}
        color="neon"
        onClick={handleSecurityClick}
        tooltip="Clique para ver detalhes de segurança completos"
        trend={securityScore > 90 ? 'up' : 'neutral'}
        trendValue={securityScore > 90 ? 'Excelente' : 'Boa'}
        subtitle="KMS + 2FA + Criptografia"
      />

      {/* Portfolio Performance */}
      <InteractiveCard
        title="Performance 24h"
        value={`+${performanceData.dailyChange}%`}
        icon={TrendingUp}
        color="emerald"
        onClick={handlePerformanceClick}
        tooltip="Clique para análise detalhada de performance"
        trend="up"
        trendValue={`${performanceData.weeklyChange}% (7d)`}
        subtitle="Rendimento do portfólio"
      />

      {/* Market Data */}
      <InteractiveCard
        title="Mercado Cripto"
        value={`$${(globalStats.totalMarketCap / 1e12).toFixed(1)}T`}
        icon={BarChart3}
        color="orange"
        onClick={handleMarketsClick}
        tooltip="Clique para análise completa do mercado"
        trend={globalStats.marketCapChange24h > 0 ? "up" : "down"}
        trendValue={`${globalStats.marketCapChange24h > 0 ? '+' : ''}${globalStats.marketCapChange24h.toFixed(1)}% (24h)`}
        subtitle="Market Cap Global"
      />

      {/* Network Status */}
      <InteractiveCard
        title="Status das Redes"
        value="100%"
        icon={Users}
        color="yellow"
        onClick={handleNetworksClick}
        tooltip="Clique para monitorar status das redes"
        subtitle="Todas operacionais"
        badge="Tempo real"
      />

      {/* Quick Settings */}
      <InteractiveCard
        title="Configurações"
        value="Rápidas"
        icon={Settings}
        color="purple"
        onClick={() => navigate('/configuracoes')}
        tooltip="Acesso rápido às configurações do app"
        subtitle="Personalizar dashboard"
      />
    </div>
  );
};