
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { Star, TrendingUp, FileText, Bell, BrainCircuit, PieChart } from 'lucide-react';
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
      {!isPremium ? (
        <div className="bg-dashboard-medium border border-bitcoin/20 p-6 rounded-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-bitcoin/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-bitcoin mb-2">
              <Star className="h-5 w-5 fill-bitcoin" />
              <h2 className="text-xl font-semibold">Desbloqueie o SatoTrack Premium</h2>
            </div>
            <p className="text-muted-foreground mb-4 max-w-xl">
              Você está usando a versão gratuita. Desbloqueie recursos avançados como comparações de carteiras, 
              relatórios PDF, alertas em tempo real e acesso a mais carteiras.
            </p>
            <Button 
              onClick={() => navigate('/planos')}
              className="bg-bitcoin hover:bg-bitcoin/90 text-white"
            >
              Ativar Premium agora
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-dashboard-dark border border-bitcoin/30 p-6 rounded-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-bitcoin/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-bitcoin mb-3">
              <Star className="h-6 w-6 fill-bitcoin" />
              <h2 className="text-xl font-semibold">SatoTrack Premium Ativo</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Obrigado por ser um usuário premium! Você tem acesso a todos os recursos exclusivos do SatoTrack.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-dashboard-medium/50 rounded-md">
                <TrendingUp className="h-6 w-6 text-bitcoin mb-1" />
                <span className="text-sm">Análises Avançadas</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-dashboard-medium/50 rounded-md">
                <PieChart className="h-6 w-6 text-bitcoin mb-1" />
                <span className="text-sm">Múltiplas Carteiras</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-dashboard-medium/50 rounded-md">
                <Bell className="h-6 w-6 text-bitcoin mb-1" />
                <span className="text-sm">Alertas Inteligentes</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-dashboard-medium/50 rounded-md">
                <BrainCircuit className="h-6 w-6 text-bitcoin mb-1" />
                <span className="text-sm">Insights de IA</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="graphs" className="w-full">
        <TabsList className="mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="graphs">Gráficos Avançados</TabsTrigger>
          <TabsTrigger value="alerts">Alertas Inteligentes</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graphs" className="mt-0">
          <PremiumFeatureGate 
            messageTitle="Gráficos Avançados Premium"
            messageText="Desbloqueie análises detalhadas com filtros avançados de 30 dias, 90 dias e YTD (ano até hoje)."
          >
            <Card className="cyberpunk-card">
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
            <Card className="cyberpunk-card">
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
                      Receba notificações por email, Telegram ou push quando eventos importantes acontecerem.
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
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-dashboard-medium rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Alertas Inteligentes</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Ative alertas baseados em análise de padrões:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="alert-pattern" defaultChecked className="rounded" />
                          <label htmlFor="alert-pattern" className="text-xs">Padrões de compra/venda</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="alert-opportunity" defaultChecked className="rounded" />
                          <label htmlFor="alert-opportunity" className="text-xs">Oportunidades de mercado</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="alert-risk" defaultChecked className="rounded" />
                          <label htmlFor="alert-risk" className="text-xs">Alertas de risco</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-dashboard-medium rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Canais de Notificação</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Escolha onde receber seus alertas:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="channel-push" defaultChecked className="rounded" />
                          <label htmlFor="channel-push" className="text-xs">Push (navegador)</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="channel-email" defaultChecked className="rounded" />
                          <label htmlFor="channel-email" className="text-xs">Email</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="channel-telegram" className="rounded" />
                          <label htmlFor="channel-telegram" className="text-xs">Telegram</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Salvar Configurações</Button>
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
            <Card className="cyberpunk-card">
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
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Agendamento de Relatórios</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure relatórios automáticos que serão enviados para seu email com a frequência desejada.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-dashboard-medium rounded-lg">
                      <h5 className="text-sm font-medium mb-2">Relatório de Portfolio</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Frequência</label>
                          <select className="w-full bg-dashboard-medium border-dashboard-medium rounded p-1">
                            <option>Semanal</option>
                            <option>Quinzenal</option>
                            <option>Mensal</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Dia da semana</label>
                          <select className="w-full bg-dashboard-medium border-dashboard-medium rounded p-1">
                            <option>Segunda-feira</option>
                            <option>Quarta-feira</option>
                            <option>Sexta-feira</option>
                            <option>Domingo</option>
                          </select>
                        </div>
                        
                        <Button size="sm" className="w-full">Agendar</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-dashboard-medium rounded-lg">
                      <h5 className="text-sm font-medium mb-2">Insights de IA</h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        Receba análises inteligentes baseadas no seu comportamento de investimento
                        e nas tendências atuais do mercado.
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <input type="checkbox" id="include-ai" defaultChecked className="rounded" />
                        <label htmlFor="include-ai" className="text-xs">Incluir análises de IA</label>
                      </div>
                      <Button size="sm" className="w-full">Ativar</Button>
                    </div>
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
