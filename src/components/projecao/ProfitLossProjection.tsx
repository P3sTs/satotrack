
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Calculator, Target, AlertTriangle } from 'lucide-react';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ProjectionData {
  date: string;
  optimistic: number;
  realistic: number;
  pessimistic: number;
  currentValue: number;
}

const ProfitLossProjection: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [timeframe, setTimeframe] = useState(30); // dias
  const [btcGrowthRate, setBtcGrowthRate] = useState([5]); // % ao mês
  
  const totalBalance = carteiras.reduce((sum, wallet) => sum + wallet.saldo, 0);
  const currentValueBRL = totalBalance * (bitcoinData?.price_brl || 0);
  
  // Calcular média de entrada/saída das últimas semanas
  const avgWeeklyFlow = useMemo(() => {
    const totalReceived = carteiras.reduce((sum, wallet) => sum + wallet.total_entradas, 0);
    const totalSent = carteiras.reduce((sum, wallet) => sum + wallet.total_saidas, 0);
    const netFlow = totalReceived - totalSent;
    
    // Assumindo que os dados representam atividade dos últimos 30 dias
    return netFlow / 4; // por semana
  }, [carteiras]);

  const projectionData = useMemo(() => {
    const data: ProjectionData[] = [];
    const daysToProject = timeframe;
    const monthlyGrowth = btcGrowthRate[0] / 100;
    const dailyGrowth = Math.pow(1 + monthlyGrowth, 1/30) - 1;
    
    for (let i = 0; i <= daysToProject; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Crescimento do Bitcoin (otimista +50%, pessimista -30% da previsão)
      const optimisticGrowth = dailyGrowth * 1.5;
      const realisticGrowth = dailyGrowth;
      const pessimisticGrowth = dailyGrowth * 0.7;
      
      // Simulação de acúmulo de Bitcoin baseado no fluxo médio
      const weeksElapsed = i / 7;
      const additionalBTC = (avgWeeklyFlow * weeksElapsed) / (bitcoinData?.price_brl || 1);
      const projectedBalance = totalBalance + additionalBTC;
      
      // Valor futuro considerando crescimento do BTC
      const baseValue = projectedBalance * (bitcoinData?.price_brl || 0);
      
      data.push({
        date: date.toLocaleDateString('pt-BR'),
        optimistic: baseValue * Math.pow(1 + optimisticGrowth, i),
        realistic: baseValue * Math.pow(1 + realisticGrowth, i),
        pessimistic: baseValue * Math.pow(1 + pessimisticGrowth, i),
        currentValue: currentValueBRL
      });
    }
    
    return data;
  }, [timeframe, btcGrowthRate, totalBalance, currentValueBRL, avgWeeklyFlow, bitcoinData]);

  const finalProjection = projectionData[projectionData.length - 1];
  const realisticReturn = finalProjection ? finalProjection.realistic - currentValueBRL : 0;
  const returnPercentage = currentValueBRL > 0 ? (realisticReturn / currentValueBRL) * 100 : 0;

  const getRecommendation = () => {
    if (returnPercentage > 20) {
      return {
        type: 'positive',
        icon: TrendingUp,
        title: 'Tendência Altista Forte',
        message: 'Com base na análise, manter e aumentar posição pode ser uma boa estratégia.',
        action: 'Considere aumentar seus aportes gradualmente.'
      };
    } else if (returnPercentage > 5) {
      return {
        type: 'neutral',
        icon: Target,
        title: 'Crescimento Moderado',
        message: 'Projeção positiva mas conservadora. Manter estratégia atual.',
        action: 'Continue monitorando e mantendo disciplina.'
      };
    } else {
      return {
        type: 'warning',
        icon: AlertTriangle,
        title: 'Atenção Necessária',
        message: 'Crescimento baixo ou risco de perda. Revisar estratégia.',
        action: 'Considere diversificar ou reduzir exposição.'
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-satotrack-neon" />
            Projeção de Lucro e Prejuízo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium flex justify-between">
                <span>Período de Projeção</span>
                <span className="text-satotrack-neon">{timeframe} dias</span>
              </label>
              <Slider
                value={[timeframe]}
                onValueChange={(value) => setTimeframe(value[0])}
                min={7}
                max={365}
                step={7}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium flex justify-between">
                <span>Expectativa de Crescimento do BTC</span>
                <span className="text-satotrack-neon">{btcGrowthRate[0]}% ao mês</span>
              </label>
              <Slider
                value={btcGrowthRate}
                onValueChange={setBtcGrowthRate}
                min={-10}
                max={25}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Métricas Atuais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-dashboard-medium">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-satotrack-neon">
                  {totalBalance.toFixed(8)} BTC
                </div>
                <div className="text-sm text-muted-foreground">Saldo Atual</div>
                <div className="text-lg font-medium">
                  R$ {currentValueBRL.toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dashboard-medium">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Retorno Projetado</div>
                <div className={`text-lg font-medium ${realisticReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {realisticReturn >= 0 ? '+' : ''}R$ {Math.abs(realisticReturn).toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dashboard-medium">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  R$ {Math.abs(avgWeeklyFlow).toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-muted-foreground">Fluxo Semanal Médio</div>
                <div className={`text-sm ${avgWeeklyFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {avgWeeklyFlow >= 0 ? 'Entrada líquida' : 'Saída líquida'}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Projeção */}
      <Card>
        <CardHeader>
          <CardTitle>Cenários de Projeção ({timeframe} dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)"
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `R$ ${value.toLocaleString('pt-BR')}`,
                    name === 'optimistic' ? 'Otimista' : 
                    name === 'realistic' ? 'Realista' : 'Pessimista'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#1A1F2C', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="optimistic" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="url(#optimistic)"
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="realistic" 
                  stackId="2"
                  stroke="#00d4ff" 
                  fill="url(#realistic)"
                  fillOpacity={0.5}
                />
                <Area 
                  type="monotone" 
                  dataKey="pessimistic" 
                  stackId="3"
                  stroke="#ef4444" 
                  fill="url(#pessimistic)"
                  fillOpacity={0.3}
                />
                <defs>
                  <linearGradient id="optimistic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="realistic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="pessimistic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recomendação */}
      <Card className={`border-l-4 ${
        recommendation.type === 'positive' ? 'border-l-green-500 bg-green-500/5' :
        recommendation.type === 'neutral' ? 'border-l-blue-500 bg-blue-500/5' :
        'border-l-amber-500 bg-amber-500/5'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <recommendation.icon className={`h-8 w-8 mt-1 ${
              recommendation.type === 'positive' ? 'text-green-500' :
              recommendation.type === 'neutral' ? 'text-blue-500' :
              'text-amber-500'
            }`} />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{recommendation.title}</h3>
              <p className="text-muted-foreground mb-3">{recommendation.message}</p>
              <p className="font-medium">{recommendation.action}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLossProjection;
