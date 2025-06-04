import React, { useState } from 'react';
import { useCarteiras } from '../contexts/carteiras';
import { useAuth } from '@/contexts/auth';
import { useI18n } from '@/contexts/i18n/I18nContext';
import NewWalletModal from '../components/NewWalletModal';
import { Advertisement } from '@/components/monetization/Advertisement';
import PremiumBanner from '@/components/monetization/PremiumBanner';
import MarketSummary from '@/components/market/MarketSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';
import { useEffect } from 'react';

const Dashboard: React.FC = () => {
  const { 
    carteiras, 
    isLoading,
    carteiraPrincipal
  } = useCarteiras();
  const { userPlan, user } = useAuth();
  const { t } = useI18n();
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const [principalCarteira, setCarteiraPrincipal] = useState<typeof carteiras[0] | null>(null);
  const [outrasCarteiras, setOutrasCarteiras] = useState<typeof carteiras>([]);
  
  const isPremium = userPlan === 'premium';
  const walletLimit = isPremium ? null : 1;
  const reachedLimit = !isPremium && carteiras.length >= 1;

  const formatWelcomeMessage = (message: string, userName: string) => {
    return message.replace('{userName}', userName);
  };

  useEffect(() => {
    if (carteiraPrincipal && carteiras.length) {
      const principal = carteiras.find(c => c.id === carteiraPrincipal) || null;
      const outras = carteiras.filter(c => c.id !== carteiraPrincipal);
      
      setCarteiraPrincipal(principal);
      setOutrasCarteiras(outras);
    } else {
      setCarteiraPrincipal(null);
      setOutrasCarteiras(carteiras);
    }
  }, [carteiras, carteiraPrincipal]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">
          {formatWelcomeMessage(t.dashboard.welcomeMessage, user?.email?.split('@')[0] || 'Usuário')}
        </h1>
      </div>
      
      {/* Premium Banner for free users */}
      {!isPremium && (
        <PremiumBanner className="animate-fade-in" />
      )}
      
      {/* Market Summary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{t.dashboard.marketSummary}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/mercado'}
          >
            Ver Mercado Completo
          </Button>
        </div>
        <MarketSummary />
      </div>
      
      {/* Wallets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {t.wallet.myWallets}
          </h2>
          <Button
            onClick={() => setIsNewWalletModalOpen(true)}
            disabled={reachedLimit}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t.wallet.addWallet}
          </Button>
        </div>

        {carteiras.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carteiras.map((carteira) => (
              <Card key={carteira.id} className="bg-dashboard-medium border-dashboard-light">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white">
                    {carteira.nome || 'Carteira'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground truncate">
                      {carteira.endereco}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t.wallet.balance}:</span>
                      <span className="font-mono text-bitcoin">
                        {carteira.saldo?.toFixed(8) || '0.00000000'} BTC
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-dashboard-medium border-dashboard-light">
            <CardContent className="py-12 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhuma carteira encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Adicione sua primeira carteira Bitcoin para começar
              </p>
              <Button onClick={() => setIsNewWalletModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t.wallet.addWallet}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ads for free users */}
      {!isPremium && (
        <Advertisement position="panel" className="mt-6" />
      )}
      
      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
