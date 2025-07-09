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
  location?: string;
  userAgent?: string;
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
          device: details.device || `${details.browser || 'Chrome'}/${details.os || 'Windows'}`,
          status: details.success ? 'success' : 'failed',
          location: details.location ? `${details.location.city}, ${details.location.country}` : 'Desconhecida',
          userAgent: details.user_agent || 'Desconhecido'
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

  const getLocationFromIP = useCallback(async (ip: string) => {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return {
        city: data.city || 'Desconhecida',
        region: data.region || 'Desconhecida',
        country: data.country_name || 'Desconhecido',
        timezone: data.timezone || 'UTC'
      };
    } catch (error) {
      return {
        city: 'Desconhecida',
        region: 'Desconhecida', 
        country: 'Desconhecido',
        timezone: 'UTC'
      };
    }
  }, []);

  const getCurrentIP = useCallback(async () => {
    try {
      const response = await fetch('https://ipapi.co/ip/');
      return await response.text();
    } catch (error) {
      return '192.168.1.100'; // Fallback IP
    }
  }, []);

  const recordSecurityEvent = useCallback(async (
    eventType: string, 
    details: any = {}
  ) => {
    if (!user) return;

    try {
      const currentIP = await getCurrentIP();
      const location = await getLocationFromIP(currentIP);
      const userAgent = navigator.userAgent;
      const browserInfo = getBrowserInfo(userAgent);

      await supabase
        .from('security_logs')
        .insert({
          user_id: user.id,
          event_type: eventType,
          details: {
            ...details,
            timestamp: new Date().toISOString(),
            ip: currentIP,
            location: location,
            device: `${browserInfo.browser}/${browserInfo.os}`,
            user_agent: userAgent,
            success: details.success !== false,
            session_id: crypto.randomUUID()
          }
        });
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  }, [user, getCurrentIP, getLocationFromIP]);

  const getBrowserInfo = useCallback((userAgent: string) => {
    const browser = userAgent.includes('Chrome') ? 'Chrome' :
                   userAgent.includes('Firefox') ? 'Firefox' :
                   userAgent.includes('Safari') ? 'Safari' :
                   userAgent.includes('Edge') ? 'Edge' : 'Desconhecido';
    
    const os = userAgent.includes('Windows') ? 'Windows' :
               userAgent.includes('Mac') ? 'macOS' :
               userAgent.includes('Linux') ? 'Linux' :
               userAgent.includes('Android') ? 'Android' :
               userAgent.includes('iOS') ? 'iOS' : 'Desconhecido';
    
    return { browser, os };
  }, []);

  useEffect(() => {
    if (!user) return;

    // Initial load
    const initializeData = async () => {
      await loadSecurityLogs();
      await loadSecurityMetrics();
      
      // Register page access event after initial load
      recordSecurityEvent('page_access', {
        page: 'security_dashboard',
        success: true
      });
    };

    initializeData();

    // Set up real-time updates
    const channel = supabase
      .channel('security-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_logs',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadSecurityLogs();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_security_settings',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadSecurityMetrics();
        }
      )
      .subscribe();

    // Auto refresh interval
    const interval = setInterval(() => {
      loadSecurityLogs();
      loadSecurityMetrics();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [user, loadSecurityLogs, loadSecurityMetrics]);

  return {
    securityLogs,
    securityMetrics,
    recordSecurityEvent
  };
};