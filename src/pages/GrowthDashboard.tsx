
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, BarChart3, Download } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GrowthDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Mock data - em produção viria do backend
  const kpis = {
    totalUsers: 25847,
    activeUsers: 18923,
    conversion: 5.8,
    mrr: 342150,
    cac: 47.50,
    ltv: 680.00,
    churn: 2.3
  };

  const userGrowthData = [
    { date: '2024-01-01', users: 15000, premium: 800 },
    { date: '2024-01-08', users: 16500, premium: 950 },
    { date: '2024-01-15', users: 18200, premium: 1150 },
    { date: '2024-01-22', users: 20100, premium: 1420 },
    { date: '2024-01-29', users: 22300, premium: 1650 },
    { date: '2024-02-05', users: 24800, premium: 1890 },
    { date: '2024-02-12', users: 25847, premium: 2134 }
  ];

  const revenueData = [
    { month: 'Out', mrr: 180000, newSubs: 120, churn: 18 },
    { month: 'Nov', mrr: 245000, newSubs: 165, churn: 22 },
    { month: 'Dez', mrr: 298000, newSubs: 198, churn: 15 },
    { month: 'Jan', mrr: 342150, newSubs: 234, churn: 19 }
  ];

  const channelData = [
    { name: 'Orgânico', value: 42, color: '#00ff9f' },
    { name: 'Meta Ads', value: 28, color: '#1877f2' },
    { name: 'Google Ads', value: 18, color: '#ea4335' },
    { name: 'Referência', value: 12, color: '#ff6b00' }
  ];

  const cohortData = [
    { cohort: 'Jan 2024', month0: 100, month1: 85, month2: 78, month3: 72 },
    { cohort: 'Dez 2023', month0: 100, month1: 82, month2: 75, month3: 68 },
    { cohort: 'Nov 2023', month0: 100, month1: 88, month2: 80, month3: 74 }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number' }) => {
    const isPositive = change > 0;
    const formattedValue = format === 'currency' ? `R$ ${value.toLocaleString()}` : 
                          format === 'percentage' ? `${value}%` : 
                          value.toLocaleString();
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{formattedValue}</p>
              <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(change)}% vs mês anterior
              </div>
            </div>
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold">Growth Dashboard</h1>
          <p className="text-muted-foreground">Métricas de crescimento e performance do SatoTrack</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Usuários Totais"
          value={kpis.totalUsers}
          change={12.3}
          icon={Users}
        />
        <MetricCard
          title="MRR (Receita Recorrente)"
          value={kpis.mrr}
          change={18.7}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={kpis.conversion}
          change={0.8}
          icon={Target}
          format="percentage"
        />
        <MetricCard
          title="LTV / CAC Ratio"
          value={(kpis.ltv / kpis.cac).toFixed(1)}
          change={5.2}
          icon={BarChart3}
        />
      </div>

      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Crescimento</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="acquisition">Aquisição</TabsTrigger>
          <TabsTrigger value="retention">Retenção</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Usuários</CardTitle>
                <CardDescription>Evolução total de usuários e premium</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#00ff9f" fill="#00ff9f" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="premium" stackId="2" stroke="#ff6b00" fill="#ff6b00" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>KPIs essenciais do negócio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CAC (Custo de Aquisição)</span>
                    <Badge variant="outline">R$ {kpis.cac}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">LTV (Lifetime Value)</span>
                    <Badge variant="outline">R$ {kpis.ltv}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Churn Rate</span>
                    <Badge variant="outline" className="text-red-600">{kpis.churn}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">LTV/CAC Ratio</span>
                    <Badge className="bg-green-100 text-green-800">
                      {(kpis.ltv / kpis.cac).toFixed(1)}x
                    </Badge>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Saúde do Negócio</div>
                    <div className="text-lg font-semibold text-green-600">Excelente</div>
                    <div className="text-xs text-muted-foreground">LTV/CAC ratio acima de 3.0</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita Recorrente Mensal</CardTitle>
                <CardDescription>Evolução do MRR ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="mrr" stroke="#00ff9f" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Novas Assinaturas vs Churn</CardTitle>
                <CardDescription>Comparação de ganhos e perdas mensais</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newSubs" fill="#00ff9f" />
                    <Bar dataKey="churn" fill="#ff4757" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="acquisition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Canais de Aquisição</CardTitle>
                <CardDescription>Distribuição de usuários por canal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Canal</CardTitle>
                <CardDescription>CAC e conversão por canal de marketing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.map((channel, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: channel.color }}
                        />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{channel.value}% share</div>
                        <div className="text-xs text-muted-foreground">
                          CAC: R$ {(Math.random() * 80 + 20).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Cohort</CardTitle>
              <CardDescription>Retenção de usuários por coorte de aquisição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2 text-sm font-medium">
                  <div>Coorte</div>
                  <div>Mês 0</div>
                  <div>Mês 1</div>
                  <div>Mês 2</div>
                  <div>Mês 3</div>
                </div>
                {cohortData.map((cohort, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 text-sm">
                    <div className="font-medium">{cohort.cohort}</div>
                    <div className="text-center">{cohort.month0}%</div>
                    <div className="text-center">{cohort.month1}%</div>
                    <div className="text-center">{cohort.month2}%</div>
                    <div className="text-center">{cohort.month3}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrowthDashboard;
