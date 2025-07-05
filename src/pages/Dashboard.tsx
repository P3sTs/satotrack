
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { useMultiChainWallets } from '@/hooks/useMultiChainWallets';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Bitcoin,
  Eye,
  EyeOff,
  RefreshCw,
  PlusCircle,
  BarChart3,
  Sparkles
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'BRL' | 'BTC'>('BRL');
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    wallets,
    isLoading,
    generationStatus,
    hasGeneratedWallets,
    generateWallets,
    refreshAllBalances
  } = useMultiChainWallets();

  const activeWallets = wallets.filter(w => w.address !== 'pending_generation');
  const totalBalance = activeWallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance || '0'), 0);
  const isGenerating = generationStatus === 'generating';

  // Mock data for advanced dashboard
  const mockStats = {
    totalValue: totalBalance * 280000, // Convert to BRL
    dailyChange: 5.4,
    weeklyChange: -2.1,
    monthlyChange: 12.8,
    totalTransactions: 24,
    activeNetworks: activeWallets.length,
    securityScore: 98
  };

  const formatBalance = (balance: number, currency: string) => {
    if (!showBalance) return '••••••';
    
    switch (currency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(balance * 50000);
      case 'BRL':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(balance * 280000);
      case 'BTC':
        return `${balance.toFixed(8)} BTC`;
      default:
        return `${balance.toFixed(2)}`;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllBalances();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Premium Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SatoTracker Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Visão completa dos seus investimentos em cripto
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="border-dashboard-light text-white"
            >
              {showBalance ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showBalance ? 'Ocultar' : 'Mostrar'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-dashboard-light text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/crypto')}
              className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Gerenciar Carteiras
            </Button>
          </div>
        </div>

        {/* Main Balance Card */}
        <Card className="bg-gradient-to-r from-dashboard-medium to-dashboard-dark border-satotrack-neon/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="h-6 w-6 text-satotrack-neon" />
                <span className="text-lg text-muted-foreground">Patrimônio Total</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-5xl font-bold text-white">
                  {formatBalance(totalBalance, selectedCurrency)}
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">+{mockStats.dailyChange}%</span>
                    <span className="text-xs text-muted-foreground">hoje</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDownRight className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 font-medium">{mockStats.weeklyChange}%</span>
                    <span className="text-xs text-muted-foreground">7d</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">+{mockStats.monthlyChange}%</span>
                    <span className="text-xs text-muted-foreground">30d</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Wallets */}
          <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Carteiras Ativas</p>
                  <p className="text-3xl font-bold text-white">{activeWallets.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Transactions */}
          <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transações</p>
                  <p className="text-3xl font-bold text-white">{mockStats.totalTransactions}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Networks */}
          <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Redes Ativas</p>
                  <p className="text-3xl font-bold text-white">{mockStats.activeNetworks}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Score */}
          <Card className="bg-dashboard-medium/50 border-dashboard-light/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Segurança</p>
                  <p className="text-3xl font-bold text-white">{mockStats.securityScore}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-satotrack-neon/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-satotrack-neon" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Wallet Overview */}
        <Card className="bg-dashboard-medium/30 border-dashboard-light/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-bitcoin" />
              Carteiras Principais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasGeneratedWallets ? (
              <>
                {activeWallets.slice(0, 4).map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-4 bg-dashboard-dark/50 rounded-xl border border-dashboard-light/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-bitcoin to-orange-500 flex items-center justify-center text-white font-bold">
                        {wallet.currency.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{wallet.name}</p>
                        <p className="text-xs text-muted-foreground">{wallet.currency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatBalance(parseFloat(wallet.balance || '0'), selectedCurrency)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {wallet.balance} {wallet.currency}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => navigate('/crypto')}
                  className="w-full border-dashboard-light text-white"
                >
                  Ver Todas as Carteiras
                </Button>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Bem-vindo ao SatoTracker!</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece gerando suas primeiras carteiras seguras
                  </p>
                  <Button
                    onClick={() => navigate('/crypto')}
                    className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Começar Agora
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Account Status */}
        {user && (
          <Card className="bg-dashboard-medium/30 border-dashboard-light/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-satotrack-neon" />
                Status da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-dashboard-dark/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-white truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-dashboard-dark/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Plano</p>
                    <Badge variant="outline" className="border-satotrack-neon/30 text-satotrack-neon text-xs">
                      SatoTracker Free
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-dashboard-dark/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Última Atividade</p>
                    <p className="text-xs text-white">
                      {new Date().toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
