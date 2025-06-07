
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator } from 'lucide-react';

const ROICalculator: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState('1000');
  const [targetProfit, setTargetProfit] = useState('20');
  const [timeFrame, setTimeFrame] = useState('30');

  return (
    <Card className="bg-gradient-to-br from-dashboard-dark to-dashboard-darker border-satotrack-neon/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-satotrack-neon">
          <Calculator className="h-5 w-5" />
          Calculadora de ROI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Valor do Investimento (USD)</label>
          <Input 
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="1000"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Meta de Lucro (%)</label>
          <Input 
            value={targetProfit}
            onChange={(e) => setTargetProfit(e.target.value)}
            placeholder="20"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Prazo (dias)</label>
          <Input 
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            placeholder="30"
          />
        </div>
        
        <div className="p-4 rounded-lg bg-muted/50 border border-satotrack-neon/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              ${(parseFloat(investmentAmount) * (1 + parseFloat(targetProfit) / 100)).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Valor projetado em {timeFrame} dias
            </div>
            <div className="text-sm text-green-500">
              +${(parseFloat(investmentAmount) * parseFloat(targetProfit) / 100).toFixed(2)} lucro
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-satotrack-neon text-black hover:bg-satotrack-neon/90">
          Calcular Estratégia
        </Button>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
