
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Activity,
  Zap,
  Clock,
  DollarSign,
  Lightbulb
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RiskMetrics {
  walletId: string;
  walletName: string;
  volatilityScore: number;
  movementFrequency: number;
  networkFeeImpact: number;
  balanceStability: number;
  riskLevel: 'low' | 'medium' | 'high';
  alerts: string[];
}

const RiskVolatilityAnalysis: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics[]>([]);
  const [networkFeeRate, setNetworkFeeRate] = useState(25); // sat/vB simulado
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '48h' | '7d'>('48h');

  useEffect(() => {
    calculateRiskMetrics();
  }, [carteiras, selectedTimeframe]);

  const calculateRiskMetrics = () => {
    const metrics = carteiras.map(carteira => {
      // Simulação de dados de risco (em produção viria de análise real)
      const volatilityScore = Math.random() * 100;
      const movementFrequency = Math.floor(Math.random() * 20) + 1; // transações/dia
      const networkFeeImpact = (movementFrequency * networkFeeRate * 0.00001); // BTC
      const balanceStability = 100 - (Math.random() * 50); // %
      
      // Calcular nível de risco
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (volatilityScore > 70 || movementFrequency > 15) riskLevel = 'high';
      else if (volatilityScore > 40 || movementFrequency > 8) riskLevel = 'medium';

      // Gerar alertas
      const alerts = [];
      if (movementFrequency > 10) {
        alerts.push('Alta frequência de movimentações detectada - considere consolidar transações');
      }
      if (networkFeeImpact > 0.0001) {
        alerts.push(`Impacto de taxas alto: ${(networkFeeImpact * 100000).toFixed(0)} sats/dia`);
      }
      if (balanceStability < 60) {
        alerts.push('Baixa estabilidade de saldo - alta volatilidade detectada');
      }
      if (volatilityScore > 80) {
        alerts.push('Padrão de uso de alto risco identificado');
      }

      return {
        walletId: carteira.id,
        walletName: carteira.nome,
        volatilityScore,
        movementFrequency,
        networkFeeImpact,
        balanceStability,
        riskLevel,
        alerts
      };
    });

    setRiskMetrics(metrics);
  };

  // Dados simulados para o gráfico de variação de saldo
  const generateBalanceVariationData = () => {
    const hours = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '48h' ? 48 : 168;
    const data = [];
    
    for (let i = 0; i < hours; i++) {
      const baseValue = 1000000; // sats
      const variation = (Math.sin(i / 4) + Math.random() - 0.5) * 50000;
      data.push({
        time: i + 'h',
        value: baseValue + variation,
        timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000)
      });
    }
    
    return data;
  };

  const balanceData = generateBalanceVariationData();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Activity className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const averageRisk = riskMetrics.reduce((acc, metric) => acc + metric.volatilityScore, 0) / riskMetrics.length || 0;
  const totalAlerts = riskMetrics.reduce((acc, metric) => acc + metric.alerts.length, 0);

  return (
    <div className="space-y-6">
      {/* Header com métricas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-dashboard-dark border-satotrack-neon/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-satotrack-neon" />
              <span className="text-sm font-medium">Risco Médio</span>
            </div>
            <div className="text-2xl font-bold text-satotrack-neon">
              {averageRisk.toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-dark border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Taxa Rede</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {networkFeeRate} sat/vB
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-dark border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium">Alertas Ativos</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {totalAlerts}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dashboard-dark border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">Período</span>
            </div>
            <div className="text-lg font-bold text-blue-400">
              {selectedTimeframe}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de variação de saldo */}
      <Card className="bg-dashboard-dark border-satotrack-neon/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-satotrack-neon" />
              Variação de Saldo - {selectedTimeframe}
            </CardTitle>
            <div className="flex gap-2">
              {['24h', '48h', '7d'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedTimeframe(period as any)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedTimeframe === period
                      ? 'bg-satotrack-neon text-dashboard-dark'
                      : 'bg-dashboard-medium text-muted-foreground hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} sats`, 'Saldo']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00d4ff"
                  fill="rgba(0, 212, 255, 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Análise por carteira */}
      <Card className="bg-dashboard-dark border-satotrack-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-satotrack-neon" />
            Análise de Risco por Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskMetrics.map(metric => (
              <div key={metric.walletId} className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-medium">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{metric.walletName}</h3>
                  <Badge className={getRiskColor(metric.riskLevel)}>
                    {getRiskIcon(metric.riskLevel)}
                    <span className="ml-1 capitalize">{metric.riskLevel}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Volatilidade</div>
                    <div className="text-lg font-semibold text-satotrack-neon">
                      {metric.volatilityScore.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Freq. Movimentação</div>
                    <div className="text-lg font-semibold">
                      {metric.movementFrequency}/dia
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Impacto Taxa</div>
                    <div className="text-lg font-semibold text-yellow-400">
                      {(metric.networkFeeImpact * 100000).toFixed(0)} sats
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Estabilidade</div>
                    <div className="text-lg font-semibold text-green-400">
                      {metric.balanceStability.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {metric.alerts.length > 0 && (
                  <div className="space-y-2">
                    {metric.alerts.map((alert, index) => (
                      <Alert key={index} className="border-orange-500/30 bg-orange-500/10">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <AlertDescription className="text-orange-200">
                          {alert}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações gerais */}
      <Card className="bg-gradient-to-r from-dashboard-dark to-dashboard-medium border-satotrack-neon/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-satotrack-neon" />
            Recomendações de Otimização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h4 className="font-medium text-green-400 mb-2">✅ Para Reduzir Riscos</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Consolide pequenas transações em horários de taxa baixa</li>
                <li>• Evite movimentações frequentes em períodos de alta volatilidade</li>
                <li>• Use carteiras com histórico de estabilidade para valores maiores</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="font-medium text-blue-400 mb-2">🎯 Para Otimizar Custos</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Monitore taxas da rede antes de grandes movimentações</li>
                <li>• Configure alertas para taxas abaixo de 20 sat/vB</li>
                <li>• Agrupe transações menores quando possível</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskVolatilityAnalysis;
