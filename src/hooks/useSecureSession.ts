import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface SecureSession {
  isLocked: boolean;
  lastActivity: Date;
  sessionTimeout: number;
  lockScreen: () => void;
  unlockScreen: (pin: string) => Promise<boolean>;
  updateActivity: () => void;
  logSecurityEvent: (eventType: string, details?: any) => Promise<void>;
}

export const useSecureSession = (): SecureSession => {
  const { user } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes

  // Log security events
  const logSecurityEvent = useCallback(async (eventType: string, details?: any) => {
    if (!user) return;

    try {
      await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_event_type: eventType,
        p_event_details: details || {},
        p_ip_address: 'client-side',
        p_user_agent: navigator.userAgent,
        p_session_id: `session_${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [user]);

  // Update activity timestamp
  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Lock screen
  const lockScreen = useCallback(() => {
    setIsLocked(true);
    logSecurityEvent('session_locked', { reason: 'manual_lock' });
  }, [logSecurityEvent]);

  // Unlock screen with PIN verification
  const unlockScreen = useCallback(async (pin: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_security_settings')
        .select('pin_hash, pin_salt, failed_attempts, max_failed_attempts')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        logSecurityEvent('unlock_failed', { reason: 'no_security_settings' });
        return false;
      }

      // Hash the provided PIN
      const encoder = new TextEncoder();
      const pinData = encoder.encode(pin + data.pin_salt);
      const hashBuffer = await crypto.subtle.digest('SHA-256', pinData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPin = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (hashedPin === data.pin_hash) {
        setIsLocked(false);
        updateActivity();
        
        // Reset failed attempts
        await supabase
          .from('user_security_settings')
          .update({ 
            failed_attempts: 0,
            last_successful_auth: new Date().toISOString()
          })
          .eq('user_id', user.id);

        logSecurityEvent('session_unlocked', { method: 'pin' });
        return true;
      } else {
        // Increment failed attempts
        const newFailedAttempts = (data.failed_attempts || 0) + 1;
        await supabase
          .from('user_security_settings')
          .update({ failed_attempts: newFailedAttempts })
          .eq('user_id', user.id);

        logSecurityEvent('unlock_failed', { 
          reason: 'invalid_pin',
          failed_attempts: newFailedAttempts
        });

        // Lock account if max attempts reached
        if (newFailedAttempts >= (data.max_failed_attempts || 5)) {
          const lockUntil = new Date();
          lockUntil.setMinutes(lockUntil.getMinutes() + 30); // Lock for 30 minutes
          
          await supabase
            .from('user_security_settings')
            .update({ locked_until: lockUntil.toISOString() })
            .eq('user_id', user.id);

          logSecurityEvent('account_locked', { 
            reason: 'max_failed_attempts',
            locked_until: lockUntil.toISOString()
          });
        }

        return false;
      }
    } catch (error) {
      console.error('Unlock error:', error);
      logSecurityEvent('unlock_error', { error: error.message });
      return false;
    }
  }, [user, logSecurityEvent, updateActivity]);

  // Auto-lock timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - lastActivity.getTime();
      const timeoutMs = sessionTimeout * 60 * 1000; // Convert to milliseconds

      if (timeDiff >= timeoutMs && !isLocked) {
        setIsLocked(true);
        logSecurityEvent('session_auto_locked', { 
          timeout_minutes: sessionTimeout,
          last_activity: lastActivity.toISOString()
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [lastActivity, sessionTimeout, isLocked, logSecurityEvent]);

  // Load security settings
  useEffect(() => {
    if (user) {
      const loadSecuritySettings = async () => {
        const { data } = await supabase
          .from('user_security_settings')
          .select('session_timeout_minutes, auto_lock_enabled')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setSessionTimeout(data.session_timeout_minutes || 30);
        }
      };

      loadSecuritySettings();
    }
  }, [user]);

  return {
    isLocked,
    lastActivity,
    sessionTimeout,
    lockScreen,
    unlockScreen,
    updateActivity,
    logSecurityEvent
  };
};