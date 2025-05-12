
import React, { useState, useEffect } from 'react';
import { useCarteiras } from '../contexts/carteiras';
import { useAuth } from '@/contexts/auth';
import NewWalletModal from '../components/NewWalletModal';
import { Advertisement } from '@/components/monetization/Advertisement';
import PremiumBanner from '@/components/monetization/PremiumBanner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FreePlanNotice from '@/components/dashboard/FreePlanNotice';
import PrimaryWallet from '@/components/dashboard/PrimaryWallet';
import PremiumFeatures from '@/components/dashboard/PremiumFeatures';
import WalletsList from '@/components/dashboard/WalletsList';

const Dashboard: React.FC = () => {
  const { 
    carteiras, 
    isLoading,
    carteiraPrincipal
  } = useCarteiras();
  
  const { userPlan } = useAuth();
  
  const [isNewWalletModalOpen, setIsNewWalletModalOpen] = useState(false);
  const [principalCarteira, setCarteiraPrincipal] = useState<typeof carteiras[0] | null>(null);
  const [outrasCarteiras, setOutrasCarteiras] = useState<typeof carteiras>([]);
  
  const isPremium = userPlan === 'premium';
  const walletLimit = isPremium ? null : 1;
  const reachedLimit = !isPremium && carteiras.length >= 1;
  
  // Separar a carteira principal das outras
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
    <div className="container mx-auto px-4 py-6 md:py-8">
      <DashboardHeader 
        onNewWallet={() => setIsNewWalletModalOpen(true)} 
        reachedLimit={reachedLimit}
      />
      
      {/* Free plan limitation notice */}
      {!isPremium && (
        <FreePlanNotice walletLimit={walletLimit} usedWallets={carteiras.length} />
      )}
      
      {/* Premium Banner for free users */}
      {!isPremium && (
        <PremiumBanner className="mb-6 animate-fade-in" />
      )}
      
      {/* Carteira Principal */}
      <PrimaryWallet wallet={principalCarteira} />
      
      {/* Premium Features with locks for free users */}
      {!isPremium && <PremiumFeatures />}
      
      {/* Advertisement for free users */}
      {!isPremium && (
        <Advertisement position="panel" className="mb-6" />
      )}
      
      {/* Lista de Carteiras */}
      <WalletsList 
        carteiras={outrasCarteiras}
        isLoading={isLoading}
        primaryWallet={principalCarteira}
        reachedLimit={reachedLimit}
        onNewWallet={() => setIsNewWalletModalOpen(true)}
      />
      
      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
