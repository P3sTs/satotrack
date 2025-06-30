
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, AlertCircle, Clock, Database, Zap } from 'lucide-react';

interface MonitoringMetrics {
  totalWallets: number;
  activeOperations: number;
  successRate: number;
  avgResponseTime: number;
  lastUpdated: string;
  recentEvents: Array<{
    id: string;
    type: 'success' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

export const CryptoMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    totalWallets: 0,
    activeOperations: 0,
    successRate: 0,
    avgResponseTime: 0,
    lastUpdated: '',
    recentEvents: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de métricas
      // Em produção, isso viria de uma API ou service
      
      // Carregar logs de auditoria para calcular métricas
      const auditLogs = JSON.parse(localStorage.getItem('security_audit_logs') || '[]');
      const kmsLogs = JSON.parse(localStorage.getItem('kms_audit_logs') || '[]');
      const allLogs = [...auditLogs, ...kmsLogs];
      
      // Calcular taxa de sucesso
      const successLogs = allLogs.filter(log => 
        log.operation?.includes('SUCCESS') || log.eventType?.includes('SUCCESS')
      );
      const successRate = allLogs.length > 0 ? (successLogs.length / allLogs.length) * 100 : 0;
      
      // Eventos recentes
      const recentEvents = allLogs
        .slice(-10)
        .map((log, index) => ({
          id: `event-${index}`,
          type: log.operation?.includes('ERROR') || log.eventType?.includes('ERROR') ? 'error' as const :
                log.operation?.includes('WARNING') || log.eventType?.includes('WARNING') ? 'warning' as const :
                'success' as const,
          message: log.operation || log.eventType || 'Operação desconhecida',
          timestamp: new Date(log.timestamp).toLocaleString('pt-BR')
        }))
        .reverse();

      setMetrics({
        totalWallets: 5, // Número padrão de moedas suportadas
        activeOperations: Math.floor(Math.random() * 3), // Simular operações ativas
        successRate: Math.round(successRate),
        avgResponseTime: Math.round(200 + Math.random() * 300), // Simular tempo de resposta
        lastUpdated: new Date().toLocaleString('pt-BR'),
        recentEvents
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Atualizar métricas a cada 30 segundos
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <Activity className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-blue-400" />;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-400">Carteiras</span>
            </div>
            <p className="text-2xl font-bold text-blue-300">{metrics.totalWallets}</p>
            <p className="text-xs text-muted-foreground">Total configuradas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">Taxa Sucesso</span>
            </div>
            <p className="text-2xl font-bold text-green-300">{metrics.successRate}%</p>
            <p className="text-xs text-muted-foreground">Operações bem-sucedidas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-400">Operações</span>
            </div>
            <p className="text-2xl font-bold text-purple-300">{metrics.activeOperations}</p>
            <p className="text-xs text-muted-foreground">Ativas agora</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-orange-400">Resposta</span>
            </div>
            <p className="text-2xl font-bold text-orange-300">{metrics.avgResponseTime}ms</p>
            <p className="text-xs text-muted-foreground">Tempo médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Eventos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-satotrack-neon" />
              <span>Eventos Recentes</span>
            </div>
            <Button
              onClick={loadMetrics}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? 'Carregando...' : 'Atualizar'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.recentEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum evento registrado</p>
              <p className="text-sm">Os eventos aparecerão aqui conforme ocorrem</p>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.message}</p>
                    <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                  </div>
                  <Badge variant="outline" className={getEventBadgeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          
          {metrics.lastUpdated && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Última atualização: {metrics.lastUpdated}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
