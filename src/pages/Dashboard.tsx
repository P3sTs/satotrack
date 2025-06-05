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
import FinancialDashboard from '@/components/dashboard/FinancialDashboard';

const Dashboard: React.FC = () => {
  const { 
    carteiras, 
    isLoading,
    carteiraPrincipal
  } = useCarteiras();
  const { userPlan, user } = useAuth();
  const { t } = useI18n();
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  
  const isPremium = userPlan === 'premium';
  const walletLimit = isPremium ? null : 1;
  const reachedLimit = !isPremium && carteiras.length >= 1;

  const formatWelcomeMessage = (message: string, userName: string) => {
    return message.replace('{userName}', userName);
  };

  return (
    <div className="space-y-6">
      {/* Premium Banner for free users */}
      {!isPremium && (
        <PremiumBanner className="animate-fade-in" />
      )}
      
      {/* Financial Dashboard */}
      <FinancialDashboard />
      
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
