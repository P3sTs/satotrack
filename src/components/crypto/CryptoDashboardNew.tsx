
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { useAuth } from '@/contexts/auth';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Import dashboard components
import { CryptoDashboardHeader } from './dashboard/CryptoDashboardHeader';
import { CryptoDashboardStats } from './dashboard/CryptoDashboardStats';
import { CryptoDashboardAlerts } from './dashboard/CryptoDashboardAlerts';
import { CryptoWalletsGrid } from './dashboard/CryptoWalletsGrid';
import { CryptoSecurityNotice } from './dashboard/CryptoSecurityNotice';

const CryptoDashboardNew: React.FC = () => {
  const navigate = useNavigate();
  const { userPlan } = useAuth();
  const { 
    wallets, 
    isLoading, 
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets, 
    refreshAllBalances,
    loadWallets 
  } = useCryptoWallets();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationErrors, setGenerationErrors] = useState<string[]>([]);
  
  const isPremium = userPlan === 'premium';
  const supportedCurrencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL'];

  useEffect(() => {
    loadWallets();
  }, []);

  // Redirecionar automaticamente para carteiras após gerar com sucesso
  useEffect(() => {
    if (hasGeneratedWallets && !isGenerating) {
      setTimeout(() => {
        navigate('/carteiras');
      }, 2000);
    }
  }, [hasGeneratedWallets, isGenerating, navigate]);

  const handleGenerateWallets = async () => {
    if (hasGeneratedWallets) {
      toast.error('Você já possui carteiras geradas. Cada usuário pode ter apenas 1 endereço por moeda.');
      return;
    }

    setGenerationErrors([]);
    setIsGenerating(true);

    try {
      console.log('Iniciando geração de carteiras...');
      const result = await generateWallets();
      console.log('Resultado da geração:', result);
      
      if (result?.errors && result.errors.length > 0) {
        setGenerationErrors(result.errors);
        toast.error(`Algumas carteiras não puderam ser geradas: ${result.errors.join(', ')}`);
      } else {
        toast.success(`${result?.walletsGenerated || 0} carteiras geradas com sucesso!`);
      }
      
      // Recarregar carteiras após geração
      setTimeout(() => {
        loadWallets();
      }, 2000);
      
    } catch (error) {
      console.error('Erro na geração de carteiras:', error);
      setGenerationErrors([error.message || 'Erro desconhecido']);
      toast.error(`Falha na geração de carteiras: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetryGeneration = () => {
    setGenerationErrors([]);
    handleGenerateWallets();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const pendingWallets = wallets.filter(w => w.address === 'pending_generation');

  const totalBalance = activeWallets.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance || '0');
  }, 0);

  // Deve mostrar o botão de gerar apenas se não há carteiras geradas
  const shouldShowGenerateButton = wallets.length === 0 || 
    (wallets.length > 0 && wallets.every(w => w.address === 'pending_generation'));

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <CryptoDashboardHeader
        isGenerating={isGenerating}
        onGoBack={handleGoBack}
        onRefreshAll={refreshAllBalances}
        onGenerateWallets={handleGenerateWallets}
        isLoading={isLoading}
        activeWalletsCount={activeWallets.length}
        shouldShowGenerateButton={shouldShowGenerateButton}
      />

      <CryptoDashboardAlerts
        isGenerating={isGenerating}
        generationErrors={generationErrors}
        onRetryGeneration={handleRetryGeneration}
        pendingWalletsCount={pendingWallets.length}
      />

      <CryptoDashboardStats
        activeWalletsCount={activeWallets.length}
        totalBalance={totalBalance}
        supportedCurrenciesCount={supportedCurrencies.length}
        isGenerating={isGenerating}
        pendingWalletsCount={pendingWallets.length}
      />

      <Alert className="border-satotrack-neon/30 bg-satotrack-neon/10">
        <Shield className="h-4 w-4 text-satotrack-neon" />
        <AlertDescription className="text-satotrack-text">
          <strong>Sistema de Segurança Avançado:</strong> Cada usuário possui apenas 1 endereço por criptomoeda.
          Suas chaves privadas são criptografadas e armazenadas com segurança máxima.
        </AlertDescription>
      </Alert>

      <CryptoWalletsGrid
        wallets={wallets}
        isGenerating={isGenerating}
        onGenerateWallets={handleGenerateWallets}
      />

      <CryptoSecurityNotice />
    </div>
  );
};

export default CryptoDashboardNew;
