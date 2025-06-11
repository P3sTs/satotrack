
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useCarteiras } from '@/contexts/carteiras';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

const WalletComparison: React.FC = () => {
  const { carteiras } = useCarteiras();
  const { data: bitcoinData } = useBitcoinPrice();
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'balance' | 'performance' | 'activity'>('balance');

  const addWalletToComparison = (walletId: string) => {
    if (selectedWallets.length < 3 && !selectedWallets.includes(walletId)) {
      setSelectedWallets([...selectedWallets, walletId]);
    }
  };

  const removeWalletFromComparison = (walletId: string) => {
    setSelectedWallets(selectedWallets.filter(id => id !== walletId));
  };

  const clearComparison = () => {
    setSelectedWallets([]);
  };

  const getWalletById = (id: string) => {
    return carteiras.find(w => w.id === id);
  };

  const generateMockChartData = () => {
    const days = 30;
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const dataPoint: any = {
        date: date.toISOString().split('T')[0],
      };
      
      selectedWallets.forEach(walletId => {
        const wallet = getWalletById(walletId);
        if (wallet) {
          // Generate mock data based on current balance with some variation
          const baseValue = wallet.saldo;
          const variation = 0.1 + (Math.random() * 0.2); // 10-30% variation
          dataPoint[wallet.nome] = baseValue * variation;
        }
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const getComparisonStats = () => {
    return selectedWallets.map(walletId => {
      const wallet = getWalletById(walletId);
      if (!wallet) return null;
      
      const btcValue = wallet.saldo * (bitcoinData?.price_brl || 0);
      const performance = Math.random() * 20 - 10; // Mock performance data
      
      return {
        id: wallet.id,
        name: wallet.nome,
        balance: wallet.saldo,
        fiatValue: btcValue,
        performance,
        transactions: wallet.qtde_transacoes || 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    }).filter(Boolean);
  };

  const chartData = generateMockChartData();
  const stats = getComparisonStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-satotrack-neon" />
            Comparador de Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Select onValueChange={addWalletToComparison}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione uma carteira para comparar" />
              </SelectTrigger>
              <SelectContent>
                {carteiras
                  .filter(w => !selectedWallets.includes(w.id))
                  .map(wallet => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.nome} - {wallet.saldo.toFixed(8)} BTC
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            {selectedWallets.length > 0 && (
              <Button variant="outline" onClick={clearComparison}>
                Limpar Seleção
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedWallets.map(walletId => {
              const wallet = getWalletById(walletId);
              if (!wallet) return null;
              
              return (
                <Badge 
                  key={walletId} 
                  variant="secondary" 
                  className="flex items-center gap-2"
                >
                  {wallet.nome}
                  <button 
                    onClick={() => removeWalletFromComparison(walletId)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedWallets.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Análise Comparativa</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={comparisonType} onValueChange={(value) => setComparisonType(value as any)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="balance">Saldo</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="activity">Atividade</TabsTrigger>
              </TabsList>

              <TabsContent value="balance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map(stat => (
                    <Card key={stat.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{stat.name}</h4>
                          <div className="text-2xl font-bold">
                            {stat.balance.toFixed(8)} BTC
                          </div>
                          <div className="text-sm text-muted-foreground">
                            R$ {stat.fiatValue.toLocaleString('pt-BR', { 
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2 
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      {selectedWallets.map((walletId, index) => {
                        const wallet = getWalletById(walletId);
                        const colors = ['#f7931a', '#00d4ff', '#ff6b35'];
                        return (
                          <Line 
                            key={walletId}
                            type="monotone" 
                            dataKey={wallet?.nome} 
                            stroke={colors[index]} 
                            strokeWidth={2}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map(stat => (
                    <Card key={stat.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{stat.name}</h4>
                          <div className={`text-2xl font-bold flex items-center gap-2 ${stat.performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.performance >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                            {stat.performance.toFixed(2)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Últimos 30 dias
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#f7931a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map(stat => (
                    <Card key={stat.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{stat.name}</h4>
                          <div className="text-2xl font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-satotrack-neon" />
                            {stat.transactions}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total de transações
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="transactions" fill="#00d4ff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {selectedWallets.length < 2 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Selecione pelo menos 2 carteiras</h3>
            <p className="text-muted-foreground">
              Escolha as carteiras que deseja comparar para ver análises detalhadas de performance, saldo e atividade.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletComparison;
