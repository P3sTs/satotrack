
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Calendar, ArrowLeft, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Historico: React.FC = () => {
  const { userPlan } = useAuth();
  const isPremium = userPlan === 'premium';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o painel
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-satotrack-text">
                📊 Minhas Transações
              </h1>
              <p className="text-muted-foreground">
                Histórico completo de todas as suas transações monitoradas
              </p>
            </div>
          </div>
          {isPremium && (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-bitcoin/20 border border-bitcoin/40 rounded-full">
                <span className="text-bitcoin text-sm font-medium">✨ Premium</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Controles de Filtro */}
        <Card className="cyberpunk-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-satotrack-neon" />
              Filtros e Exportação
            </CardTitle>
            <CardDescription>
              Configure o período e formato dos dados para análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Período: Últimos 30 dias
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Todas as Carteiras
              </Button>
              {isPremium ? (
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Relatório
                </Button>
              ) : (
                <Button variant="outline" disabled className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar (Premium)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status do Histórico */}
        <Card className="cyberpunk-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-bitcoin" />
              Status do Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPremium ? (
              <div className="space-y-6">
                {/* Resumo Premium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold text-green-500">247</p>
                        <p className="text-sm text-satotrack-text">Transações Monitoradas</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-bitcoin/10 border border-bitcoin/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-bitcoin" />
                      <div>
                        <p className="text-2xl font-bold text-bitcoin">89</p>
                        <p className="text-sm text-satotrack-text">Dias de Histórico</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold text-purple-500">12</p>
                        <p className="text-sm text-satotrack-text">Relatórios Gerados</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de Transações Premium */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-satotrack-text">Transações Recentes</h3>
                  
                  {/* Exemplos de transações */}
                  {[
                    { date: '2024-01-15 14:32', type: 'Recebida', amount: '+0.00234 BTC', value: '+$97.43', wallet: '1A1z...4x8Z', status: 'Confirmada' },
                    { date: '2024-01-14 09:18', type: 'Enviada', amount: '-0.00156 BTC', value: '-$64.78', wallet: '3FH2...9kL1', status: 'Confirmada' },
                    { date: '2024-01-13 16:45', type: 'Recebida', amount: '+0.00089 BTC', value: '+$37.12', wallet: '1A1z...4x8Z', status: 'Confirmada' },
                    { date: '2024-01-12 11:23', type: 'Enviada', amount: '-0.00567 BTC', value: '-$235.89', wallet: 'bc1q...7x9m', status: 'Confirmada' },
                  ].map((tx, index) => (
                    <div key={index} className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30 hover:border-satotrack-neon/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${tx.type === 'Recebida' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {tx.type === 'Recebida' ? '↓' : '↑'}
                          </div>
                          <div>
                            <p className="font-medium text-satotrack-text">{tx.type}</p>
                            <p className="text-sm text-satotrack-secondary">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.type === 'Recebida' ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.amount}
                          </p>
                          <p className="text-sm text-satotrack-secondary">{tx.value}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-satotrack-text">{tx.wallet}</p>
                          <p className="text-xs text-green-500">{tx.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline">Carregar Mais Transações</Button>
                </div>
              </div>
            ) : (
              /* Estado Free Plan */
              <div className="text-center py-12">
                <div className="p-4 bg-bitcoin/10 border border-bitcoin/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-12 w-12 text-bitcoin" />
                </div>
                <h3 className="text-xl font-bold text-satotrack-text mb-4">
                  Histórico Completo - Recurso Premium
                </h3>
                <p className="text-satotrack-text mb-2">
                  O histórico detalhado de transações está disponível apenas para usuários Premium.
                </p>
                <p className="text-satotrack-secondary mb-8">
                  Com o plano Premium você terá acesso a:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-medium text-satotrack-neon mb-2">📊 Histórico Completo</h4>
                    <p className="text-sm text-satotrack-text">Todas as transações desde o início do monitoramento</p>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-medium text-bitcoin mb-2">📈 Análises Avançadas</h4>
                    <p className="text-sm text-satotrack-text">Relatórios detalhados com métricas de performance</p>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-medium text-purple-500 mb-2">💾 Exportação</h4>
                    <p className="text-sm text-satotrack-text">Exporte dados em CSV, PDF e Excel</p>
                  </div>
                  <div className="p-4 bg-dashboard-medium/50 rounded-lg border border-dashboard-light/30">
                    <h4 className="font-medium text-green-500 mb-2">⚡ Tempo Real</h4>
                    <p className="text-sm text-satotrack-text">Atualizações instantâneas sem limitações</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/planos">
                    <Button size="lg" className="w-full sm:w-auto">
                      Fazer Upgrade para Premium
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Voltar ao Dashboard
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-satotrack-neon/10 border border-satotrack-neon/30 rounded-lg">
                  <p className="text-satotrack-neon text-sm">
                    💡 <strong>Versão gratuita:</strong> Você pode ver as últimas 10 transações nas páginas individuais de cada carteira.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Historico;
