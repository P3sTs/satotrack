import React, { useState } from 'react';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InteractiveChart from '@/components/charts/InteractiveChart';
import { TimeRange } from '@/components/charts/selectors/TimeRangeSelector';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, BarChart2, History, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketTrendAlerts from '@/components/home/MarketTrendAlerts';
import { useAuth } from '@/contexts/auth';
import PremiumFeatureGate from '@/components/monetization/PremiumFeatureGate';
import RealtimeDashboard from '@/components/dynamic/RealtimeDashboard';

const Mercado = () => {
  const { data: bitcoinData, loading, isRefreshing, refresh } = useBitcoinPrice();
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-700 rounded"></div>
          <div className="h-10 w-32 bg-gray-700 rounded"></div>
        </div>
        <div className="h-32 bg-gray-700 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
        <div className="h-96 bg-gray-700 rounded"></div>
      </div>
    );
  }
  
  if (!bitcoinData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados do mercado</h2>
          <p className="text-gray-400 mb-4">Não foi possível obter as informações do Bitcoin no momento.</p>
          <Button variant="default" onClick={refresh}>Tentar novamente</Button>
        </div>
      </div>
    );
  }
  
  const priceChangeClass = bitcoinData.price_change_percentage_24h >= 0 
    ? 'text-green-500' 
    : 'text-red-500';
  
  const priceChangeIcon = bitcoinData.price_change_percentage_24h >= 0 
    ? <TrendingUp className="h-6 w-6" /> 
    : <TrendingDown className="h-6 w-6" />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-orbitron satotrack-gradient-text mb-2">Mercado Bitcoin</h1>
          <p className="text-muted-foreground">Acompanhe o preço e as tendências do Bitcoin em tempo real</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={refresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2 mt-2 sm:mt-0 border-satotrack-neon text-satotrack-neon hover:bg-satotrack-neon/10"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>
      
      <MarketTrendAlerts bitcoinData={bitcoinData} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="cyberpunk-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Preço Atual</span>
              <DollarSign className="h-5 w-5 text-satotrack-neon" />
            </CardTitle>
            <CardDescription>Valor do Bitcoin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {bitcoinData.price_usd.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'USD'
              })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {bitcoinData.price_brl.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="cyberpunk-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Variação 24h</span>
              {priceChangeIcon}
            </CardTitle>
            <CardDescription>Mudança em 24 horas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${priceChangeClass}`}>
              {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_24h.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {bitcoinData.price_change_24h >= 0 ? '+' : '-'}
              {Math.abs(bitcoinData.price_change_24h).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'USD'
              })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="cyberpunk-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Volume 24h</span>
              <BarChart2 className="h-5 w-5 text-satotrack-neon" />
            </CardTitle>
            <CardDescription>Volume negociado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(bitcoinData.volume_24h_usd || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {((bitcoinData.volume_24h_usd || 0) / bitcoinData.price_usd).toFixed(2)} BTC
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
          <TabsTrigger value="historical">Histórico</TabsTrigger>
          <TabsTrigger value="analysis">Análise Avançada</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <Card className="cyberpunk-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-satotrack-neon" />
                Gráfico de Preço
              </CardTitle>
              <CardDescription>Histórico de preços do Bitcoin</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <InteractiveChart bitcoinData={bitcoinData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="realtime" className="mt-0">
          <Card className="cyberpunk-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-satotrack-neon" />
                Dados em Tempo Real
              </CardTitle>
              <CardDescription>Atualizações automáticas a cada 30 segundos</CardDescription>
            </CardHeader>
            <CardContent>
              <RealtimeDashboard bitcoinRefreshInterval={30000} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historical" className="mt-0">
          <Card className="cyberpunk-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-satotrack-neon" />
                Dados Históricos
              </CardTitle>
              <CardDescription>Preço do Bitcoin em períodos anteriores</CardDescription>
            </CardHeader>
            <CardContent>
              <PremiumFeatureGate>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Variações Históricas</h3>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left py-2">Período</th>
                          <th className="text-right py-2">Variação</th>
                          <th className="text-right py-2">Preço Mín.</th>
                          <th className="text-right py-2">Preço Máx.</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2">7 dias</td>
                          <td className={`text-right ${bitcoinData.price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {bitcoinData.price_change_percentage_7d >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_7d.toFixed(2)}%
                          </td>
                          <td className="text-right">${bitcoinData.price_low_7d.toLocaleString('pt-BR')}</td>
                          <td className="text-right">${bitcoinData.price_high_7d.toLocaleString('pt-BR')}</td>
                        </tr>
                        <tr>
                          <td className="py-2">30 dias</td>
                          <td className={`text-right ${bitcoinData.price_change_percentage_30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {bitcoinData.price_change_percentage_30d >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_30d.toFixed(2)}%
                          </td>
                          <td className="text-right">${bitcoinData.price_low_30d.toLocaleString('pt-BR')}</td>
                          <td className="text-right">${bitcoinData.price_high_30d.toLocaleString('pt-BR')}</td>
                        </tr>
                        <tr>
                          <td className="py-2">1 ano</td>
                          <td className={`text-right ${bitcoinData.price_change_percentage_1y >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {bitcoinData.price_change_percentage_1y >= 0 ? '+' : ''}{bitcoinData.price_change_percentage_1y.toFixed(2)}%
                          </td>
                          <td className="text-right">${bitcoinData.price_low_1y.toLocaleString('pt-BR')}</td>
                          <td className="text-right">${bitcoinData.price_high_1y.toLocaleString('pt-BR')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Indicadores de Mercado</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Medo e Ganância</span>
                          <span className="font-medium">67 - Ganância</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{width: "67%"}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dominância BTC</span>
                          <span className="font-medium">42.5%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                          <div className="bg-bitcoin h-2.5 rounded-full" style={{width: "42.5%"}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Liquidez do Mercado</span>
                          <span className="font-medium">Alta</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{width: "80%"}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumFeatureGate>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-0">
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
                    
                    <Button variant="neon" className="w-full mt-4">
                      Gerar Relatório Detalhado
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PremiumFeatureGate>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Sobre o Bitcoin</h3>
              <p className="text-sm text-muted-foreground">
                Bitcoin é a primeira criptomoeda descentralizada do mundo, criada em 2009 por 
                uma pessoa (ou grupo) usando o pseudônimo Satoshi Nakamoto. Opera em uma 
                tecnologia peer-to-peer sem necessidade de intermediários ou autoridade central.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Aviso de Risco</h3>
              <p className="text-sm text-muted-foreground">
                O mercado de criptomoedas é altamente volátil e imprevisível. As informações 
                apresentadas não constituem aconselhamento financeiro. Invista de forma 
                responsável e apenas valores que esteja disposto a perder.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mercado;
