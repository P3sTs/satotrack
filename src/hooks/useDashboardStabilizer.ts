import { useMemo, useRef } from 'react';

interface DashboardStats {
  totalBalance: number;
  totalBalanceChange: number;
  activeWallets: number;
  totalTransactions: number;
  activeNetworks: number;
  securityScore: number;
  isLoading: boolean;
  lastUpdated?: Date;
}

export const useDashboardStabilizer = (stats: DashboardStats) => {
  const previousStatsRef = useRef<DashboardStats | null>(null);
  
  // Stabilize the stats to prevent unnecessary re-renders
  const stableStats = useMemo(() => {
    const current = {
      ...stats,
      totalBalanceChange: Number(stats.totalBalanceChange.toFixed(2))
    };
    
    // Only update if there's a significant change
    if (previousStatsRef.current) {
      const prev = previousStatsRef.current;
      const hasSignificantChange = 
        Math.abs(current.totalBalance - prev.totalBalance) > 0.01 ||
        Math.abs(current.totalBalanceChange - prev.totalBalanceChange) > 0.01 ||
        current.activeWallets !== prev.activeWallets ||
        current.totalTransactions !== prev.totalTransactions ||
        current.activeNetworks !== prev.activeNetworks ||
        Math.abs(current.securityScore - prev.securityScore) > 1 ||
        current.isLoading !== prev.isLoading;
        
      if (!hasSignificantChange) {
        return previousStatsRef.current;
      }
    }
    
    previousStatsRef.current = current;
    return current;
  }, [
    stats.totalBalance,
    stats.activeWallets,
    stats.totalTransactions,
    stats.activeNetworks,
    stats.securityScore,
    stats.isLoading,
    Math.floor(stats.totalBalanceChange * 100) // Round to 2 decimal places for comparison
  ]);
  
  return stableStats;
};