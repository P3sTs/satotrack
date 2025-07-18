
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wallet, 
  Send, 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownLeft,
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
  Plus,
  History,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { WalletActionModal } from './WalletActionModal';
import { WalletReceiveModal } from './WalletReceiveModal';
import { WalletSendModal } from './WalletSendModal';
import { WalletConverterModal } from './WalletConverterModal';

interface WalletBalance {
  id: string;
  currency: string;
  balance: number;
  address: string;
  usd_value: number;
}

export const WalletDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletBalance | null>(null);

  // Carregar saldos das carteiras
  const loadBalances = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('wallet-balance', {
        body: { all_wallets: true }
      });

      if (error) throw error;

      if (data?.success && data?.data?.balances) {
        setBalances(data.data.balances);
        
        // Calcular valor total em USD (mockado)
        const total = data.data.balances.reduce((sum: number, wallet: WalletBalance) => {
          const mockRates: Record<string, number> = {
            'BTC': 43000,
            'ETH': 2500,
            'USDT': 1,
            'MATIC': 0.8
          };
          return sum + (wallet.balance * (mockRates[wallet.currency] || 0));
        }, 0);
        
        setTotalBalance(total);
      }
    } catch (error) {
      console.error('Erro ao carregar saldos:', error);
      toast.error('Erro ao carregar saldos das carteiras');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBalances();
  }, [isAuthenticated, user]);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: currency === 'BTC' ? 8 : 2,
      maximumFractionDigits: currency === 'BTC' ? 8 : 2,
    }).format(value);
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getCurrencyIcon = (currency: string) => {
    const icons: Record<string, string> = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'USDT': '₮',
      'MATIC': '◇'
    };
    return icons[currency] || '◦';
  };

  const handleWalletAction = (action: string, wallet?: WalletBalance) => {
    setSelectedWallet(wallet || null);
    setActiveModal(action);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground mb-4">
              Faça login para acessar sua carteira digital
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header com Saldo Total */}
        <Card className="bg-gradient-to-r from-satotrack-neon/10 to-blue-500/10 border-satotrack-neon/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-satotrack-neon/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-satotrack-neon" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">SatoTracker Wallet</h1>
                  <p className="text-sm text-muted-foreground">Sua carteira descentralizada</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHideBalances(!hideBalances)}
                  className="text-satotrack-text hover:text-white"
                >
                  {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadBalances}
                  disabled={isLoading}
                  className="text-satotrack-text hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Saldo Total</p>
              <div className="text-4xl font-bold text-satotrack-neon mb-2">
                {hideBalances ? '••••••' : formatUSD(totalBalance)}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span>+2.4% nas últimas 24h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => handleWalletAction('send')}
            className="h-20 flex-col bg-dashboard-medium hover:bg-dashboard-light border-dashboard-light/30"
          >
            <Send className="h-6 w-6 mb-2 text-satotrack-neon" />
            <span>Enviar</span>
          </Button>
          
          <Button
            onClick={() => handleWalletAction('receive')}
            className="h-20 flex-col bg-dashboard-medium hover:bg-dashboard-light border-dashboard-light/30"
          >
            <Download className="h-6 w-6 mb-2 text-satotrack-neon" />
            <span>Receber</span>
          </Button>
          
          <Button
            onClick={() => handleWalletAction('convert')}
            className="h-20 flex-col bg-dashboard-medium hover:bg-dashboard-light border-dashboard-light/30"
          >
            <RefreshCw className="h-6 w-6 mb-2 text-satotrack-neon" />
            <span>Converter</span>
          </Button>
          
          <Button
            onClick={() => handleWalletAction('history')}
            className="h-20 flex-col bg-dashboard-medium hover:bg-dashboard-light border-dashboard-light/30"
          >
            <History className="h-6 w-6 mb-2 text-satotrack-neon" />
            <span>Histórico</span>
          </Button>
        </div>

        {/* Lista de Carteiras */}
        <Card className="bg-dashboard-medium/50 border-dashboard-light/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-satotrack-text">
              <span>Suas Carteiras</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleWalletAction('create')}
                className="text-satotrack-neon hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Carteira
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-dashboard-dark/50 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : balances.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2 text-satotrack-text">
                  Nenhuma carteira encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira carteira para começar
                </p>
                <Button
                  onClick={() => handleWalletAction('create')}
                  className="bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Carteira
                </Button>
              </div>
            ) : (
              balances.map((wallet) => (
                <Card 
                  key={wallet.id}
                  className="bg-dashboard-dark/50 border-dashboard-light/20 hover:border-satotrack-neon/30 transition-colors cursor-pointer"
                  onClick={() => handleWalletAction('details', wallet)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-satotrack-neon/20 flex items-center justify-center">
                          <span className="text-satotrack-neon font-bold">
                            {getCurrencyIcon(wallet.currency)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-satotrack-text">
                            {wallet.currency}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-satotrack-text">
                          {hideBalances ? '••••••' : formatCurrency(wallet.balance, wallet.currency)} {wallet.currency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {hideBalances ? '••••••' : formatUSD(wallet.usd_value)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Modais */}
        {activeModal === 'send' && (
          <WalletSendModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            wallets={balances}
          />
        )}

        {activeModal === 'receive' && (
          <WalletReceiveModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            wallets={balances}
          />
        )}

        {activeModal === 'convert' && (
          <WalletConverterModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            wallets={balances}
          />
        )}

        {activeModal === 'create' && (
          <WalletActionModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onSuccess={loadBalances}
          />
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;
