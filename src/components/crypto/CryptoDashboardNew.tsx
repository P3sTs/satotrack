
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { useAuth } from '@/contexts/auth';
import CryptoWalletCard from './CryptoWalletCard';
import { 
  Wallet, 
  Plus, 
  RefreshCw, 
  AlertCircle,
  Zap,
  Shield,
  TrendingUp,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Extract components
import { CryptoDashboardHeader } from './dashboard/CryptoDashboardHeader';
import { CryptoDashboardStats } from './dashboard/CryptoDashboardStats';
import { CryptoDashboardAlerts } from './dashboard/CryptoDashboardAlerts';
import { CryptoWalletsGrid } from './dashboard/CryptoWalletsGrid';
import { CryptoSecurityNotice } from './dashboard/CryptoSecurityNotice';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

const CryptoDashboardNew: React.FC = () => {
  const navigate = useNavigate();
  const { userPlan } = useAuth();
  const { 
    wallets, 
    isLoading, 
    isGenerating,
    hasGeneratedWallets,
    hasPendingWallets,
    generateWallets, 
    refreshAllBalances,
    loadWallets 
  } = useCryptoWallets();
  
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [generationErrors, setGenerationErrors] = useState<string[]>([]);
  
  const isPremium = userPlan === 'premium';
  const supportedCurrencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL'];

  useEffect(() => {
    loadWallets();
  }, []);

  const handleGenerateWallets = async () => {
    if (hasGeneratedWallets) {
      toast.error('Você já possui carteiras geradas. Cada usuário pode ter apenas 1 endereço por moeda.');
      return;
    }

    setGenerationStatus('generating');
    setGenerationErrors([]);

    try {
      console.log('Iniciando geração de carteiras...');
      const result = await generateWallets();
      console.log('Resultado da geração:', result);
      
      if (result?.errors && result.errors.length > 0) {
        setGenerationErrors(result.errors);
        setGenerationStatus('error');
        toast.error(`Algumas carteiras não puderam ser geradas: ${result.errors.join(', ')}`);
      } else {
        setGenerationStatus('success');
        toast.success(`${result?.walletsGenerated || 0} carteiras geradas com sucesso!`);
      }
      
      // Recarregar carteiras após geração
      setTimeout(() => {
        loadWallets();
      }, 2000);
      
    } catch (error) {
      console.error('Erro na geração de carteiras:', error);
      setGenerationStatus('error');
      setGenerationErrors([error.message || 'Erro desconhecido']);
      toast.error(`Falha na geração de carteiras: ${error.message}`);
    }
  };

  const handleRetryGeneration = () => {
    setGenerationStatus('idle');
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
        generationStatus={generationStatus}
        onGoBack={handleGoBack}
        onRefreshAll={refreshAllBalances}
        onGenerateWallets={handleGenerateWallets}
        isLoading={isLoading}
        activeWalletsCount={activeWallets.length}
        shouldShowGenerateButton={shouldShowGenerateButton}
      />

      <CryptoDashboardAlerts
        generationStatus={generationStatus}
        generationErrors={generationErrors}
        onRetryGeneration={handleRetryGeneration}
        pendingWalletsCount={pendingWallets.length}
      />

      <CryptoDashboardStats
        activeWalletsCount={activeWallets.length}
        totalBalance={totalBalance}
        supportedCurrenciesCount={supportedCurrencies.length}
        generationStatus={generationStatus}
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
        generationStatus={generationStatus}
        onGenerateWallets={handleGenerateWallets}
      />

      <CryptoSecurityNotice />
    </div>
  );
};

export default CryptoDashboardNew;
