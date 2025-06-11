
import React from 'react';
import ProfitLossProjection from '@/components/projecao/ProfitLossProjection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjecaoGrafico from '@/components/projecao/ProjecaoGrafico';
import SimuladorLucros from '@/components/projecao/SimuladorLucros';
import { useCarteiras } from '@/contexts/carteiras';

const Projections = () => {
  const { carteiras } = useCarteiras();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Projeções e Análises</h1>
        <p className="text-muted-foreground">
          Analise tendências, simule cenários e projete o futuro das suas carteiras Bitcoin.
        </p>
      </div>
      
      <Tabs defaultValue="projections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projections">Projeção de Lucro</TabsTrigger>
          <TabsTrigger value="charts">Gráficos Avançados</TabsTrigger>
          <TabsTrigger value="simulator">Simulador</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projections" className="space-y-6">
          <ProfitLossProjection />
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-6">
          {carteiras.length > 0 ? (
            <div className="space-y-6">
              {carteiras.map(carteira => (
                <ProjecaoGrafico key={carteira.id} walletId={carteira.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Adicione carteiras para visualizar gráficos de projeção.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="simulator" className="space-y-6">
          <SimuladorLucros />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projections;
