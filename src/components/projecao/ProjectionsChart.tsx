
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { TrendingUp, Calculator, Target } from 'lucide-react';

const ProjectionsChart: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [timeframe, setTimeframe] = useState('6m');
  const [scenario, setScenario] = useState('moderate');
  const [projectionData, setProjectionData] = useState<any[]>([]);

  useEffect(() => {
    generateProjections();
  }, [carteiras, bitcoinData, timeframe, scenario]);

  const generateProjections = () => {
    if (!bitcoinData || carteiras.length === 0) return;

    const currentBalance = carteiras.reduce((acc, carteira) => acc + carteira.saldo, 0);
    const currentValueBRL = currentBalance * bitcoinData.price_brl;
    
    // Cenários de crescimento
    const scenarios = {
      conservative: { monthly: 0.02, volatility: 0.1 }, // 2% ao mês
      moderate: { monthly: 0.05, volatility: 0.15 },    // 5% ao mês
      aggressive: { monthly: 0.10, volatility: 0.25 }   // 10% ao mês
    };

    const selectedScenario = scenarios[scenario as keyof typeof scenarios];
    const months = timeframe === '3m' ? 3 : timeframe === '6m' ? 6 : 12;
    
    const data = [];
    let currentValue = currentValueBRL;
    
    for (let i = 0; i <= months; i++) {
      const monthlyGrowth = selectedScenario.monthly;
      const volatility = selectedScenario.volatility;
      
      // Aplicar crescimento com volatilidade
      const baseGrowth = Math.pow(1 + monthlyGrowth, i);
      const volatilityFactor = 1 + (Math.random() - 0.5) * volatility;
      
      const projectedValue = currentValueBRL * baseGrowth * volatilityFactor;
      const btcEquivalent = projectedValue / bitcoinData.price_brl;
      
      data.push({
        month: i === 0 ? 'Atual' : `+${i}m`,
        value: projectedValue,
        btc: btcEquivalent,
        conservative: currentValueBRL * Math.pow(1 + scenarios.conservative.monthly, i),
        moderate: currentValueBRL * Math.pow(1 + scenarios.moderate.monthly, i),
        aggressive: currentValueBRL * Math.pow(1 + scenarios.aggressive.monthly, i),
      });
    }

    setProjectionData(data);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatBTC = (value: number) => {
    return `${value.toFixed(6)} BTC`;
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'conservative': return '#10b981'; // green
      case 'moderate': return '#3b82f6';     // blue
      case 'aggressive': return '#f59e0b';   // yellow
      default: return '#8b5cf6';             // purple
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-400" />
            Configurações de Projeção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 meses</SelectItem>
                  <SelectItem value="6m">6 meses</SelectItem>
                  <SelectItem value="12m">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Cenário</label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cenário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservador (2% ao mês)</SelectItem>
                  <SelectItem value="moderate">Moderado (5% ao mês)</SelectItem>
                  <SelectItem value="aggressive">Agressivo (10% ao mês)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projection Chart */}
      <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-medium border-dashboard-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-satotrack-neon" />
            Projeção de Crescimento Patrimonial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'value' ? 'Valor Projetado' : name
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="conservative"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  name="Conservador"
                />
                <Area
                  type="monotone"
                  dataKey="moderate"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  name="Moderado"
                />
                <Area
                  type="monotone"
                  dataKey="aggressive"
                  stackId="3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  name="Agressivo"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00d4ff"
                  strokeWidth={3}
                  dot={{ fill: '#00d4ff', strokeWidth: 2, r: 4 }}
                  name="Cenário Selecionado"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projectionData.length > 0 && (
          <>
            <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Atual</p>
                    <p className="text-xl font-bold text-green-400">
                      {formatCurrency(projectionData[0]?.value || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBTC(projectionData[0]?.btc || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Projeção Final</p>
                    <p className="text-xl font-bold text-blue-400">
                      {formatCurrency(projectionData[projectionData.length - 1]?.value || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBTC(projectionData[projectionData.length - 1]?.btc || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calculator className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Crescimento</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {projectionData.length > 0 ? 
                        `+${(((projectionData[projectionData.length - 1]?.value || 0) / (projectionData[0]?.value || 1) - 1) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Em {timeframe === '3m' ? '3 meses' : timeframe === '6m' ? '6 meses' : '1 ano'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectionsChart;
