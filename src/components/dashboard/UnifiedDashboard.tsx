
import React, { useState, useMemo, useEffect } from 'react';
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
  TrendingDown,
  Plus,
  Settings,
  Layers,
  Coins,
  BarChart3,
  History,
  ArrowLeftRight
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCard } from './DashboardCard';
import { WalletDetailsModal } from './WalletDetailsModal';
import { useUnifiedDashboard } from '@/hooks/useUnifiedDashboard';
import { useCryptoCardOrder } from '@/hooks/useCryptoCardOrder';
import { useAuth } from '@/contexts/auth';
import NativeHeader from '@/components/mobile/NativeHeader';
import NativeActionButtons from '@/components/mobile/NativeActionButtons';
import DraggableCryptoListItem from '@/components/mobile/DraggableCryptoListItem';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Web3 Components
import { CryptoDashboardStats } from '@/components/crypto/dashboard/CryptoDashboardStats';
import { CryptoWalletsGrid } from '@/components/crypto/dashboard/CryptoWalletsGrid';
import { CryptoSecurityNotice } from '@/components/crypto/dashboard/CryptoSecurityNotice';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const UnifiedDashboard: React.FC = () => {
  const { 
    stats, 
    cryptoAssets, 
    wallets,
    isOnline, 
    isRefreshing,
    hasGeneratedWallets,
    refreshAll,
    loadWallets
  } = useUnifiedDashboard();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // Use the card order hook for drag-and-drop functionality
  const { orderedAssets, reorderCards } = useCryptoCardOrder(cryptoAssets);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const supportedCurrencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL'];

  const getSecurityColor = () => {
    return stats.securityScore > 80 ? 'success' : 'warning';
  };

  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const pendingWallets = wallets.filter(w => w.address === 'pending_generation');

  const shouldShowGenerateButton = wallets.length === 0 || 
    (wallets.length > 0 && wallets.every(w => w.address === 'pending_generation'));

  const dashboardCards = useMemo(() => [
    {
      title: 'Patrimônio Total',
      value: stats.totalBalance,
      change: stats.totalBalanceChange,
      icon: Wallet,
      color: 'primary' as const,
      route: '/dashboard/detalhado',
      prefix: 'R$ ',
      decimals: 2,
      showChange: true,
      badge: isOnline ? 'Online' : 'Offline',
    },
    {
      title: 'Carteiras Web3',
      value: activeWallets.length,
      icon: Layers,
      color: 'success' as const,
      route: '/carteiras',
      subtitle: 'Carteiras conectadas',
    },
    {
      title: 'Transações',
      value: stats.totalTransactions,
      icon: TrendingUp,
      color: 'info' as const,
      route: '/historico',
      subtitle: 'Total de transações',
    },
    {
      title: 'Redes Ativas',
      value: supportedCurrencies.length,
      icon: Globe,
      color: 'warning' as const,
      route: '/mercado',
      subtitle: 'Blockchains suportadas',
    },
    {
      title: 'Segurança',
      value: stats.securityScore,
      icon: Shield,
      color: getSecurityColor() as 'success' | 'warning',
      route: '/configuracoes',
      suffix: '%',
      subtitle: 'Score de segurança',
    },
  ], [stats, isOnline, activeWallets.length, supportedCurrencies.length]);

  const handleWalletClick = (wallet: any) => {
    setSelectedWallet(wallet);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedAssets.findIndex(asset => asset.symbol === active.id);
      const newIndex = orderedAssets.findIndex(asset => asset.symbol === over.id);
      
      const newOrder = arrayMove(
        orderedAssets.map(asset => asset.symbol), 
        oldIndex, 
        newIndex
      );
      
      reorderCards(newOrder);
    }
  };

  const handleGenerateWallets = async () => {
    if (hasGeneratedWallets) {
      toast.error('Você já possui carteiras geradas.');
      return;
    }
    toast.info('Funcionalidade disponível na aba Carteiras Web3');
  };

  const tabs = [
    { 
      id: 'overview', 
      label: 'Visão Geral', 
      icon: BarChart3 
    },
    { 
      id: 'wallets', 
      label: 'Carteiras Web3', 
      icon: Wallet 
    },
    { 
      id: 'crypto', 
      label: 'Criptomoedas', 
      icon: Coins 
    },
    { 
      id: 'transactions', 
      label: 'Transações', 
      icon: History 
    },
    { 
      id: 'swap', 
      label: 'Swap', 
      icon: ArrowLeftRight 
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="block md:hidden">
        <NativeHeader title="Dashboard" />
      </div>

      {/* Desktop/Tablet Header */}
      <div className="hidden md:block p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Unificado</h1>
            <p className="text-muted-foreground">
              Gerencie seu patrimônio tradicional e Web3 em um só lugar
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
            
            <Button
              onClick={refreshAll}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={cn(
                "w-4 h-4 mr-2",
                isRefreshing && "animate-spin"
              )} />
              Atualizar Tudo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 md:pt-0 px-4 md:px-6">
        {/* Balance Section - Mobile */}
        <div className="block md:hidden text-center py-8">
          <div className="text-4xl font-bold text-foreground mb-2">
            R$ {stats.totalBalance.toLocaleString('pt-BR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className={cn(
              "text-sm flex items-center",
              stats.totalBalanceChange >= 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {stats.totalBalanceChange >= 0 ? 
                <TrendingUp className="w-3 h-3 mr-1" /> : 
                <TrendingDown className="w-3 h-3 mr-1" />
              }
              {stats.totalBalanceChange >= 0 ? '+' : ''}{stats.totalBalanceChange.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Patrimônio tradicional + Web3
          </p>
        </div>

        {/* Dashboard Cards Grid - Desktop/Tablet */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              {...card}
              isLoading={stats.isLoading}
            />
          ))}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="block md:hidden mb-6">
          <NativeActionButtons />
        </div>

        {/* Unified Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center gap-1 text-xs"
              >
                <tab.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Resumo Financeiro
                  </CardTitle>
                  <CardDescription>
                    Visão consolidada do seu patrimônio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Patrimônio Tradicional</span>
                      <span className="font-semibold">
                        R$ {stats.traditionalBalance.toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Patrimônio Web3</span>
                      <span className="font-semibold">
                        R$ {stats.cryptoBalance.toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Geral</span>
                        <span className="font-bold text-lg">
                          R$ {stats.totalBalance.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Atividade Recente
                  </CardTitle>
                  <CardDescription>
                    Últimas atividades em suas carteiras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Carteiras Web3 sincronizadas</p>
                        <p className="text-xs text-muted-foreground">2 min atrás</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Dashboard atualizado</p>
                        <p className="text-xs text-muted-foreground">5 min atrás</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Preços atualizados</p>
                        <p className="text-xs text-muted-foreground">10 min atrás</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Carteiras Web3</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas carteiras de criptomoedas
                </p>
              </div>
              {shouldShowGenerateButton && (
                <Button 
                  onClick={handleGenerateWallets}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isGenerating ? 'Gerando...' : 'Gerar Carteiras'}
                </Button>
              )}
            </div>

            <CryptoDashboardStats
              activeWalletsCount={activeWallets.length}
              totalBalance={stats.cryptoBalance}
              supportedCurrenciesCount={supportedCurrencies.length}
              isGenerating={isGenerating}
              pendingWalletsCount={pendingWallets.length}
            />

            <CryptoWalletsGrid
              wallets={wallets}
              isGenerating={isGenerating}
              onGenerateWallets={handleGenerateWallets}
            />

            <CryptoSecurityNotice />
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto" className="space-y-6">
            {orderedAssets.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedAssets.map(asset => asset.symbol)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="divide-y divide-border/20">
                    {orderedAssets.map((crypto) => (
                      <DraggableCryptoListItem
                        key={crypto.symbol}
                        id={crypto.symbol}
                        symbol={crypto.symbol}
                        name={crypto.name}
                        network={crypto.network}
                        price={crypto.price?.toString() || '0'}
                        change={crypto.change}
                        amount={crypto.amount?.toString() || '0'}
                        value={crypto.value?.toString() || '0'}
                        icon={crypto.icon}
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
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhuma criptomoeda encontrada
                </p>
                <Button 
                  onClick={() => setActiveTab('wallets')}
                  variant="outline"
                >
                  Configurar Carteiras
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Histórico de Transações</h3>
              <p className="text-muted-foreground mb-4">
                Visualize todas as suas transações em um só lugar
              </p>
              <Button 
                onClick={() => navigate('/historico')}
                variant="outline"
              >
                Ver Histórico Completo
              </Button>
            </div>
          </TabsContent>

          {/* Swap Tab */}
          <TabsContent value="swap" className="space-y-6">
            <div className="text-center py-12">
              <ArrowLeftRight className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Troca de Criptomoedas</h3>
              <p className="text-muted-foreground mb-4">
                Faça swap entre diferentes criptomoedas de forma segura
              </p>
              <Button 
                onClick={() => navigate('/swap')}
                variant="outline"
              >
                Acessar Swap
              </Button>
            </div>
          </TabsContent>
        </Tabs>
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
