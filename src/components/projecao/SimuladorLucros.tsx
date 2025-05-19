
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Gauge, Calculator, Info } from 'lucide-react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { simularProjecaoLucro } from '@/utils/projecaoCalculations';
import { useAuth } from '@/contexts/auth';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';

interface SimuladorLucrosProps {
  saldoInicial?: number;
  walletId?: string;
}

const SimuladorLucros: React.FC<SimuladorLucrosProps> = ({ saldoInicial = 0, walletId }) => {
  const [saldoBTC, setSaldoBTC] = useState(saldoInicial || 0.1);
  const [periodoSimulacao, setPeriodoSimulacao] = useState(30);
  const [expectativaValorizacao, setExpectativaValorizacao] = useState(5);
  const [resultado, setResultado] = useState<{
    lucroProjetado: number;
    percentualRendimento: number;
    riscoEstimado: number;
  } | null>(null);
  
  const { data: bitcoinData } = useBitcoinPrice();
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  const simular = () => {
    if (!bitcoinData) return;
    
    const resultadoSimulacao = simularProjecaoLucro(
      saldoBTC,
      periodoSimulacao,
      expectativaValorizacao,
      bitcoinData.price_usd
    );
    
    setResultado(resultadoSimulacao);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="text-satotrack-neon h-5 w-5" />
          Simulador de Projeção
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Valor em BTC */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Quantidade de Bitcoin
              <Info className="h-4 w-4 text-muted-foreground" />
            </label>
            <Input
              type="number"
              value={saldoBTC}
              onChange={(e) => setSaldoBTC(parseFloat(e.target.value) || 0)}
              step="0.001"
              min="0"
              className="bg-background/50"
            />
          </div>
          
          {/* Período de simulação */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              <span className="flex items-center gap-1">
                Período (dias)
                <Info className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="text-satotrack-neon">{periodoSimulacao} dias</span>
            </label>
            <Slider
              value={[periodoSimulacao]}
              min={7}
              max={isPremium ? 365 : 90}
              step={1}
              onValueChange={(value) => setPeriodoSimulacao(value[0])}
            />
            {!isPremium && periodoSimulacao > 30 && (
              <p className="text-xs text-amber-500 mt-1">
                Períodos maiores que 90 dias disponíveis apenas para Premium
              </p>
            )}
          </div>
          
          {/* Expectativa de valorização */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              <span className="flex items-center gap-1">
                Expectativa de valorização
                <Info className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="text-satotrack-neon">{expectativaValorizacao}%</span>
            </label>
            <Slider
              value={[expectativaValorizacao]}
              min={-20}
              max={20}
              step={1}
              onValueChange={(value) => setExpectativaValorizacao(value[0])}
            />
          </div>
          
          <Button 
            onClick={simular} 
            className="w-full mt-2"
            variant="default"
          >
            Simular Projeção
          </Button>
        </div>
        
        {resultado && (
          <div className="mt-6 space-y-4 p-4 border rounded-lg bg-card/50">
            <h3 className="text-lg font-semibold text-center">Resultado da Simulação</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Lucro Projetado</p>
                <p className={`text-lg font-bold ${resultado.lucroProjetado >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {resultado.lucroProjetado.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Rendimento</p>
                <p className={`text-lg font-bold ${resultado.percentualRendimento >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {resultado.percentualRendimento.toFixed(2)}%
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Risco Estimado</p>
                <div className="flex items-center justify-center">
                  <Gauge className="h-4 w-4 mr-1 text-amber-500" />
                  <p className="text-amber-500 font-medium">
                    {resultado.riscoEstimado.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            <PremiumFeatureGate
              fallback={
                <div className="text-xs text-center text-muted-foreground mt-4">
                  <p>Desbloqueie simulações avançadas com o plano Premium</p>
                </div>
              }
            >
              <div className="text-xs text-center text-muted-foreground mt-4">
                <p>Esta simulação considera fatores históricos e tendências de mercado</p>
                <p>Os resultados são estimativas e não garantem retornos futuros</p>
              </div>
            </PremiumFeatureGate>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimuladorLucros;
