
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Carteiras Ativas</p>
              <p className="text-xl sm:text-2xl font-bold text-satotrack-neon">
                {activeWalletsCount}
              </p>
            </div>
            <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-satotrack-neon" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Moedas Suportadas</p>
              <p className="text-xl sm:text-2xl font-bold text-satotrack-neon">
                {supportedCurrenciesCount}
              </p>
            </div>
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-satotrack-neon" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Saldo Total (USD)</p>
              <p className="text-xl sm:text-2xl font-bold text-satotrack-neon">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-satotrack-neon" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Status KMS</p>
              <p className="text-sm sm:text-base font-bold text-green-400">
                {isGenerating ? 'Processando...' : 'Ativo'}
              </p>
              {pendingWalletsCount > 0 && (
                <p className="text-xs text-yellow-400">
                  {pendingWalletsCount} pendente(s)
                </p>
              )}
            </div>
            {isGenerating ? (
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 animate-spin" />
            ) : (
              <div className="text-xl sm:text-2xl">✅</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
