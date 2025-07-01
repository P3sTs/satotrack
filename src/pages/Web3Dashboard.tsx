
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CryptoDashboardNew from '@/components/crypto/CryptoDashboardNew';

const Web3Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { wallets, hasGeneratedWallets, loadWallets } = useCryptoWallets();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    // Carregar carteiras para sincronizar estado
    loadWallets();
  }, [isAuthenticated, navigate, loadWallets]);

  // Se já tem carteiras geradas, redirecionar para a página de carteiras
  useEffect(() => {
    if (hasGeneratedWallets && wallets.length > 0) {
      navigate('/carteiras');
    }
  }, [hasGeneratedWallets, wallets.length, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-satotrack-text hover:text-white hover:bg-dashboard-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-satotrack-text">Web3 & Crypto</h1>
        </div>
        
        <CryptoDashboardNew />
      </div>
    </div>
  );
};

export default Web3Dashboard;
