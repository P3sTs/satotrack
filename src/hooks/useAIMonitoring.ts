import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIHealthStatus {
  service: string;
  status: 'operational' | 'degraded' | 'offline';
  responseTime: number;
  lastCheck: string;
  errorCount: number;
}

interface AIUsageStats {
  service: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastHour: number;
  lastDay: number;
}

interface AITestResults {
  openai: { status: string; error?: string };
  gemini: { status: string; error?: string };
  tatum: { status: string; error?: string };
}

export const useAIMonitoring = () => {
  const [healthStatus, setHealthStatus] = useState<AIHealthStatus[]>([]);
  const [usageStats, setUsageStats] = useState<AIUsageStats[]>([]);
  const [testResults, setTestResults] = useState<AITestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'degraded' | 'critical'>('healthy');

  // Verificar saúde dos serviços de IA
  const checkHealthStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-monitoring', {
        body: { action: 'health_check' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setHealthStatus(data.data.services);
        setOverallStatus(data.data.overall_status);
        
        // Mostrar alertas se houver problemas
        const offlineServices = data.data.services.filter((s: AIHealthStatus) => s.status === 'offline');
        if (offlineServices.length > 0) {
          toast.error(`⚠️ Serviços offline: ${offlineServices.map((s: AIHealthStatus) => s.service).join(', ')}`);
        }
      }
    } catch (error: any) {
      console.error('Erro ao verificar status dos serviços:', error);
      toast.error('Erro ao verificar status dos serviços de IA');
    } finally {
      setIsLoading(false);
    }
  };

  // Obter estatísticas de uso
  const getUsageStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-monitoring', {
        body: { action: 'usage_stats' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setUsageStats(data.data);
      }
    } catch (error: any) {
      console.error('Erro ao obter estatísticas:', error);
      toast.error('Erro ao obter estatísticas de uso');
    }
  };

  // Testar conectividade com todos os serviços de IA
  const testAIServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-monitoring', {
        body: { action: 'test_ai_services' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setTestResults(data.data);
        
        // Mostrar resultados dos testes
        const failedTests = Object.entries(data.data).filter(([_, result]: [string, any]) => result.status === 'error');
        if (failedTests.length > 0) {
          toast.error(`❌ Testes falharam: ${failedTests.map(([service, _]) => service).join(', ')}`);
        } else {
          toast.success('✅ Todos os serviços de IA estão funcionando');
        }
      }
    } catch (error: any) {
      console.error('Erro ao testar serviços:', error);
      toast.error('Erro ao testar conectividade dos serviços');
    } finally {
      setIsLoading(false);
    }
  };

  // Monitoramento automático a cada 5 minutos
  useEffect(() => {
    checkHealthStatus();
    getUsageStats();

    const interval = setInterval(() => {
      checkHealthStatus();
      getUsageStats();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, []);

  // Calcular métricas agregadas
  const getAggregatedMetrics = () => {
    if (usageStats.length === 0) return null;

    const totalRequests = usageStats.reduce((sum, stat) => sum + stat.totalRequests, 0);
    const totalSuccessful = usageStats.reduce((sum, stat) => sum + stat.successfulRequests, 0);
    const totalFailed = usageStats.reduce((sum, stat) => sum + stat.failedRequests, 0);
    const avgResponseTime = usageStats.reduce((sum, stat) => sum + stat.averageResponseTime, 0) / usageStats.length;

    return {
      totalRequests,
      successRate: totalRequests > 0 ? (totalSuccessful / totalRequests) * 100 : 0,
      errorRate: totalRequests > 0 ? (totalFailed / totalRequests) * 100 : 0,
      avgResponseTime: Math.round(avgResponseTime)
    };
  };

  // Obter status de um serviço específico
  const getServiceStatus = (serviceName: string) => {
    return healthStatus.find(status => status.service === serviceName);
  };

  // Verificar se todos os serviços estão operacionais
  const areAllServicesOperational = () => {
    return healthStatus.length > 0 && healthStatus.every(status => status.status === 'operational');
  };

  return {
    // Estado
    healthStatus,
    usageStats,
    testResults,
    isLoading,
    overallStatus,
    
    // Ações
    checkHealthStatus,
    getUsageStats,
    testAIServices,
    
    // Helpers
    getAggregatedMetrics,
    getServiceStatus,
    areAllServicesOperational
  };
};