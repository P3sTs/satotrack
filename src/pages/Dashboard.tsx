
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
  Sparkles,
  Send,
  Download,
  Copy,
  ExternalLink,
  Info
} from 'lucide-react';
import { PremiumWalletCard } from '@/components/crypto/redesign/PremiumWalletCard';
import { EnhancedSendModal } from '@/components/crypto/EnhancedSendModal';
import { CryptoDepositModal } from '@/components/crypto/enhanced/CryptoDepositModal';
import { WalletDetailModal } from '@/components/crypto/WalletDetailModal';
import { AddWalletModal } from '@/components/crypto/redesign/AddWalletModal';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'BRL' | 'BTC'>('BRL');
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  
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
      toast.success('Saldos atualizados!');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateMainWallets = async () => {
    await generateWallets(['BTC', 'ETH', 'MATIC', 'USDT'], false);
  };

  const handleAddWallet = async (networks: string[]) => {
    await generateWallets(networks, false);
    setShowAddWalletModal(false);
  };

  const formatCurrencyDisplay = (balance: number, currency: string, displayCurrency: string) => {
    const num = balance;
    
    switch (displayCurrency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(num * 50000);
      case 'BRL':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(num * 280000);
      case 'BTC':
        if (currency === 'BTC') return `${num.toFixed(8)} BTC`;
        return `${(num * 0.000001).toFixed(8)} BTC`;
      default:
        return `${num.toFixed(6)} ${currency}`;
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
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-dashboard-dark/50 p-2 rounded-lg">
              <label className="text-xs text-muted-foreground">Moeda:</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as 'USD' | 'BRL' | 'BTC')}
                className="bg-transparent text-white text-xs border-none focus:outline-none"
              >
                <option value="BRL" className="bg-dashboard-dark">BRL</option>
                <option value="USD" className="bg-dashboard-dark">USD</option>
                <option value="BTC" className="bg-dashboard-dark">BTC</option>
              </select>
            </div>
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
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'overview' ? 'detailed' : 'overview')}
              className="border-satotrack-neon/30 text-satotrack-neon"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {viewMode === 'overview' ? 'Visão Detalhada' : 'Visão Geral'}
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

        {/* Enhanced Dashboard Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Performance Chart */}
          <Card className="bg-dashboard-medium/30 border-dashboard-light/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-satotrack-neon" />
                Performance do Portfólio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rendimento 24h</span>
                  <span className="text-emerald-400 font-medium">+{mockStats.dailyChange}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rendimento 7d</span>
                  <span className="text-red-400 font-medium">{mockStats.weeklyChange}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rendimento 30d</span>
                  <span className="text-emerald-400 font-medium">+{mockStats.monthlyChange}%</span>
                </div>
                <div className="h-32 bg-dashboard-dark/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Gráfico de Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-dashboard-medium/30 border-dashboard-light/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-satotrack-neon" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 border-satotrack-neon/30 text-satotrack-neon hover:bg-satotrack-neon/10"
                  onClick={() => navigate('/nova-carteira')}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="text-xs">Nova Carteira</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => navigate('/mercado')}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Mercado</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => navigate('/historico')}
                >
                  <Activity className="h-5 w-5" />
                  <span className="text-xs">Histórico</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => navigate('/configuracoes')}
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-xs">Configurações</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crypto Wallet Management Section */}
        {viewMode === 'detailed' && (
          <Card className="bg-dashboard-medium/30 border-dashboard-light/30 rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-satotrack-neon" />
                  Gestão de Carteiras Cripto
                </CardTitle>
                <div className="flex gap-2">
                  {hasGeneratedWallets && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddWalletModal(true)}
                      disabled={isGenerating}
                      className="border-satotrack-neon/30 text-satotrack-neon"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Rede
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/crypto')}
                    className="border-dashboard-light text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Página Completa
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasGeneratedWallets ? (
                <div className="space-y-6">
                  {/* Wallet Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-dashboard-dark/50 rounded-xl border border-dashboard-light/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-satotrack-neon/20 flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-satotrack-neon" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total de Carteiras</p>
                          <p className="text-lg font-bold text-white">{activeWallets.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-dashboard-dark/50 rounded-xl border border-dashboard-light/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Valor Total</p>
                          <p className="text-lg font-bold text-white">
                            {formatBalance(totalBalance, selectedCurrency)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-dashboard-dark/50 rounded-xl border border-dashboard-light/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Segurança KMS</p>
                          <p className="text-lg font-bold text-white">100%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wallets Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeWallets.map((wallet) => (
                      <PremiumWalletCard
                        key={wallet.id}
                        wallet={wallet}
                        selectedCurrency={selectedCurrency}
                        onRefresh={handleRefresh}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-satotrack-neon to-emerald-400 flex items-center justify-center mx-auto">
                    <Sparkles className="h-10 w-10 text-black" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">Comece sua jornada cripto!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Gere suas primeiras carteiras seguras com tecnologia KMS e comece a administrar seus criptoativos com total segurança.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleGenerateMainWallets}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold px-8 py-3"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                          Gerando carteiras...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Gerar Carteiras Principais
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/crypto')}
                      className="border-dashboard-light text-white px-8 py-3"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Saiba Mais
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Carteiras geradas: BTC, ETH, MATIC, USDT
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Wallet Overview */}
        {viewMode === 'overview' && (
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
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setViewMode('detailed')}
                      className="border-satotrack-neon/30 text-satotrack-neon"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Gerenciar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/crypto')}
                      className="border-dashboard-light text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Todas
                    </Button>
                  </div>
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
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleGenerateMainWallets}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-satotrack-neon to-emerald-400 text-black font-semibold"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Gerar Carteiras
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setViewMode('detailed')}
                        className="border-dashboard-light text-white text-xs"
                      >
                        Ver Opções Avançadas
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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

        {/* Add Wallet Modal */}
        <AddWalletModal
          isOpen={showAddWalletModal}
          onClose={() => setShowAddWalletModal(false)}
          onAddWallet={handleAddWallet}
          existingWallets={wallets.map(w => w.currency)}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default Dashboard;
