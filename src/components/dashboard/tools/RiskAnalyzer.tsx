
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCarteiras } from '@/contexts/carteiras';
import { useSatoAI } from '@/hooks/useSatoAI';

const RiskAnalyzer: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { askSatoAI, isLoading } = useSatoAI();
  const [analysis, setAnalysis] = useState<string>('');
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  // Mock data for portfolio distribution
  const portfolioData = [
    { name: 'Bitcoin', value: 68, color: '#f7931a' },
    { name: 'Ethereum', value: 20, color: '#627eea' },
    { name: 'Altcoins', value: 12, color: '#3cc3f0' }
  ];

  const analyzeRisk = async () => {
    const portfolioInfo = {
      totalWallets: carteiras.length,
      distribution: portfolioData,
      totalBalance: carteiras.reduce((acc, w) => acc + w.saldo, 0)
    };
    
    const result = await askSatoAI(
      `Analise meu perfil de risco baseado na seguinte distribuição de portfólio: ${JSON.stringify(portfolioInfo)}. 
      Classifique como conservador, moderado ou agressivo e sugira rebalanceamento.`,
      'Análise de Risco'
    );
    
    if (result) {
      setAnalysis(result);
    }
  };

  const getRiskColor = () => {
    switch (riskProfile) {
      case 'conservative': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'aggressive': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getRiskIcon = () => {
    switch (riskProfile) {
      case 'conservative': return <Shield className="h-5 w-5" />;
      case 'moderate': return <AlertTriangle className="h-5 w-5" />;
      case 'aggressive': return <TrendingUp className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <Shield className="h-5 w-5" />
          Análise de Risco
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Distribuição do Portfólio</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className={getRiskColor()}>{getRiskIcon()}</span>
                <span className="font-medium">Perfil: Moderado</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seu portfólio apresenta uma concentração equilibrada com foco em Bitcoin.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium">Métricas de Risco</h5>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Concentração BTC:</span>
                  <span className="text-orange-400">68%</span>
                </div>
                <div className="flex justify-between">
                  <span>Diversificação:</span>
                  <span className="text-yellow-400">Média</span>
                </div>
                <div className="flex justify-between">
                  <span>Volatilidade:</span>
                  <span className="text-green-400">Baixa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={analyzeRisk} 
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isLoading ? 'Analisando...' : 'Analisar com SatoAI'}
        </Button>

        {analysis && (
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <h5 className="font-medium text-orange-400 mb-2">📊 Análise da IA</h5>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAnalyzer;
