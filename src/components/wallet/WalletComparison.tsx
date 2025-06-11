
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Compare, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { CarteiraBTC } from '@/types/types';

const WalletComparison: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [comparisonMetric, setComparisonMetric] = useState<'balance' | 'growth' | 'activity'>('balance');

  const addWalletToComparison = (walletId: string) => {
    if (selectedWallets.length < 3 && !selectedWallets.includes(walletId)) {
      setSelectedWallets([...selectedWallets, walletId]);
    }
  };

  const removeWalletFromComparison = (walletId: string) => {
    setSelectedWallets(selectedWallets.filter(id => id !== walletId));
  };

  const getSelectedWallets = () => {
    return carteiras.filter(wallet => selectedWallets.includes(wallet.id));
  };

  const generateComparisonData = () => {
    const selectedWalletData = getSelectedWallets();
    
    return selectedWalletData.map(wallet => {
      const balanceInBRL = wallet.saldo * (bitcoinData?.price_brl || 0);
      
      // Simular dados de crescimento (em produção, viria do histórico)
      const growthRate = ((wallet.total_entradas - wallet.total_saidas) / Math.max(wallet.total_entradas, 1)) * 100;
      const activityScore = wallet.qtde_transacoes * 10; // Score baseado em transações
      
      return {
        name: wallet.nome,
        id: wallet.id,
        balance: wallet.saldo,
        balanceBRL: balanceInBRL,
        totalReceived: wallet.total_entradas,
        totalSent: wallet.total_saidas,
        transactions: wallet.qtde_transacoes,
        growth: growthRate,
        activity: activityScore,
        performance: balanceInBRL / 1000 // Performance em milhares de reais
      };
    });
  };

  const comparisonData = generateComparisonData();

  const getBestPerformer = () => {
    if (comparisonData.length === 0) return null;
    
    const metric = comparisonMetric === 'balance' ? 'balanceBRL' : 
                   comparisonMetric === 'growth' ? 'growth' : 'activity';
    
    return comparisonData.reduce((best, current) => 
      current[metric] > best[metric] ? current : best
    );
  };

  const getWorstPerformer = () => {
    if (comparisonData.length === 0) return null;
    
    const metric = comparisonMetric === 'balance' ? 'balanceBRL' : 
                   comparisonMetric === 'growth' ? 'growth' : 'activity';
    
    return comparisonData.reduce((worst, current) => 
      current[metric] < worst[metric] ? current : worst
    );
  };

  const bestPerformer = getBestPerformer();
  const worstPerformer = getWorstPerformer();

  const getMetricLabel = () => {
    switch (comparisonMetric) {
      case 'balance': return 'Saldo (R$)';
      case 'growth': return 'Crescimento (%)';
      case 'activity': return 'Atividade';
      default: return 'Métrica';
    }
  };

  const getChartDataKey = () => {
    switch (comparisonMetric) {
      case 'balance': return 'balanceBRL';
      case 'growth': return 'growth';
      case 'activity': return 'activity';
      default: return 'balanceBRL';
    }
  };

  if (carteiras.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compare className="h-5 w-5" />
            Comparador de Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Compare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Você precisa de pelo menos 2 carteiras para usar o comparador.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Compare className="h-5 w-5 text-satotrack-neon" />
              Comparador de Carteiras
            </CardTitle>
            <Select value={comparisonMetric} onValueChange={(value: any) => setComparisonMetric(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balance">Saldo em BRL</SelectItem>
                <SelectItem value="growth">Taxa de Crescimento</SelectItem>
                <SelectItem value="activity">Nível de Atividade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Seleção de Carteiras */}
            <div>
              <h3 className="text-lg font-medium mb-3">
                Selecione até 3 carteiras para comparar ({selectedWallets.length}/3)
              </h3>
              <div className="flex flex-wrap gap-2">
                {carteiras.map(wallet => (
                  <Button
                    key={wallet.id}
                    variant={selectedWallets.includes(wallet.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      selectedWallets.includes(wallet.id) 
                        ? removeWalletFromComparison(wallet.id)
                        : addWalletToComparison(wallet.id)
                    }
                    disabled={!selectedWallets.includes(wallet.id) && selectedWallets.length >= 3}
                  >
                    {wallet.nome}
                    {selectedWallets.includes(wallet.id) && ' ✓'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Análise de Performance */}
            {selectedWallets.length >= 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bestPerformer && (
                    <Card className="border-green-500/30 bg-green-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Award className="h-8 w-8 text-green-500" />
                          <div>
                            <h4 className="font-bold text-green-500">Melhor Performance</h4>
                            <p className="text-lg font-medium">{bestPerformer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getMetricLabel()}: {
                                comparisonMetric === 'balance' 
                                  ? `R$ ${bestPerformer.balanceBRL.toLocaleString('pt-BR')}`
                                  : comparisonMetric === 'growth'
                                  ? `${bestPerformer.growth.toFixed(1)}%`
                                  : bestPerformer.activity.toString()
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {worstPerformer && bestPerformer?.id !== worstPerformer?.id && (
                    <Card className="border-red-500/30 bg-red-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <TrendingDown className="h-8 w-8 text-red-500" />
                          <div>
                            <h4 className="font-bold text-red-500">Menor Performance</h4>
                            <p className="text-lg font-medium">{worstPerformer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getMetricLabel()}: {
                                comparisonMetric === 'balance' 
                                  ? `R$ ${worstPerformer.balanceBRL.toLocaleString('pt-BR')}`
                                  : comparisonMetric === 'growth'
                                  ? `${worstPerformer.growth.toFixed(1)}%`
                                  : worstPerformer.activity.toString()
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Gráfico de Comparação */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação por {getMetricLabel()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="rgba(255,255,255,0.5)"
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.5)"
                            tickFormatter={(value) => 
                              comparisonMetric === 'balance' 
                                ? `R$ ${(value/1000).toFixed(0)}k`
                                : comparisonMetric === 'growth'
                                ? `${value.toFixed(0)}%`
                                : value.toString()
                            }
                          />
                          <Tooltip 
                            formatter={(value: number) => [
                              comparisonMetric === 'balance' 
                                ? `R$ ${value.toLocaleString('pt-BR')}`
                                : comparisonMetric === 'growth'
                                ? `${value.toFixed(1)}%`
                                : value.toString(),
                              getMetricLabel()
                            ]}
                            contentStyle={{ 
                              backgroundColor: '#1A1F2C', 
                              borderColor: 'rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar 
                            dataKey={getChartDataKey()} 
                            fill="#00d4ff"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabela Detalhada */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação Detalhada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-2">Carteira</th>
                            <th className="text-right p-2">Saldo BTC</th>
                            <th className="text-right p-2">Saldo BRL</th>
                            <th className="text-right p-2">Transações</th>
                            <th className="text-right p-2">Crescimento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonData.map((wallet, index) => (
                            <tr key={wallet.id} className="border-b border-border/50">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  {index === 0 && bestPerformer?.id === wallet.id && (
                                    <Badge className="bg-yellow-500/20 text-yellow-500">🏆</Badge>
                                  )}
                                  {wallet.name}
                                </div>
                              </td>
                              <td className="text-right p-2">{wallet.balance.toFixed(8)}</td>
                              <td className="text-right p-2">R$ {wallet.balanceBRL.toLocaleString('pt-BR')}</td>
                              <td className="text-right p-2">{wallet.transactions}</td>
                              <td className={`text-right p-2 ${
                                wallet.growth >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {wallet.growth >= 0 ? '+' : ''}{wallet.growth.toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletComparison;
