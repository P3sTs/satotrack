
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
import PremiumDashboard from '@/components/dashboard/PremiumDashboard';
import WalletComparison from '@/components/wallet/WalletComparison';

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
      
      {/* Aviso de limitação do plano gratuito */}
      {!isPremium && (
        <FreePlanNotice walletLimit={walletLimit} usedWallets={carteiras.length} />
      )}
      
      {/* Banner Premium para usuários gratuitos */}
      {!isPremium && (
        <PremiumBanner className="mb-6 animate-fade-in" />
      )}
      
      {/* Carteira Principal */}
      <PrimaryWallet wallet={principalCarteira} />
      
      {/* Dashboard Premium para todos os usuários (com funcionalidades limitadas) */}
      <div className="mb-6">
        <PremiumDashboard />
      </div>
      
      {/* Comparação de Carteiras Premium */}
      <div className="mb-6">
        <WalletComparison />
      </div>
      
      {/* Recursos Premium com bloqueios para usuários gratuitos */}
      {!isPremium && <PremiumFeatures />}
      
      {/* Anúncios para usuários gratuitos */}
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
      
      {/* CTA final para usuários gratuitos */}
      {!isPremium && (
        <div className="bg-dashboard-medium text-center p-6 rounded-lg border border-dashboard-light/50 mt-8">
          <h3 className="text-lg font-medium mb-3 text-satotrack-text">Desbloqueie Todo o Potencial do SatoTrack</h3>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            Desbloqueie gráficos avançados, alertas automáticos, filtros detalhados e muito mais 
            com apenas R$9,90/mês.
          </p>
          <button 
            onClick={() => window.location.href = '/planos'} 
            className="bg-bitcoin hover:bg-bitcoin/90 text-white px-6 py-2 rounded-md font-medium"
          >
            Assinar Premium
          </button>
        </div>
      )}
      
      <NewWalletModal 
        isOpen={isNewWalletModalOpen}
        onClose={() => setIsNewWalletModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
