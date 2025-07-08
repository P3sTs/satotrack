
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { useCryptoWallets } from '../hooks/useCryptoWallets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, RefreshCw, Loader2, Wallet, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CryptoWalletCard from '../components/crypto/CryptoWalletCard';

const Wallets: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { wallets, isLoading, refreshAllBalances, loadWallets, generationErrors } = useCryptoWallets();
  const [refreshing, setRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Debug effect
  useEffect(() => {
    setDebugInfo({
      userExists: !!user,
      userId: user?.id,
      isAuthenticated,
      walletsCount: wallets.length,
      isLoading,
      timestamp: new Date().toISOString()
    });
  }, [user, isAuthenticated, wallets.length, isLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Load wallets only once on component mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadWallets();
    }
  }, [isAuthenticated, user?.id]); // Remove loadWallets dependency

  // Filter only active wallets (not pending)
  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllBalances();
      toast.success('Saldos atualizados!');
    } catch (error) {
      toast.error('Erro ao atualizar saldos');
    } finally {
      setRefreshing(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGenerateWallets = () => {
    navigate('/dashboard'); // Vai para o dashboard onde pode gerar carteiras
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-dashboard-dark/80 backdrop-blur-lg border-b border-dashboard-medium">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoToDashboard}
                className="text-satotrack-text hover:text-white hover:bg-dashboard-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-satotrack-text">
                Minhas Carteiras Cripto
              </h1>
            </div>
            
            {activeWallets.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Atualizar Saldos
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info (removido em produção) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <Alert className="mb-4 bg-blue-500/10 border-blue-500/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <details className="text-xs">
              <summary className="cursor-pointer font-medium text-blue-400">Debug Info (Dev Only)</summary>
              <pre className="mt-2 text-blue-300 whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </AlertDescription>
        </Alert>
      )}

      {/* Generation Errors */}
      {generationErrors && generationErrors.length > 0 && (
        <Alert className="mb-4" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erro na geração de carteiras:</strong>
            <ul className="mt-2 list-disc list-inside">
              {generationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => loadWallets()}
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="bg-dashboard-dark border-dashboard-medium">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-dashboard-medium" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-dashboard-medium" />
                      <Skeleton className="h-3 w-16 bg-dashboard-medium" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-dashboard-medium mb-4" />
                  <Skeleton className="h-8 w-full bg-dashboard-medium mb-2" />
                  <div className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-8 bg-dashboard-medium" />
                    <Skeleton className="h-8 bg-dashboard-medium" />
                    <Skeleton className="h-8 bg-dashboard-medium" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeWallets.length === 0 ? (
          <Card className="max-w-md mx-auto bg-dashboard-dark border-dashboard-medium text-center p-8">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-satotrack-neon/10 flex items-center justify-center">
                <Wallet className="h-10 w-10 text-satotrack-neon" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-satotrack-text">
                  Nenhuma carteira encontrada
                </h3>
                <p className="text-muted-foreground">
                  Você ainda não possui carteiras cripto. Generate suas carteiras seguras via Tatum KMS.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleGenerateWallets}
                  className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
                >
                  🔒 Gerar Carteiras via Tatum KMS
                </Button>
                
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-xs text-green-400">
                    🔒 Sistema Tatum KMS: Máxima segurança com chaves gerenciadas na nuvem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-dashboard-dark border-dashboard-medium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Carteiras</p>
                      <p className="text-2xl font-bold text-satotrack-neon">
                        {activeWallets.length}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-satotrack-neon" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dashboard-dark border-dashboard-medium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Moedas Suportadas</p>
                      <p className="text-2xl font-bold text-satotrack-neon">
                        {new Set(activeWallets.map(w => w.currency)).size}
                      </p>
                    </div>
                    <div className="text-2xl">🔒</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dashboard-dark border-dashboard-medium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status KMS</p>
                      <p className="text-sm font-bold text-green-400">Ativo</p>
                    </div>
                    <div className="text-2xl">✅</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wallets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeWallets.map((wallet) => (
                <CryptoWalletCard
                  key={wallet.id}
                  wallet={wallet}
                  onRefresh={() => {
                    // Implementar refresh individual se necessário
                    handleRefresh();
                  }}
                />
              ))}
            </div>

            {/* Security Notice */}
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <h4 className="font-medium text-green-400">
                      Sistema Tatum KMS Ativo
                    </h4>
                    <p className="text-sm text-green-300">
                      Suas chaves privadas são gerenciadas com segurança máxima pelo Tatum KMS. 
                      Transações assinadas remotamente com criptografia de ponta.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallets;
