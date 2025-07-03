
import React from 'react';
import { TrustWalletCard, StatsCardContent } from '@/components/ui/trust-wallet-card';
import { Wallet, Shield, TrendingUp, Loader2 } from 'lucide-react';

interface CryptoDashboardStatsProps {
  activeWalletsCount: number;
  totalBalance: number;
  supportedCurrenciesCount: number;
  isGenerating: boolean;
  pendingWalletsCount: number;
}

export const CryptoDashboardStats: React.FC<CryptoDashboardStatsProps> = ({
  activeWalletsCount,
  totalBalance,
  supportedCurrenciesCount,
  isGenerating,
  pendingWalletsCount
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <TrustWalletCard variant="stats">
        <StatsCardContent
          icon={<Wallet className="h-8 w-8" />}
          title="Carteiras Ativas"
          value={activeWalletsCount}
        />
      </TrustWalletCard>

      <TrustWalletCard variant="stats">
        <StatsCardContent
          icon={<Shield className="h-8 w-8" />}
          title="Moedas Suportadas"
          value={supportedCurrenciesCount}
        />
      </TrustWalletCard>

      <TrustWalletCard variant="stats">
        <StatsCardContent
          icon={<TrendingUp className="h-8 w-8" />}
          title="Saldo Total (USD)"
          value={`$${totalBalance.toFixed(2)}`}
          trend="up"
          trendValue="↗️ Portfolio ativo"
        />
      </TrustWalletCard>

      <TrustWalletCard variant="stats">
        <StatsCardContent
          icon={
            isGenerating ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <div className="text-2xl">✅</div>
            )
          }
          title="Status KMS"
          value={isGenerating ? 'Processando...' : 'Ativo'}
          subtitle={
            pendingWalletsCount > 0 
              ? `${pendingWalletsCount} pendente(s)` 
              : '🔒 Tatum KMS Online'
          }
        />
      </TrustWalletCard>
    </div>
  );
};
