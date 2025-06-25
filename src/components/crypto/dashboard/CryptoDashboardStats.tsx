
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, Shield, Zap } from 'lucide-react';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

interface CryptoDashboardStatsProps {
  activeWalletsCount: number;
  totalBalance: number;
  supportedCurrenciesCount: number;
  generationStatus: GenerationStatus;
  pendingWalletsCount: number;
}

export const CryptoDashboardStats: React.FC<CryptoDashboardStatsProps> = ({
  activeWalletsCount,
  totalBalance,
  supportedCurrenciesCount,
  generationStatus,
  pendingWalletsCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Carteiras Ativas</p>
              <p className="text-2xl font-bold text-blue-400">{activeWalletsCount}</p>
            </div>
            <Wallet className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-green-400">
                ${totalBalance.toFixed(6)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Moedas Suportadas</p>
              <p className="text-2xl font-bold text-purple-400">{supportedCurrenciesCount}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-bold text-orange-400">
                {generationStatus === 'generating' ? 'Gerando...' : 
                 pendingWalletsCount > 0 ? 'Processando...' : 'Ativo'}
              </p>
            </div>
            <Zap className="h-8 w-8 text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
