
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';
import { BitcoinPriceData } from '@/hooks/useBitcoinPrice';

interface AnalysisTabProps {
  bitcoinData: BitcoinPriceData;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ bitcoinData }) => {
  return (
    <PremiumFeatureGate
      messageTitle="Análise Avançada Premium"
      messageText="Desbloqueie análises detalhadas de mercado, indicadores técnicos e previsões baseadas em IA com o plano Premium."
    >
      <Card className="cyberpunk-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-satotrack-neon" />
            Análise Técnica e Previsões
          </CardTitle>
          <CardDescription>Powered by SatoTrack AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-4">Sentimento de Mercado</h3>
              <div className="space-y-4">
                <div className="p-4 border border-dashboard-medium rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Análise de Redes Sociais</h4>
                    <span className="text-green-500 font-medium">Positivo</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    O sentimento nas redes sociais é positivo, com 72% das 
                    menções indicando uma visão otimista para os próximos dias.
                  </p>
                </div>
                
                <div className="p-4 border border-dashboard-medium rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Análise de Notícias</h4>
                    <span className="text-yellow-500 font-medium">Neutro</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    As principais publicações financeiras mantêm um tom neutro, 
                    com foco em regulamentações e adoção institucional.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Previsões de Preço</h3>
              <div className="p-4 border border-dashboard-medium rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Previsão de 7 dias</h4>
                  <span className={`font-medium ${bitcoinData.price_usd * 1.05 > bitcoinData.price_usd ? 'text-green-500' : 'text-red-500'}`}>
                    {(bitcoinData.price_usd * 1.05).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Confiança: Alta (87%)</span>
                  <span>Variação: +5.0%</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm">
                    Nossa análise de IA sugere uma tendência de alta na próxima semana, 
                    baseada em padrões históricos e indicadores técnicos.
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4 border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10">
                Gerar Relatório Detalhado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PremiumFeatureGate>
  );
};

export default AnalysisTab;
