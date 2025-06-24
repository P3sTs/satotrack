
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
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const CryptoDashboardNew: React.FC = () => {
  const { userPlan } = useAuth();
  const { 
    wallets, 
    isLoading, 
    generateWallets, 
    refreshAllBalances,
    loadWallets 
  } = useCryptoWallets();
  
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const isPremium = userPlan === 'premium';
  const supportedCurrencies = ['BTC', 'ETH', 'MATIC', 'USDT', 'SOL'];

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    // Check if wallets need generation
    const hasPendingWallets = wallets.some(w => w.address === 'pending_generation');
    const hasAllWallets = supportedCurrencies.every(curr => 
      wallets.some(w => w.currency === curr)
    );

    if (hasAllWallets && hasPendingWallets && !hasGenerated && !isLoading) {
      console.log('Auto-generating wallets...');
      setHasGenerated(true);
      generateWallets();
    }
  }, [wallets, hasGenerated, isLoading]);

  const handleGenerateWallets = async () => {
    if (wallets.some(w => w.address !== 'pending_generation')) {
      toast.error('Você já possui carteiras geradas. Cada usuário pode ter apenas 1 endereço por moeda.');
      return;
    }

    await generateWallets();
  };

  const handleSendTransaction = (currency: string) => {
    toast.info(`Funcionalidade de envio ${currency} em desenvolvimento`);
  };

  const handleReceiveTransaction = (currency: string) => {
    // Handled by individual card modals
  };

  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const pendingWallets = wallets.filter(w => w.address === 'pending_generation');

  const totalBalance = activeWallets.reduce((sum, wallet) => {
    return sum + parseFloat(wallet.balance || '0');
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-satotrack-text mb-2 flex items-center gap-2">
            <Zap className="h-8 w-8 text-satotrack-neon" />
            Carteiras Cripto
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas carteiras de criptomoedas com segurança total
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={refreshAllBalances}
            variant="outline"
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Tudo
          </Button>
          
          {wallets.length === 0 && (
            <Button
              onClick={handleGenerateWallets}
              disabled={isLoading}
              className="gap-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              <Plus className="h-4 w-4" />
              Gerar Carteiras
            </Button>
          )}
        </div>
      </div>

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
                  {pendingWallets.length > 0 ? 'Gerando...' : 'Ativo'}
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
      {wallets.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma carteira encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Generate suas carteiras cripto para começar a usar o sistema
            </p>
            <Button
              onClick={handleGenerateWallets}
              disabled={isLoading}
              className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Gerar Minhas Carteiras
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <CryptoWalletCard
              key={wallet.id}
              wallet={wallet}
              onSend={() => handleSendTransaction(wallet.currency)}
              onReceive={() => handleReceiveTransaction(wallet.currency)}
            />
          ))}
        </div>
      )}

      {/* Pending Generation Alert */}
      {pendingWallets.length > 0 && (
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-600">
            <strong>Gerando carteiras...</strong> Algumas carteiras ainda estão sendo geradas via Tatum API.
            Isso pode levar alguns segundos. Atualize a página se demorar muito.
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
