
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  id: string;
  event_type: string;
  details: any;
  created_at: string;
}

export const useSecurityMonitor = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Log security events
  const logSecurityEvent = async (eventType: string, details: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('security_logs')
        .insert({
          user_id: user.id,
          event_type: eventType,
          details: {
            ...details,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: 'client-side' // Would be set server-side in production
          }
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  };

  // Monitor suspicious activities
  const detectSuspiciousActivity = (activity: string, details: any) => {
    const suspiciousPatterns = [
      'multiple_failed_logins',
      'rapid_api_calls',
      'unusual_transaction_amount',
      'foreign_ip_access',
      'private_key_access_attempt'
    ];

    if (suspiciousPatterns.includes(activity)) {
      logSecurityEvent('suspicious_activity', {
        activity,
        ...details
      });
    }
  };

  // Load recent security events
  const loadSecurityEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSecurityEvents(data || []);
    } catch (error) {
      console.error('Failed to load security events:', error);
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      loadSecurityEvents();
    }
  }, [isMonitoring]);

  return {
    securityEvents,
    logSecurityEvent,
    detectSuspiciousActivity,
    loadSecurityEvents,
    setIsMonitoring
  };
};
