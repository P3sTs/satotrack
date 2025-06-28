
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { CryptoWalletsGrid } from '@/components/crypto/dashboard/CryptoWalletsGrid';
import { CryptoDashboardHeader } from '@/components/crypto/dashboard/CryptoDashboardHeader';
import { CryptoDashboardStats } from '@/components/crypto/dashboard/CryptoDashboardStats';
import { CryptoDashboardAlerts } from '@/components/crypto/dashboard/CryptoDashboardAlerts';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Shield, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    wallets,
    isLoading,
    generationStatus,
    generationErrors,
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets,
    refreshAllBalances
  } = useCryptoWallets();

  const activeWalletsCount = wallets.filter(w => w.address !== 'pending_generation').length;
  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance || '0'), 0);
  const supportedCurrenciesCount = 5; // BTC, ETH, MATIC, USDT, SOL
  const pendingWalletsCount = wallets.filter(w => w.address === 'pending_generation').length;

  const shouldShowGenerateButton = !hasGeneratedWallets && generationStatus !== 'generating';

  const handleGoBack = () => {
    navigate('/');
  };

  const handleRetryGeneration = () => {
    generateWallets();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <CryptoDashboardHeader
          generationStatus={generationStatus}
          onGoBack={handleGoBack}
          onRefreshAll={refreshAllBalances}
          onGenerateWallets={generateWallets}
          isLoading={isLoading}
          activeWalletsCount={activeWalletsCount}
          shouldShowGenerateButton={shouldShowGenerateButton}
        />

        <CryptoDashboardAlerts
          generationStatus={generationStatus}
          generationErrors={generationErrors}
          onRetryGeneration={handleRetryGeneration}
          pendingWalletsCount={pendingWalletsCount}
        />

        <CryptoDashboardStats
          activeWalletsCount={activeWalletsCount}
          totalBalance={totalBalance}
          supportedCurrenciesCount={supportedCurrenciesCount}
          generationStatus={generationStatus}
          pendingWalletsCount={pendingWalletsCount}
        />

        <CryptoWalletsGrid
          wallets={wallets}
          generationStatus={generationStatus}
          onGenerateWallets={generateWallets}
        />

        {user && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Status da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-300">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Carteiras Ativas:</strong> {activeWalletsCount}</p>
                <p><strong>Última Atualização:</strong> {new Date().toLocaleString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
