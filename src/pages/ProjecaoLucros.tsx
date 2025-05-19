
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { ArrowUp, ArrowDown, ChartLine, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProjecaoGrafico from '@/components/projecao/ProjecaoGrafico';
import SimuladorLucros from '@/components/projecao/SimuladorLucros';
import AlertasEstrategicos from '@/components/projecao/AlertasEstrategicos';
import PremiumBanner from '@/components/monetization/PremiumBanner';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';

const ProjecaoLucros: React.FC = () => {
  const { userPlan } = useAuth();
  const { carteiras } = useCarteiras();
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  
  const isPremium = userPlan === 'premium';
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-orbitron satotrack-gradient-text">
          Projeção de Lucros e Perdas
        </h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Visualize estimativas de lucros ou perdas com base nas movimentações da sua carteira,
        comportamento histórico e tendências de mercado.
      </p>
      
      {!isPremium && (
        <PremiumBanner className="mb-6" />
      )}
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ChartLine className="text-satotrack-neon h-5 w-5" />
            Selecione uma Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="carteira-select">Carteira para Projeção</Label>
              <Select
                value={selectedWalletId || ''}
                onValueChange={(value) => setSelectedWalletId(value)}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Selecione uma carteira" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.map((carteira) => (
                    <SelectItem key={carteira.id} value={carteira.id}>
                      {carteira.nome} ({carteira.saldo.toFixed(8)} BTC)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedWalletId && (
        <>
          <div className="mb-8">
            <ProjecaoGrafico walletId={selectedWalletId} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SimuladorLucros walletId={selectedWalletId} />
            
            <PremiumFeatureGate
              messageTitle="Alertas Estratégicos"
              messageText="Desbloqueie alertas inteligentes personalizados baseados no comportamento da sua carteira e tendências de mercado."
            >
              <AlertasEstrategicos walletId={selectedWalletId} />
            </PremiumFeatureGate>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-satotrack-neon" />
                Sobre as Projeções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  As projeções são baseadas em dados históricos da sua carteira combinados com o comportamento do mercado de Bitcoin.
                  Utilizamos algoritmos que analisam seus padrões de compra e venda e correlacionam com as tendências de mercado.
                </p>
                <p>
                  <strong>Importante:</strong> Projeções não são garantias de resultados futuros. O mercado de criptomoedas é altamente
                  volátil e imprevisível. Use estas informações apenas como referência para suas decisões.
                </p>
                <p>
                  Os usuários Premium têm acesso a projeções de longo prazo (até 1 ano) e alertas personalizados baseados no perfil
                  específico da carteira.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProjecaoLucros;
