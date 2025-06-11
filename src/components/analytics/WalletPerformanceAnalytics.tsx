
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb,
  Crown,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatBitcoinValue, formatCurrency } from '@/utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WalletPerformance {
  id: string;
  name: string;
  currentBalance: number;
  weeklyChange: number;
  monthlyChange: number;
  transactionCount: number;
  averageReceived: number;
  riskScore: number;
  status: 'high_performer' | 'stable' | 'declining';
}

const WalletPerformanceAnalytics: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [performanceData, setPerformanceData] = useState<WalletPerformance[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  useEffect(() => {
    calculatePerformanceMetrics();
  }, [carteiras, timeRange]);

  const calculatePerformanceMetrics = () => {
    const metrics = carteiras.map(carteira => {
      // Simulação de dados de performance (em produção viria do backend)
      const weeklyChange = (Math.random() - 0.5) * 20; // -10% a +10%
      const monthlyChange = (Math.random() - 0.3) * 30; // -15% a +15%
      const transactionCount = Math.floor(Math.random() * 50) + 5;
      const averageReceived = carteira.saldo / transactionCount;
      const riskScore = Math.random() * 100;

      let status: 'high_performer' | 'stable' | 'declining' = 'stable';
      if (monthlyChange > 5) status = 'high_performer';
      else if (monthlyChange < -5) status = 'declining';

      return {
        id: carteira.id,
        name: carteira.nome,
        currentBalance: carteira.saldo,
        weeklyChange,
        monthlyChange,
        transactionCount,
        averageReceived,
        riskScore,
        status
      };
    });

    // Ordenar por performance mensal
    metrics.sort((a, b) => b.monthlyChange - a.monthlyChange);
    setPerformanceData(metrics);
  };

  const generateInsights = (wallet: WalletPerformance) => {
    const insights = [];
    
    if (wallet.status === 'high_performer') {
      insights.push(`🏆 Carteira ${wallet.name} teve excelente performance (+${wallet.monthlyChange.toFixed(1)}% no mês)`);
      insights.push(`📈 Padrão detectado: ${wallet.transactionCount} transações com média de ${formatBitcoinValue(wallet.averageReceived)}`);
      
      if (wallet.averageReceived < 0.001) {
        insights.push(`💡 Estratégia eficaz: Pequenos recebimentos frequentes demonstram disciplina de acúmulo`);
      } else {
        insights.push(`💡 Estratégia detectada: Recebimentos de maior volume, indicando investimento concentrado`);
      }
    }

    if (wallet.riskScore < 30) {
      insights.push(`🛡️ Baixo risco: Carteira estável com movimentação controlada`);
    } else if (wallet.riskScore > 70) {
      insights.push(`⚠️ Alto risco: Carteira com alta volatilidade - considere diversificar`);
    }

    return insights;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high_performer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declining': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high_performer': return <TrendingUp className="h-4 w-4" />;
      case 'declining': return <TrendingDown className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const chartData = performanceData.map((wallet, index) => ({
    name: wallet.name,
    performance: wallet.monthlyChange,
    transactions: wallet.transactionCount,
    risk: wallet.riskScore
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-dashboard-dark border-satotrack-neon/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-satotrack-neon" />
              Inteligência de Lucros
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={timeRange === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7d')}
              >
                7D
              </Button>
              <Button
                variant={timeRange === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30d')}
              >
                30D
              </Button>
              <Button
                variant={timeRange === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('90d')}
              >
                90D
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="comparison">Comparação</TabsTrigger>
              <TabsTrigger value="insights">Insights IA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performanceData.map((wallet) => (
                  <Card
                    key={wallet.id}
                    className={`cursor-pointer transition-all duration-200 hover:border-satotrack-neon/40 ${
                      selectedWallet === wallet.id ? 'border-satotrack-neon' : 'border-dashboard-medium/50'
                    }`}
                    onClick={() => setSelectedWallet(wallet.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium truncate">{wallet.name}</h3>
                        <Badge className={getStatusColor(wallet.status)}>
                          {getStatusIcon(wallet.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Saldo</span>
                          <span className="font-medium">{formatBitcoinValue(wallet.currentBalance)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Performance {timeRange}</span>
                          <div className="flex items-center gap-1">
                            {wallet.monthlyChange > 0 ? (
                              <ArrowUpRight className="h-3 w-3 text-green-400" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-400" />
                            )}
                            <span className={`text-sm font-medium ${
                              wallet.monthlyChange > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {wallet.monthlyChange > 0 ? '+' : ''}{wallet.monthlyChange.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Transações</span>
                          <span className="text-sm">{wallet.transactionCount}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risco</span>
                          <span className={`text-sm font-medium ${
                            wallet.riskScore < 30 ? 'text-green-400' : 
                            wallet.riskScore > 70 ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {wallet.riskScore.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#00d4ff" 
                      strokeWidth={2}
                      name="Performance (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Melhor Performance</span>
                    </div>
                    {performanceData[0] && (
                      <div>
                        <p className="font-medium">{performanceData[0].name}</p>
                        <p className="text-sm text-muted-foreground">
                          +{performanceData[0].monthlyChange.toFixed(1)}% no mês
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Mais Ativa</span>
                    </div>
                    {performanceData.reduce((prev, current) => 
                      prev.transactionCount > current.transactionCount ? prev : current
                    ) && (
                      <div>
                        <p className="font-medium">
                          {performanceData.reduce((prev, current) => 
                            prev.transactionCount > current.transactionCount ? prev : current
                          ).name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {performanceData.reduce((prev, current) => 
                            prev.transactionCount > current.transactionCount ? prev : current
                          ).transactionCount} transações
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-500/10 border-yellow-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Menor Risco</span>
                    </div>
                    {performanceData.reduce((prev, current) => 
                      prev.riskScore < current.riskScore ? prev : current
                    ) && (
                      <div>
                        <p className="font-medium">
                          {performanceData.reduce((prev, current) => 
                            prev.riskScore < current.riskScore ? prev : current
                          ).name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {performanceData.reduce((prev, current) => 
                            prev.riskScore < current.riskScore ? prev : current
                          ).riskScore.toFixed(0)}% risco
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
              {selectedWallet ? (
                <div className="space-y-4">
                  {performanceData
                    .filter(w => w.id === selectedWallet)
                    .map(wallet => (
                      <Card key={wallet.id} className="bg-dashboard-medium/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-satotrack-neon" />
                            Insights para {wallet.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {generateInsights(wallet).map((insight, index) => (
                              <div 
                                key={index}
                                className="p-3 bg-dashboard-dark rounded-lg border border-satotrack-neon/20"
                              >
                                <p className="text-sm">{insight}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-dashboard-medium">
                            <h4 className="font-medium mb-3">Recomendações Estratégicas:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <h5 className="text-sm font-medium text-green-400 mb-1">
                                  Para Manter Performance
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                  Continue com o padrão atual de {wallet.transactionCount} transações/mês
                                </p>
                              </div>
                              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <h5 className="text-sm font-medium text-blue-400 mb-1">
                                  Para Otimizar
                                </h5>
                                <p className="text-xs text-muted-foreground">
                                  {wallet.riskScore > 50 ? 
                                    'Reduza a frequência de movimentações para diminuir o risco' :
                                    'Considere aumentar a frequência de small purchases (DCA)'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card className="bg-dashboard-medium/30">
                  <CardContent className="p-8 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Selecione uma carteira na aba Performance para ver insights detalhados
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPerformanceAnalytics;
