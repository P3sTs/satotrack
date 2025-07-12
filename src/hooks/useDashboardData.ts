import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { demoWallets, demoStats } from '@/data/demoWallets';
import { useTatumPrices } from './useTatumPrices';

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
  const { getCryptoData } = useTatumPrices();
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
  const isGuestMode = localStorage.getItem('guest_demo_mode') === 'true';

  // Fetch wallet data from Supabase or use demo data
  const fetchWalletData = useCallback(async () => {
    try {
      // Se for modo convidado, sempre usar dados demo
      if (isGuestMode) {
        console.log('🎭 Modo convidado: usando dados demo');
        setStats({
          totalBalance: demoStats.totalBalance,
          totalBalanceChange: 2.34,
          activeWallets: demoStats.activeWallets,
          totalTransactions: demoStats.totalTransactions,
          activeNetworks: demoStats.activeNetworks,
          securityScore: demoStats.securityScore,
          isLoading: false,
          lastUpdated: new Date(),
        });

        // Converter dados demo para assets com preços reais
        const demoAssets: CryptoAsset[] = demoWallets.map(wallet => {
          const priceData = getCryptoData(wallet.symbol);
          return {
            symbol: wallet.symbol,
            name: wallet.name,
            network: wallet.network,
            price: priceData?.priceBRL || 'R$ 0,00',
            change: priceData?.change24h.value || wallet.change24h,
            amount: wallet.balance.toString(),
            value: priceData ? (wallet.balance * priceData.price * 5.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : `R$ ${wallet.balanceUSD.toFixed(2)}`,
            balanceUSD: wallet.balanceUSD,
            icon: wallet.icon,
          };
        });

        setCryptoAssets(demoAssets);
        return;
      }

      // Se não tem usuário logado e não é modo convidado, não carregar nada
      if (!user) {
        console.log('⚠️ Sem usuário e sem modo convidado');
        setStats(prev => ({ ...prev, isLoading: false }));
        setCryptoAssets([]);
        return;
      }

      // Usuário autenticado - carregar dados reais do Supabase
      console.log('👤 Usuário autenticado: carregando dados reais');
      
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
        totalBalanceChange: Math.random() * 10 - 5,
        activeWallets: activeWallets.length,
        totalTransactions: transactionCount || 0,
        activeNetworks: uniqueNetworks,
        isLoading: false,
        lastUpdated: new Date(),
      }));

      // Convert to crypto assets format with real prices
      const assets: CryptoAsset[] = activeWallets.map(wallet => {
        const priceData = getCryptoData(wallet.currency || 'BTC');
        const balance = parseFloat(wallet.balance?.toString() || '0');
        
        return {
          symbol: wallet.currency || 'UNKNOWN',
          name: wallet.name,
          network: wallet.currency || 'Unknown',
          price: priceData?.priceBRL || 'R$ 0,00',
          change: priceData?.change24h.value || 0,
          amount: balance.toString(),
          value: priceData ? (balance * priceData.price * 5.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
          balanceUSD: balance * (priceData?.price || 0),
          icon: wallet.currency || 'UNKNOWN',
        };
      });

      setCryptoAssets(assets);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, getCryptoData, isGuestMode]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    setStats(prev => ({ ...prev, isLoading: true }));
    fetchWalletData();
  }, [fetchWalletData]);

  // Setup polling for real-time updates
  useEffect(() => {
    // Sempre carregar dados, independente do modo
    fetchWalletData();
    
    // Só fazer polling se usuário estiver logado (não convidado)
    if (user && !isGuestMode) {
      const interval = setInterval(fetchWalletData, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [user, isGuestMode, fetchWalletData]);

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