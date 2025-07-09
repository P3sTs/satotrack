import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Calendar,
  Target,
  ChevronLeft,
  RefreshCw,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useMultiChainWallets } from '@/hooks/useMultiChainWallets';

const PerformanceAnalyticsDetailed: React.FC = () => {
  const navigate = useNavigate();
  const { wallets } = useMultiChainWallets();
  
  const [timeRange, setTimeRange] = useState('7d');
  const [performanceData, setPerformanceData] = useState({
    totalValue: 0,
    dailyChange: 2.3,
    weeklyChange: -1.2,
    monthlyChange: 8.7,
    yearlyChange: 34.5,
    bestPerformer: 'BTC',
    worstPerformer: 'ETH',
    averageHolding: 145
  });

  const [portfolioBreakdown, setPortfolioBreakdown] = useState([
    { symbol: 'BTC', percentage: 45.2, value: 12500, change: 3.2 },
    { symbol: 'ETH', percentage: 28.7, value: 7950, change: -1.8 },
    { symbol: 'MATIC', percentage: 15.1, value: 4180, change: 5.7 },
    { symbol: 'USDT', percentage: 11.0, value: 3045, change: 0.1 }
  ]);

  const [recentPerformance, setRecentPerformance] = useState([
    { date: '2024-01-15', value: 27675, change: 2.3 },
    { date: '2024-01-14', value: 27050, change: -0.8 },
    { date: '2024-01-13', value: 27267, change: 1.2 },
    { date: '2024-01-12', value: 26940, change: -2.1 },
    { date: '2024-01-11', value: 27520, change: 3.4 },
    { date: '2024-01-10', value: 26610, change: -1.5 },
    { date: '2024-01-09', value: 27015, change: 0.9 }
  ]);

  useEffect(() => {
    // Calculate real portfolio value from wallets
    const totalBalance = wallets.reduce((sum, wallet) => {
      return sum + parseFloat(wallet.balance || '0');
    }, 0);
    
    setPerformanceData(prev => ({
      ...prev,
      totalValue: totalBalance * 280000 // Convert to BRL
    }));
  }, [wallets]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const color = value >= 0 ? 'text-emerald-400' : 'text-red-400';
    const icon = value >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />;
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span>{Math.abs(value).toFixed(2)}%</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-dark via-dashboard-medium to-dashboard-dark">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Analytics de Performance</h1>
                <p className="text-sm text-muted-foreground">
                  Análise detalhada do desempenho do seu portfólio
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500/30 text-blue-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-satotrack-neon/30 text-satotrack-neon"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(performanceData.totalValue)}
                  </p>
                  {formatPercentage(performanceData.dailyChange)}
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Performance 7d</p>
                  <p className="text-2xl font-bold text-white">{performanceData.weeklyChange}%</p>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 mt-2">
                    Baixa
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Performance 30d</p>
                  <p className="text-2xl font-bold text-white">+{performanceData.monthlyChange}%</p>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 mt-2">
                    Alta
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Melhor Asset</p>
                  <p className="text-2xl font-bold text-white">{performanceData.bestPerformer}</p>
                  <Badge variant="outline" className="border-bitcoin/30 text-bitcoin mt-2">
                    +12.4%
                  </Badge>
                </div>
                <div className="w-12 h-12 rounded-xl bg-bitcoin/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-bitcoin" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="breakdown">Composição</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    Evolução do Portfólio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-dashboard-dark/50 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Gráfico de Performance (7 dias)</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Máximo</p>
                      <p className="text-sm font-medium text-emerald-400">
                        {formatCurrency(28500)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Mínimo</p>
                      <p className="text-sm font-medium text-red-400">
                        {formatCurrency(26200)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Média</p>
                      <p className="text-sm font-medium text-blue-400">
                        {formatCurrency(27350)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Métricas Principais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ROI Total</span>
                    <span className="text-emerald-400 font-medium">+{performanceData.yearlyChange}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="text-white font-medium">1.47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Volatilidade</span>
                    <span className="text-orange-400 font-medium">18.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="text-red-400 font-medium">-12.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dias de Holding</span>
                    <span className="text-blue-400 font-medium">{performanceData.averageHolding}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-400" />
                  Composição do Portfólio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioBreakdown.map((asset) => (
                    <div 
                      key={asset.symbol}
                      className="flex items-center justify-between p-4 bg-dashboard-dark/50 rounded-lg border border-dashboard-light/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-bitcoin to-orange-500 flex items-center justify-center text-white font-bold">
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{asset.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.percentage}% do portfólio
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {formatCurrency(asset.value)}
                        </p>
                        {formatPercentage(asset.change)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-dashboard-medium/30 border-dashboard-light/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Histórico de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPerformance.map((day, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-dashboard-dark/30 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {new Date(day.date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Valor do portfólio
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {formatCurrency(day.value)}
                        </p>
                        {formatPercentage(day.change)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-emerald-300">📈 Insights Positivos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-emerald-200">
                  <p>• Seu portfólio superou o Bitcoin em 2.3% este mês</p>
                  <p>• Diversificação está balanceada com 4 ativos principais</p>
                  <p>• Performance anual está 15% acima da média do mercado</p>
                  <p>• Consistência de ganhos nos últimos 30 dias</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 border border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-orange-300">⚠️ Pontos de Atenção</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-orange-200">
                  <p>• Alta exposição ao Bitcoin pode aumentar volatilidade</p>
                  <p>• Considere rebalancear quando BTC atingir 50%</p>
                  <p>• Performance semanal negativa indica correção</p>
                  <p>• Monitor de stop-loss recomendado para ETH</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsDetailed;