
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Calculator, Target, AlertTriangle } from 'lucide-react';

const ProjecaoLucros: React.FC = () => {
  const [investimentoInicial, setInvestimentoInicial] = React.useState('');
  const [precoAtual, setPrecoAtual] = React.useState('');
  const [precoAlvo, setPrecoAlvo] = React.useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-satotrack-text mb-2">
          📈 Projeção de Lucros
        </h1>
        <p className="text-muted-foreground">
          Simule cenários de investimento e calcule potenciais lucros
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Simulador de Lucros
            </CardTitle>
            <CardDescription>
              Configure seus parâmetros de investimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="investimento">Investimento Inicial (R$)</Label>
              <Input
                id="investimento"
                type="number"
                value={investimentoInicial}
                onChange={(e) => setInvestimentoInicial(e.target.value)}
                placeholder="10000"
              />
            </div>
            
            <div>
              <Label htmlFor="preco-atual">Preço Atual BTC (USD)</Label>
              <Input
                id="preco-atual"
                type="number"
                value={precoAtual}
                onChange={(e) => setPrecoAtual(e.target.value)}
                placeholder="45000"
              />
            </div>
            
            <div>
              <Label htmlFor="preco-alvo">Preço Alvo BTC (USD)</Label>
              <Input
                id="preco-alvo"
                type="number"
                value={precoAlvo}
                onChange={(e) => setPrecoAlvo(e.target.value)}
                placeholder="100000"
              />
            </div>
            
            <Button className="w-full">
              Calcular Projeção
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resultados da Simulação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Lucro Projetado</p>
                <p className="text-2xl font-bold text-green-500">+ R$ 12.222,22</p>
              </div>
              
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Valorização</p>
                <p className="text-xl font-bold text-blue-500">+122.22%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjecaoLucros;
