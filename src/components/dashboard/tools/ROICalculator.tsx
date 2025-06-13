
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Save, Download, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ROIStrategy {
  id: string;
  name: string;
  investment: number;
  targetProfit: number;
  timeFrame: number;
  currency: string;
  expectedReturn: number;
  createdAt: string;
}

const ROICalculator: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState('1000');
  const [targetProfit, setTargetProfit] = useState('20');
  const [timeFrame, setTimeFrame] = useState('30');
  const [currency, setCurrency] = useState('USD');
  const [savedStrategies, setSavedStrategies] = useState<ROIStrategy[]>([]);

  // Dados simulados para o gráfico de projeção
  const projectionData = [
    { day: 0, value: parseFloat(investmentAmount) || 1000 },
    { day: 7, value: (parseFloat(investmentAmount) || 1000) * 1.05 },
    { day: 14, value: (parseFloat(investmentAmount) || 1000) * 1.12 },
    { day: 21, value: (parseFloat(investmentAmount) || 1000) * 1.16 },
    { day: parseInt(timeFrame) || 30, value: (parseFloat(investmentAmount) || 1000) * (1 + (parseFloat(targetProfit) || 20) / 100) }
  ];

  const calculateROI = () => {
    const investment = parseFloat(investmentAmount);
    const profit = parseFloat(targetProfit);
    const expectedReturn = investment * (1 + profit / 100);
    return expectedReturn;
  };

  const saveStrategy = () => {
    const strategy: ROIStrategy = {
      id: Date.now().toString(),
      name: `Estratégia ${currency} - ${targetProfit}%`,
      investment: parseFloat(investmentAmount),
      targetProfit: parseFloat(targetProfit),
      timeFrame: parseInt(timeFrame),
      currency,
      expectedReturn: calculateROI(),
      createdAt: new Date().toLocaleDateString()
    };
    
    setSavedStrategies([...savedStrategies, strategy]);
  };

  const exportToPDF = () => {
    // Simular exportação para PDF
    console.log('Exportando relatório ROI para PDF...');
  };

  const currencySymbols = {
    USD: '$',
    BRL: 'R$',
    BTC: '₿',
    ETH: 'Ξ'
  };

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-satotrack-neon">
          <Calculator className="h-5 w-5" />
          Calculadora de ROI Avançada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Valor do Investimento</label>
            <div className="flex gap-2">
              <Input 
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="1000"
                type="number"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta de Lucro (%)</label>
            <Input 
              value={targetProfit}
              onChange={(e) => setTargetProfit(e.target.value)}
              placeholder="20"
              type="number"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Prazo (dias)</label>
            <Input 
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              placeholder="30"
              type="number"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">ROI Diário Necessário</label>
            <div className="p-2 bg-muted rounded text-center font-mono">
              {((parseFloat(targetProfit) || 20) / (parseInt(timeFrame) || 30)).toFixed(3)}%
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-muted/50 border border-satotrack-neon/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-satotrack-neon">
              {currencySymbols[currency as keyof typeof currencySymbols]}{calculateROI().toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Valor projetado em {timeFrame} dias
            </div>
            <div className="text-sm text-green-500 font-medium mt-1">
              +{currencySymbols[currency as keyof typeof currencySymbols]}{((calculateROI() - parseFloat(investmentAmount))).toLocaleString()} lucro
            </div>
          </div>
        </div>

        {/* Gráfico de Projeção */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-satotrack-neon" />
            <span className="font-medium">Projeção de Crescimento</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #00d4ff',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [
                    `${currencySymbols[currency as keyof typeof currencySymbols]}${value.toLocaleString()}`,
                    'Valor'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00d4ff"
                  strokeWidth={3}
                  dot={{ fill: '#00d4ff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={saveStrategy}
            className="flex items-center gap-2 bg-satotrack-neon text-black hover:bg-satotrack-neon/90"
          >
            <Save className="h-4 w-4" />
            Salvar Estratégia
          </Button>
          <Button 
            onClick={exportToPDF}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>

        {/* Estratégias Salvas */}
        {savedStrategies.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-satotrack-neon">📊 Estratégias Salvas</h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {savedStrategies.map((strategy) => (
                <div key={strategy.id} className="p-2 bg-dashboard-medium/50 rounded flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{strategy.name}</span>
                    <span className="text-muted-foreground ml-2">({strategy.createdAt})</span>
                  </div>
                  <div className="text-green-500 font-medium">
                    {currencySymbols[strategy.currency as keyof typeof currencySymbols]}{strategy.expectedReturn.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
