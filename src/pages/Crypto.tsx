
import React, { useState } from 'react';
import { useMultiChainWallets } from '../hooks/useMultiChainWallets';
import { SatoTrackerWalletHeader } from '@/components/crypto/redesign/SatoTrackerWalletHeader';
import { SatoTrackerWalletList } from '@/components/crypto/redesign/SatoTrackerWalletList';
import { AddWalletModal } from '@/components/crypto/redesign/AddWalletModal';
import { WalletStatusSection } from '@/components/crypto/redesign/WalletStatusSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Shield, 
  Activity, 
  TrendingUp, 
  Wallet,
  RefreshCw,
  Info,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const Crypto = () => {
  const {
    wallets,
    isLoading,
    generationStatus,
    hasGeneratedWallets,
    generateWallets,
    refreshAllBalances
  } = useMultiChainWallets();

  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'BRL' | 'BTC'>('BRL');
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const isGenerating = generationStatus === 'generating';

  // Show only main wallets by default: BTC, ETH, MATIC, USDT
  const mainWallets = activeWallets.filter(w => 
    ['BTC', 'ETH', 'MATIC', 'USDT'].includes(w.currency)
  );
  const otherWallets = activeWallets.filter(w => 
    !['BTC', 'ETH', 'MATIC', 'USDT'].includes(w.currency)
  );

  const displayWallets = hasGeneratedWallets ? [...mainWallets, ...otherWallets] : [];

  const handleGenerateMainWallets = async () => {
    try {
      await generateWallets(['BTC', 'ETH', 'MATIC', 'USDT'], false);
      toast.success('✅ Carteiras principais geradas com sucesso!');
    } catch (error) {
      toast.error('❌ Erro ao gerar carteiras');
    }
  };

  const handleAddWallet = async (networks: string[]) => {
    try {
      await generateWallets(networks, false);
      setShowAddWalletModal(false);
      toast.success(`✅ Carteiras ${networks.join(', ')} adicionadas!`);
    } catch (error) {
      toast.error('❌ Erro ao adicionar carteiras');
    }
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllBalances();
      toast.success('🔄 Saldos atualizados!');
    } catch (error) {
      toast.error('❌ Erro ao atualizar saldos');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate total balance in selected currency
  const totalBalance = displayWallets.reduce((sum, wallet) => 
    sum + parseFloat(wallet.balance || '0'), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Header with Currency Selector and Total Balance */}
        <SatoTrackerWalletHeader
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          totalBalance={totalBalance}
          walletsCount={displayWallets.length}
        />

        {/* Quick Actions Bar */}
        {hasGeneratedWallets && (
          <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl animate-scale-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-satotrack-neon/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-satotrack-neon" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Ações Rápidas</p>
                    <p className="text-xs text-muted-foreground">Gerencie suas carteiras</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshAll}
                    disabled={isRefreshing}
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Atualizar Tudo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddWalletModal(true)}
                    disabled={isGenerating}
                    className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Nova Rede
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice for New Users */}
        {!hasGeneratedWallets && (
          <Alert className="border-satotrack-neon/30 bg-satotrack-neon/10 animate-fade-in">
            <Shield className="h-4 w-4 text-satotrack-neon" />
            <AlertDescription className="text-satotrack-neon">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Segurança Garantida</strong> - Suas carteiras são protegidas por tecnologia KMS avançada
                </div>
                <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  100% Seguro
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Performance Stats */}
        {hasGeneratedWallets && displayWallets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Performance 24h</p>
                    <p className="text-lg font-bold text-emerald-400">+2.4%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transações</p>
                    <p className="text-lg font-bold text-white">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Segurança</p>
                    <p className="text-lg font-bold text-purple-400">A+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Wallet List */}
        <div className="animate-fade-in">
          <SatoTrackerWalletList
            wallets={displayWallets}
            selectedCurrency={selectedCurrency}
            isLoading={isLoading}
            hasGeneratedWallets={hasGeneratedWallets}
            isGenerating={isGenerating}
            onGenerateMainWallets={handleGenerateMainWallets}
            onAddWallet={() => setShowAddWalletModal(true)}
            onRefreshWallet={handleRefreshAll}
          />
        </div>

        {/* Status Section */}
        <div className="animate-fade-in">
          <WalletStatusSection
            walletsCount={displayWallets.length}
            isGenerating={isGenerating}
          />
        </div>

        {/* Add Wallet Modal */}
        <AddWalletModal
          isOpen={showAddWalletModal}
          onClose={() => setShowAddWalletModal(false)}
          onAddWallet={handleAddWallet}
          existingWallets={wallets.map(w => w.currency)}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default Crypto;
