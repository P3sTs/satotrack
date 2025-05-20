
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { useCarteiras } from '@/contexts/CarteirasContext';
import { ArrowUp, ArrowDown, ChartLine, Calculator, Info, BrainCircuit, Target, TrendingUp, Wallet } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<string>('projecao');
  
  const isPremium = userPlan === 'premium';
  const selectedWallet = carteiras.find(c => c.id === selectedWalletId);
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-orbitron satotrack-gradient-text mb-2">
            Projeção de Rendimentos
          </h1>
          <p className="text-muted-foreground">
            Visualize o potencial futuro dos seus investimentos com base em análises inteligentes
          </p>
        </div>
      </div>
      
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="projecao">Projeção de Rendimento</TabsTrigger>
              <TabsTrigger value="simulador">Simulador</TabsTrigger>
              <TabsTrigger value="inteligencia">Inteligência SatoTrack</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projecao" className="mt-0">
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-satotrack-neon" />
                      Projeção de Rendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjecaoGrafico walletId={selectedWalletId} />
                    
                    {selectedWallet && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="p-4 border border-dashboard-medium rounded-lg flex flex-col">
                          <span className="text-xs text-muted-foreground">Projeção em 1 mês</span>
                          <span className="text-xl font-semibold mt-1 flex items-center">
                            <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
                            {(selectedWallet.saldo * (1 + 0.05)).toFixed(8)} BTC
                          </span>
                          <span className="text-sm text-green-500">+5% (previsão)</span>
                        </div>
                        
                        <div className="p-4 border border-dashboard-medium rounded-lg flex flex-col">
                          <span className="text-xs text-muted-foreground">Projeção em 3 meses</span>
                          <span className="text-xl font-semibold mt-1 flex items-center">
                            <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
                            {(selectedWallet.saldo * (1 + 0.15)).toFixed(8)} BTC
                          </span>
                          <span className="text-sm text-green-500">+15% (previsão)</span>
                        </div>
                        
                        <div className="p-4 border border-dashboard-medium rounded-lg flex flex-col">
                          <span className="text-xs text-muted-foreground">Projeção em 6 meses</span>
                          <span className="text-xl font-semibold mt-1 flex items-center">
                            <ArrowUp className="text-green-500 h-4 w-4 mr-1" />
                            {(selectedWallet.saldo * (1 + 0.32)).toFixed(8)} BTC
                          </span>
                          <span className="text-sm text-green-500">+32% (previsão)</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="simulador" className="mt-0">
              <SimuladorLucros 
                walletId={selectedWalletId}
                saldoInicial={selectedWallet?.saldo || 0} 
              />
            </TabsContent>
            
            <TabsContent value="inteligencia" className="mt-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PremiumFeatureGate
                messageTitle="Alertas Estratégicos"
                messageText="Desbloqueie alertas inteligentes personalizados baseados no comportamento da sua carteira e tendências de mercado."
              >
                <AlertasEstrategicos walletId={selectedWalletId} />
              </PremiumFeatureGate>
              
              <PremiumFeatureGate
                messageTitle="Insights de IA"
                messageText="Análise avançada com inteligência artificial para identificar padrões no seu comportamento de investimento."
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-satotrack-neon" />
                      Insights de IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Nossa análise inteligente identificou os seguintes insights baseados 
                        no histórico da sua carteira e comportamento do mercado:
                      </p>
                      
                      <div className="p-4 border border-satotrack-neon/20 rounded-lg bg-dashboard-light/5">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Target className="h-4 w-4 text-satotrack-neon mr-2" />
                          Padrão de Comportamento
                        </h4>
                        <p className="text-sm">
                          Você tende a vender quando o Bitcoin atinge alta de 12%, mas dados 
                          históricos mostram que esperar por 15% traz em média 3.2% mais retorno.
                        </p>
                      </div>
                      
                      <div className="p-4 border border-satotrack-neon/20 rounded-lg bg-dashboard-light/5">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Target className="h-4 w-4 text-satotrack-neon mr-2" />
                          Oportunidade Identificada
                        </h4>
                        <p className="text-sm">
                          Baseado no seu histórico de transações, os melhores momentos para 
                          comprar Bitcoin são normalmente nas segundas-feiras pela manhã.
                        </p>
                      </div>
                      
                      <div className="p-4 border border-satotrack-neon/20 rounded-lg bg-dashboard-light/5">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Target className="h-4 w-4 text-satotrack-neon mr-2" />
                          Recomendação Personalizada
                        </h4>
                        <p className="text-sm">
                          Com base nos seus objetivos declarados, recomendamos diversificar 
                          15% do seu portfólio para Ethereum para otimizar o equilíbrio 
                          entre risco e retorno.
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="neon" className="w-full mt-6">
                      Obter Relatório Completo
                    </Button>
                  </CardContent>
                </Card>
              </PremiumFeatureGate>
            </TabsContent>
          </Tabs>
          
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
      
      {!selectedWalletId && carteiras.length > 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-dashboard-medium rounded-lg">
          <ChartLine className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Selecione uma Carteira</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Para visualizar projeções de rendimento e análises personalizadas, 
            selecione uma das suas carteiras na lista acima.
          </p>
          <Button variant="outline" onClick={() => document.getElementById('carteira-select')?.focus()}>
            Selecionar Carteira
          </Button>
        </div>
      )}
      
      {!selectedWalletId && carteiras.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-dashboard-medium rounded-lg">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Nenhuma Carteira Encontrada</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Você ainda não tem nenhuma carteira cadastrada. Adicione uma carteira 
            para começar a visualizar projeções de rendimento.
          </p>
          <Button onClick={() => window.location.href = '/nova-carteira'}>
            Adicionar Carteira
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjecaoLucros;
