
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { Calculator, ArrowUp, ArrowDown, Percent } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatBitcoinValue } from '@/utils/formatters';
import { simularProjecaoLucro } from '@/utils/projecaoCalculations';

interface SimuladorLucrosProps {
  walletId: string;
}

const SimuladorLucros: React.FC<SimuladorLucrosProps> = ({ walletId }) => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const carteira = carteiras.find(c => c.id === walletId);
  
  const [valorBTC, setValorBTC] = useState<number>(carteira?.saldo || 0);
  const [periodo, setPeriodo] = useState<number>(30);
  const [tipoPeríodo, setTipoPeriodo] = useState<'dias' | 'meses'>('dias');
  const [valorizacao, setValorizacao] = useState<number>(5);
  const [simulacaoResultado, setSimulacaoResultado] = useState<any>(null);
  
  if (!carteira || !bitcoinData) {
    return <div>Carregando dados...</div>;
  }
  
  const handleSimular = () => {
    // Convert months to days if needed for the calculation
    const periodoDias = tipoPeríodo === 'meses' ? periodo * 30 : periodo;
    
    // Call the simulator function
    const resultado = simularProjecaoLucro(
      valorBTC,
      bitcoinData.price_usd,
      periodoDias,
      valorizacao
    );
    
    setSimulacaoResultado(resultado);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-satotrack-neon" />
          Simulador Interativo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <Label htmlFor="valor-btc">Valor investido (BTC)</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Input
                id="valor-btc"
                type="number"
                step="0.00000001"
                min="0"
                value={valorBTC}
                onChange={(e) => setValorBTC(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                className="whitespace-nowrap"
                onClick={() => setValorBTC(carteira.saldo)}
              >
                Usar Saldo
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Período de simulação</Label>
            <div className="flex items-center gap-4 mt-1.5">
              <div className="flex-1">
                <Slider
                  value={[periodo]}
                  min={tipoPeríodo === 'dias' ? 1 : 1}
                  max={tipoPeríodo === 'dias' ? 90 : 12}
                  step={1}
                  onValueChange={(values) => setPeriodo(values[0])}
                />
              </div>
              <div className="w-16">
                <Input
                  type="number"
                  min={1}
                  value={periodo}
                  onChange={(e) => setPeriodo(parseInt(e.target.value) || 1)}
                  className="text-center"
                />
              </div>
            </div>
            
            <RadioGroup 
              className="flex mt-2" 
              defaultValue="dias" 
              value={tipoPeríodo}
              onValueChange={(value) => setTipoPeriodo(value as 'dias' | 'meses')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dias" id="dias" />
                <Label htmlFor="dias">Dias</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="meses" id="meses" />
                <Label htmlFor="meses">Meses</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="valorizacao">
                Expectativa de valorização (%)
              </Label>
              <span className="text-sm font-mono">{valorizacao}%</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[valorizacao]}
                  min={-30}
                  max={50}
                  step={1}
                  onValueChange={(values) => setValorizacao(values[0])}
                />
              </div>
              <div className="w-16">
                <Input
                  type="number"
                  min={-30}
                  max={50}
                  value={valorizacao}
                  onChange={(e) => setValorizacao(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
              </div>
            </div>
          </div>
          
          <Button 
            variant="bitcoin"
            className="w-full mt-6"
            onClick={handleSimular}
          >
            Simular Cenário
          </Button>
          
          {simulacaoResultado && (
            <div className="p-4 bg-muted/30 rounded-lg mt-4 border border-border">
              <h4 className="text-sm font-medium mb-3">Resultado da Simulação</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Valor Projetado</p>
                  <div className="flex items-center">
                    <span className="text-lg font-medium">{formatBitcoinValue(simulacaoResultado.valorFinal)} BTC</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rendimento</p>
                  <div className="flex items-center">
                    <span className={`text-lg font-medium ${simulacaoResultado.rendimentoPct > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {simulacaoResultado.rendimentoPct > 0 ? '+' : ''}
                      {simulacaoResultado.rendimentoPct.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Lucro/Perda (USD)</p>
                  <div className="flex items-center">
                    <span className={`text-lg font-medium ${simulacaoResultado.lucroPerdaUsd > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {simulacaoResultado.lucroPerdaUsd > 0 ? '+' : ''}
                      ${Math.abs(simulacaoResultado.lucroPerdaUsd).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Risco Estimado</p>
                  <div className="flex items-center">
                    <span className="text-lg font-medium">
                      {simulacaoResultado.risco === 'Alto' ? (
                        <span className="text-red-500">Alto</span>
                      ) : simulacaoResultado.risco === 'Médio' ? (
                        <span className="text-yellow-500">Médio</span>
                      ) : (
                        <span className="text-green-500">Baixo</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimuladorLucros;
