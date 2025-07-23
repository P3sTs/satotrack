import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAIMonitoring } from '@/hooks/useAIMonitoring';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Zap, TrendingUp } from 'lucide-react';

const AIMonitoringDashboard: React.FC = () => {
  const {
    healthStatus,
    usageStats,
    testResults,
    isLoading,
    overallStatus,
    checkHealthStatus,
    testAIServices,
    getAggregatedMetrics,
    areAllServicesOperational
  } = useAIMonitoring();

  const aggregatedMetrics = getAggregatedMetrics();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status Geral dos Serviços de IA
              </CardTitle>
              <CardDescription>
                Monitoramento em tempo real dos agentes de IA
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkHealthStatus}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={testAIServices}
                disabled={isLoading}
              >
                <Zap className="h-4 w-4 mr-2" />
                Testar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(overallStatus)}`}></div>
            <span className="font-medium">
              {overallStatus === 'healthy' ? 'Todos os serviços operacionais' : 
               overallStatus === 'degraded' ? 'Alguns serviços com problemas' : 
               'Serviços críticos offline'}
            </span>
            {areAllServicesOperational() && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                100% Operacional
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Agregadas */}
      {aggregatedMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Requisições</p>
                  <p className="text-2xl font-bold">{aggregatedMetrics.totalRequests.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-green-600">
                    {aggregatedMetrics.successRate.toFixed(1)}%
                  </p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Erro</p>
                  <p className="text-2xl font-bold text-red-600">
                    {aggregatedMetrics.errorRate.toFixed(1)}%
                  </p>
                </div>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">{aggregatedMetrics.avgResponseTime}ms</p>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status dos Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Serviços</CardTitle>
          <CardDescription>
            Status individual de cada serviço de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthStatus.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium">{service.service}</p>
                    <p className="text-sm text-muted-foreground">
                      Última verificação: {new Date(service.lastCheck).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.responseTime}ms</p>
                    <p className="text-xs text-muted-foreground">Tempo de resposta</p>
                  </div>
                  <Badge 
                    variant={service.status === 'operational' ? 'default' : 'destructive'}
                  >
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de Uso */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Uso</CardTitle>
          <CardDescription>
            Uso detalhado por serviço
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {usageStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{stat.service}</h4>
                  <span className="text-sm text-muted-foreground">
                    {stat.successfulRequests}/{stat.totalRequests} sucessos
                  </span>
                </div>
                <Progress 
                  value={(stat.successfulRequests / stat.totalRequests) * 100} 
                  className="h-2"
                />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Última hora</p>
                    <p className="font-medium">{stat.lastHour}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Último dia</p>
                    <p className="font-medium">{stat.lastDay}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tempo médio</p>
                    <p className="font-medium">{stat.averageResponseTime}ms</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados dos Testes */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Testes de Conectividade</CardTitle>
            <CardDescription>
              Resultados dos testes das APIs externas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(testResults).map(([service, result]) => (
                <div key={service} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {result.status === 'operational' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium capitalize">{service}</span>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={result.status === 'operational' ? 'default' : 'destructive'}
                    >
                      {result.status}
                    </Badge>
                    {result.error && (
                      <p className="text-xs text-red-500 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIMonitoringDashboard;