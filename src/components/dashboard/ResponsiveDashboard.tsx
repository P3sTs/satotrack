import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Activity, 
  Globe, 
  Shield, 
  RefreshCw,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardCard } from './DashboardCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardStabilizer } from '@/hooks/useDashboardStabilizer';
import NativeHeader from '@/components/mobile/NativeHeader';
import NativeActionButtons from '@/components/mobile/NativeActionButtons';
import NativeTabs from '@/components/mobile/NativeTabs';
import CryptoListItem from '@/components/mobile/CryptoListItem';
import { WalletDetailsModal } from './WalletDetailsModal';
import { cn } from '@/lib/utils';

export const ResponsiveDashboard: React.FC = () => {
  const { stats, cryptoAssets, isOnline, refreshData } = useDashboardData();
  const [activeTab, setActiveTab] = useState('crypto');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const navigate = useNavigate();

  // Use the stabilizer hook to prevent unnecessary re-renders
  const stableStats = useDashboardStabilizer(stats);

  const tabs = [
    { id: 'crypto', label: 'Criptomoeda' },
    { id: 'nfts', label: 'NFTs' }
  ];

  const getSecurityColor = () => {
    return stableStats.securityScore > 80 ? 'success' : 'warning';
  };

  const dashboardCards = useMemo(() => [
    {
      title: 'Patrimônio Total',
      value: stableStats.totalBalance,
      change: stableStats.totalBalanceChange,
      icon: Wallet,
      color: 'primary' as const,
      route: '/dashboard/detalhado',
      prefix: 'R$ ',
      decimals: 2,
      showChange: true,
      badge: isOnline ? 'Online' : 'Offline',
    },
    {
      title: 'Carteiras Ativas',
      value: stableStats.activeWallets,
      icon: Activity,
      color: 'success' as const,
      route: '/carteiras',
      subtitle: 'Carteiras configuradas',
    },
    {
      title: 'Transações',
      value: stableStats.totalTransactions,
      icon: TrendingUp,
      color: 'info' as const,
      route: '/historico',
      subtitle: 'Total de transações',
    },
    {
      title: 'Redes Ativas',
      value: stableStats.activeNetworks,
      icon: Globe,
      color: 'warning' as const,
      route: '/mercado',
      subtitle: 'Blockchains conectadas',
    },
    {
      title: 'Segurança',
      value: stableStats.securityScore,
      icon: Shield,
      color: getSecurityColor() as 'success' | 'warning',
      route: '/configuracoes',
      suffix: '%',
      subtitle: 'Score de segurança',
    },
  ], [stableStats, isOnline]);

  const handleWalletClick = (wallet: any) => {
    setSelectedWallet(wallet);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="block md:hidden">
        <NativeHeader title="minha chave" />
      </div>

      {/* Desktop/Tablet Header */}
      <div className="hidden md:block p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Acompanhe seu patrimônio em tempo real
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
            
            <Button
              onClick={refreshData}
              disabled={stats.isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={cn(
                "w-4 h-4 mr-2",
                stats.isLoading && "animate-spin"
              )} />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 md:pt-0 px-4 md:px-6">
        {/* Balance Section - Mobile */}
        <div className="block md:hidden text-center py-8">
          <div className="text-4xl font-bold text-foreground mb-2">
            R$ {stableStats.totalBalance.toLocaleString('pt-BR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className={cn(
              "text-sm flex items-center",
              stableStats.totalBalanceChange >= 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {stableStats.totalBalanceChange >= 0 ? 
                <TrendingUp className="w-3 h-3 mr-1" /> : 
                <TrendingDown className="w-3 h-3 mr-1" />
              }
              {stableStats.totalBalanceChange >= 0 ? '+' : ''}{stableStats.totalBalanceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Dashboard Cards Grid - Desktop/Tablet */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              {...card}
              isLoading={stableStats.isLoading}
            />
          ))}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="block md:hidden">
          <NativeActionButtons />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <NativeTabs 
            tabs={tabs} 
            defaultTab="crypto"
            onTabChange={setActiveTab}
          />
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {/* Crypto List */}
          {activeTab === 'crypto' && (
            <div className="divide-y divide-border/20">
              {cryptoAssets.map((crypto, index) => (
                <div 
                  key={index} 
                  onClick={() => handleWalletClick({
                    symbol: crypto.symbol,
                    name: crypto.name,
                    address: `${crypto.symbol.toLowerCase()}1234...abcd`,
                    balance: parseFloat(crypto.amount?.toString() || '0'),
                    value: parseFloat(crypto.value?.toString() || '0'),
                    change: parseFloat(crypto.change?.toString() || '0'),
                    network: crypto.network,
                    icon: crypto.icon
                  })}
                  className="cursor-pointer"
                >
                  <CryptoListItem
                    symbol={crypto.symbol}
                    name={crypto.name}
                    network={crypto.network}
                    price={crypto.price?.toString() || '0'}
                    change={crypto.change}
                    amount={crypto.amount?.toString() || '0'}
                    value={crypto.value?.toString() || '0'}
                    icon={crypto.icon}
                  />
                </div>
              ))}
              
              {cryptoAssets.length === 0 && !stableStats.isLoading && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Nenhuma criptomoeda encontrada
                  </p>
                  <Button 
                    onClick={() => navigate('/carteiras')}
                    className="mt-4"
                    variant="outline"
                  >
                    Adicionar Carteiras
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* NFTs Tab */}
          {activeTab === 'nfts' && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Nenhum NFT encontrado</p>
              <Button 
                onClick={() => navigate('/mercado')}
                className="mt-4"
                variant="outline"
              >
                Explorar NFTs
              </Button>
            </div>
          )}
        </div>
      </div>


      {/* Wallet Details Modal */}
      <WalletDetailsModal
        isOpen={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        wallet={selectedWallet || {}}
      />

    </div>
  );
};