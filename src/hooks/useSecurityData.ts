import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export interface SecurityLog {
  id: string;
  type: string;
  timestamp: string;
  ip: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
}

export interface SecurityMetrics {
  totalLogins: number;
  successfulLogins: number;
  failedAttempts: number;
  biometricUse: number;
  lastPasswordChange: string;
  accountAge: number;
}

export const useSecurityData = () => {
  const { user } = useAuth();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalLogins: 0,
    successfulLogins: 0,
    failedAttempts: 0,
    biometricUse: 0,
    lastPasswordChange: '',
    accountAge: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadSecurityLogs = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const logs: SecurityLog[] = (data || []).map(log => {
        const details = log.details as any || {};
        return {
          id: log.id,
          type: log.event_type,
          timestamp: log.created_at,
          ip: details.ip || '192.168.1.100',
          device: details.device || 'Chrome/Windows',
          status: details.success ? 'success' : 'failed'
        };
      });

      setSecurityLogs(logs);
    } catch (error) {
      console.error('Erro ao carregar logs de segurança:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadSecurityMetrics = useCallback(async () => {
    if (!user) return;

    try {
      // Buscar configurações de segurança do usuário
      const { data: securitySettings } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Buscar logs para calcular métricas
      const { data: logs } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', user.id);

      const totalLogins = logs?.filter(log => log.event_type === 'login').length || 0;
      const successfulLogins = logs?.filter(log => {
        const details = log.details as any || {};
        return log.event_type === 'login' && details.success;
      }).length || 0;
      const failedAttempts = totalLogins - successfulLogins;
      
      // Calcular idade da conta
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const accountAge = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      setSecurityMetrics({
        totalLogins,
        successfulLogins,
        failedAttempts,
        biometricUse: securitySettings?.biometric_enabled ? 85 : 0,
        lastPasswordChange: user.created_at?.split('T')[0] || '',
        accountAge
      });
    } catch (error) {
      console.error('Erro ao carregar métricas de segurança:', error);
    }
  }, [user]);

  const recordSecurityEvent = useCallback(async (
    eventType: string, 
    details: any = {}
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('security_logs')
        .insert({
          user_id: user.id,
          event_type: eventType,
          details: {
            ...details,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip: '192.168.1.100' // Placeholder - em produção usar IP real
          }
        });
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSecurityLogs();
      loadSecurityMetrics();
    }
  }, [user, loadSecurityLogs, loadSecurityMetrics]);

  return {
    securityLogs,
    securityMetrics,
    isLoading,
    loadSecurityLogs,
    loadSecurityMetrics,
    recordSecurityEvent
  };
};