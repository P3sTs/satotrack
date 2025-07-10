import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export interface DashboardStats {
  totalBalance: number;
  totalBalanceChange: number;
  activeWallets: number;
  totalTransactions: number;
  activeNetworks: number;
  securityScore: number;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  network: string;
  price: string;
  change: number;
  amount: string;
  value: string;
  balanceUSD: number;
  icon: string;
}

const POLLING_INTERVAL = 30000; // 30 seconds

export const useDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalBalanceChange: 0,
    activeWallets: 0,
    totalTransactions: 0,
    activeNetworks: 0,
    securityScore: 85,
    isLoading: true,
    lastUpdated: null,
  });
  
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Fetch wallet data from Supabase
  const fetchWalletData = useCallback(async () => {
    if (!user) return;

    try {
      const { data: wallets, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const activeWallets = wallets?.filter(w => w.address !== 'pending_generation') || [];
      const totalBalance = activeWallets.reduce((sum, wallet) => 
        sum + (parseFloat(wallet.balance?.toString() || '0') || 0), 0
      );

      // Fetch transactions count
      const { count: transactionCount } = await supabase
        .from('crypto_transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Calculate unique networks
      const uniqueNetworks = new Set(activeWallets.map(w => w.currency)).size;

      setStats(prev => ({
        ...prev,
        totalBalance,
        totalBalanceChange: Math.random() * 10 - 5, // Mock change for now
        activeWallets: activeWallets.length,
        totalTransactions: transactionCount || 0,
        activeNetworks: uniqueNetworks,
        isLoading: false,
        lastUpdated: new Date(),
      }));

      // Convert to crypto assets format
      const assets: CryptoAsset[] = activeWallets.map(wallet => ({
        symbol: wallet.currency || 'UNKNOWN',
        name: wallet.name,
        network: wallet.currency || 'Unknown',
        price: `R$ ${(Math.random() * 1000).toFixed(2)}`,
        change: Math.random() * 20 - 10,
        amount: wallet.balance?.toString() || '0',
        value: `R$ ${(parseFloat(wallet.balance?.toString() || '0') * Math.random() * 100).toFixed(2)}`,
        balanceUSD: parseFloat(wallet.balance?.toString() || '0') * Math.random() * 100,
        icon: wallet.currency || 'UNKNOWN',
      }));

      setCryptoAssets(assets);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    setStats(prev => ({ ...prev, isLoading: true }));
    fetchWalletData();
  }, [fetchWalletData]);

  // Setup polling for real-time updates
  useEffect(() => {
    if (!user) return;

    fetchWalletData();
    
    const interval = setInterval(fetchWalletData, POLLING_INTERVAL);
    
    return () => clearInterval(interval);
  }, [user, fetchWalletData]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      refreshData();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshData]);

  return {
    stats,
    cryptoAssets,
    isOnline,
    refreshData,
  };
};