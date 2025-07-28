import { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from './useDashboardData';
import { useCryptoWallets } from './useCryptoWallets';
import { useAuth } from '@/contexts/auth';

export const useUnifiedDashboard = () => {
  const { stats, cryptoAssets, isOnline, refreshData } = useDashboardData();
  const { userPlan } = useAuth();
  const { 
    wallets, 
    isLoading: walletsLoading, 
    hasGeneratedWallets,
    refreshAllBalances,
    loadWallets 
  } = useCryptoWallets();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  // Calcular estatísticas unificadas
  const unifiedStats = useMemo(() => {
    const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
    const totalCryptoBalance = activeWallets.reduce((sum, wallet) => {
      return sum + parseFloat(wallet.balance || '0');
    }, 0);

    return {
      totalBalance: stats.totalBalance + totalCryptoBalance,
      totalBalanceChange: stats.totalBalanceChange,
      activeWallets: activeWallets.length,
      totalTransactions: stats.totalTransactions,
      activeNetworks: stats.activeNetworks,
      securityScore: stats.securityScore,
      cryptoBalance: totalCryptoBalance,
      traditionalBalance: stats.totalBalance,
      isLoading: stats.isLoading || walletsLoading,
      hasWallets: activeWallets.length > 0,
      isPremium: userPlan === 'premium'
    };
  }, [stats, wallets, userPlan]);

  // Função unificada de refresh
  const refreshAll = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      await Promise.allSettled([
        refreshData(),
        refreshAllBalances()
      ]);
    } catch (error) {
      console.error('Erro ao atualizar dashboard unificado:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    stats: unifiedStats,
    cryptoAssets,
    wallets,
    isOnline,
    isRefreshing,
    hasGeneratedWallets,
    refreshAll,
    loadWallets
  };
};