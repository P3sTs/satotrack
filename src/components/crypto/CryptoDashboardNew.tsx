
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
  
  // Fix: Include 'generating' in the type union
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
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

  // Status da geração
  const getGenerationStatusIcon = () => {
    switch (generationStatus) {
      case 'generating':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Zap className="h-5 w-5 text-satotrack-neon" />;
    }
  };

  // Deve mostrar o botão de gerar apenas se não há carteiras geradas
  const shouldShowGenerateButton = wallets.length === 0 || 
    (wallets.length > 0 && wallets.every(w => w.address === 'pending_generation'));

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-satotrack-text mb-2 flex items-center gap-2">
              {getGenerationStatusIcon()}
              Carteiras Cripto
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas carteiras de criptomoedas com segurança total
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={refreshAllBalances}
            variant="outline"
            disabled={isLoading || activeWallets.length === 0}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Tudo
          </Button>
          
          {shouldShowGenerateButton && (
            <Button
              onClick={handleGenerateWallets}
              disabled={generationStatus === 'generating'}
              className="gap-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              {generationStatus === 'generating' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {generationStatus === 'generating' ? 'Gerando...' : 'Gerar Carteiras'}
            </Button>
          )}
        </div>
      </div>

      {/* Status da Geração */}
      {generationStatus === 'generating' && (
        <Alert className="border-blue-500/30 bg-blue-500/10">
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          <AlertDescription className="text-blue-600">
            <strong>Gerando carteiras...</strong> Conectando com a API Tatum para criar seus endereços Web3.
            Este processo pode levar alguns segundos.
          </AlertDescription>
        </Alert>
      )}

      {generationStatus === 'success' && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-600">
            <strong>Carteiras geradas com sucesso!</strong> Suas carteiras Web3 estão prontas para uso.
          </AlertDescription>
        </Alert>
      )}

      {generationStatus === 'error' && generationErrors.length > 0 && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-600">
            <strong>Erro na geração de carteiras:</strong>
            <ul className="mt-2 list-disc list-inside">
              {generationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <Button
              onClick={handleRetryGeneration}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Carteiras Ativas</p>
                <p className="text-2xl font-bold text-blue-400">{activeWallets.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-green-400">
                  ${totalBalance.toFixed(6)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moedas Suportadas</p>
                <p className="text-2xl font-bold text-purple-400">{supportedCurrencies.length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-400" />
            </div>

          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-bold text-orange-400">
                  {generationStatus === 'generating' ? 'Gerando...' : 
                   pendingWallets.length > 0 ? 'Processando...' : 'Ativo'}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="border-satotrack-neon/30 bg-satotrack-neon/10">
        <Shield className="h-4 w-4 text-satotrack-neon" />
        <AlertDescription className="text-satotrack-text">
          <strong>Sistema de Segurança Avançado:</strong> Cada usuário possui apenas 1 endereço por criptomoeda.
          Suas chaves privadas são criptografadas e armazenadas com segurança máxima.
        </AlertDescription>
      </Alert>

      {/* Wallets Grid */}
      {wallets.length === 0 && generationStatus !== 'generating' ? (
        <Card className="p-8 text-center">
          <CardContent>
            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma carteira encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Gere suas carteiras cripto para começar a usar o sistema
            </p>
            <Button
              onClick={handleGenerateWallets}
              disabled={generationStatus === 'generating'}
              className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              {generationStatus === 'generating' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {generationStatus === 'generating' ? 'Gerando Carteiras...' : 'Gerar Minhas Carteiras'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => {
            // Fix: Ensure wallet has currency field
            const walletWithCurrency = {
              ...wallet,
              currency: wallet.currency || wallet.name?.split(' ')[0] || 'UNKNOWN'
            };
            
            return (
              <CryptoWalletCard
                key={wallet.id}
                wallet={walletWithCurrency}
                onSend={() => toast.info(`Funcionalidade de envio ${wallet.name} em desenvolvimento`)}
                onReceive={() => toast.info(`Funcionalidade de recebimento ${wallet.name} em desenvolvimento`)}
              />
            );
          })}
        </div>
      )}

      {/* Pending Generation Alert */}
      {(pendingWallets.length > 0 || generationStatus === 'generating') && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-600">
            <strong>Processando carteiras...</strong> {generationStatus === 'generating' ? 
              'Gerando endereços via Tatum API.' : 
              'Algumas carteiras ainda estão sendo processadas via Tatum API.'
            } A página será atualizada automaticamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Dicas de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-500">Proteção de Dados</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Suas chaves privadas são criptografadas</li>
                <li>• Apenas você tem acesso às suas carteiras</li>
                <li>• Sistema de backup automático seguro</li>
                <li>• Monitoramento 24/7 de segurança</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-500">Boas Práticas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Verifique sempre os endereços antes de enviar</li>
                <li>• Teste com pequenos valores primeiro</li>
                <li>• Mantenha seu login seguro</li>
                <li>• Use conexões HTTPS sempre</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoDashboardNew;
