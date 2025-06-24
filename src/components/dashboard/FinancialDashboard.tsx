
import React from 'react';
import { useCarteiras } from '@/contexts/carteiras';
import { useAuth } from '@/contexts/auth';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import PrimaryWallet from './PrimaryWallet';
import WalletsList from './WalletsList';
import QuickActionsPanel from './QuickActionsPanel';
import Web3QuickAction from './Web3QuickAction';
import RealTimeBalanceCard from './RealTimeBalanceCard';
import TransactionSummary from './TransactionSummary';
import MarketOverview from './MarketOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, Plus } from 'lucide-react';

const FinancialDashboard: React.FC = () => {
  const { carteiras, isLoading } = useCarteiras();
  const { userPlan } = useAuth();
  const { data: bitcoinData } = useBitcoinPrice();
  const isPremium = userPlan === 'premium';

  // Calculate total balance from carteiras
  const totalBalance = carteiras.reduce((sum, carteira) => sum + carteira.saldo, 0);
  
  // Get primary wallet (first one or marked as primary)
  const primaryWallet = carteiras.find(c => c.isPrimary) || carteiras[0] || null;

  // Default currency
  const currency: 'BRL' | 'USD' = 'BRL';

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-satotrack-neon" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RealTimeBalanceCard 
              title="Saldo Total"
              value={totalBalance}
              fiatValue={totalBalance * (bitcoinData?.price_brl || 0)}
              currency={currency}
              icon={Wallet}
              trend="neutral"
              bitcoinData={bitcoinData}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Carteiras Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-satotrack-neon mb-2">
                {carteiras.length}
              </div>
              <p className="text-sm text-muted-foreground">
                {carteiras.length === 1 ? 'carteira ativa' : 'carteiras ativas'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          <PrimaryWallet wallet={primaryWallet} />
          <WalletsList />
          <TransactionSummary 
            carteiras={carteiras}
            bitcoinData={bitcoinData}
            currency={currency}
          />
        </div>

        {/* Sidebar direita */}
        <div className="space-y-6">
          <Web3QuickAction />
          <QuickActionsPanel />
          <MarketOverview currency={currency} />
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
