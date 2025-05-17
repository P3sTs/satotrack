
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { Star, TrendingUp, FileText, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PremiumChartDisplay from '../charts/premium/PremiumChartDisplay';
import PremiumFeatureGate from '../monetization/PremiumFeatureGate';
import { Skeleton } from '@/components/ui/skeleton';

const PremiumDashboard: React.FC = () => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {!isPremium && (
        <div className="bg-dashboard-medium border border-bitcoin/20 p-6 rounded-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-bitcoin/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-bitcoin mb-2">
              <Star className="h-5 w-5 fill-bitcoin" />
              <h2 className="text-xl font-semibold">Desbloqueie o SatoTrack Premium</h2>
            </div>
            <p className="text-muted-foreground mb-4 max-w-xl">
              Você está usando a versão gratuita. Desbloqueie recursos avançados como comparações de carteiras, 
              relatórios PDF, alertas em tempo real e acesso a todas as moedas.
            </p>
            <Button 
              onClick={() => navigate('/planos')}
              className="bg-bitcoin hover:bg-bitcoin/90 text-white"
            >
              Ativar Premium agora
            </Button>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="graphs" className="w-full">
        <TabsList className="mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="graphs">Gráficos Avançados</TabsTrigger>
          <TabsTrigger value="alerts">Alertas Personalizados</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graphs" className="mt-0">
          <PremiumFeatureGate 
            messageTitle="Gráficos Avançados Premium"
            messageText="Desbloqueie análises detalhadas com filtros avançados de 30 dias, 90 dias e YTD (ano até hoje)."
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-satotrack-neon" />
                  Análises Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <React.Suspense fallback={
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                }>
                  <PremiumChartDisplay />
                </React.Suspense>
              </CardContent>
            </Card>
          </PremiumFeatureGate>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-0">
          <PremiumFeatureGate
            messageTitle="Alertas Personalizados Premium"
            messageText="Configure alertas automáticos para variações de preço, recebimentos e taxas de blockchain."
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-satotrack-neon" />
                  Alertas Personalizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Configure seus alertas</h3>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações por email ou push quando eventos importantes acontecerem.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-dashboard-medium rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Alertas de Preço</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        Notificar quando Bitcoin variar mais de:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={5}
                          min={1}
                          max={20}
                          className="w-16 bg-dashboard-medium border-dashboard-medium rounded p-1 text-center"
                          aria-label="Percentual de variação"
                        />
                        <span>% em 24h</span>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-dashboard-medium rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Alertas de Recebimento</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        Notificar quando receber mais de:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={0.01}
                          step={0.001}
                          min={0.001}
                          className="w-24 bg-dashboard-medium border-dashboard-medium rounded p-1 text-center"
                          aria-label="Valor mínimo para alerta"
                        />
                        <span>BTC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PremiumFeatureGate>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0">
          <PremiumFeatureGate
            messageTitle="Relatórios Premium"
            messageText="Exporte relatórios detalhados da sua carteira em PDF para análise offline ou declaração de impostos."
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-satotrack-neon" />
                  Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-dashboard-medium rounded-lg">
                    <h4 className="font-medium mb-2">Relatório Mensal</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Resumo de todas as transações, saldo e valorização no último mês.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Exportar como PDF
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-dashboard-medium rounded-lg">
                    <h4 className="font-medium mb-2">Relatório Anual</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Dados consolidados para declaração fiscal e análise anual.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Exportar como PDF
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-dashboard-medium rounded-lg">
                    <h4 className="font-medium mb-2">Transações Detalhadas</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Listagem completa de todas as transações com metadados.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Exportar como CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PremiumFeatureGate>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumDashboard;
