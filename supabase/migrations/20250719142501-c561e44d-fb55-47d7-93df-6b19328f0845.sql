
-- Criar tabela para logs de auditoria de segurança
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de logs de auditoria
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem apenas seus próprios logs
CREATE POLICY "Users can view their own security logs"
  ON public.security_audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Política para inserção de logs (via service role)
CREATE POLICY "Service role can insert security logs"
  ON public.security_audit_logs FOR INSERT
  WITH CHECK (true);

-- Criar tabela para tokens de sessão temporários
CREATE TABLE IF NOT EXISTS public.user_session_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de tokens de sessão
ALTER TABLE public.user_session_tokens ENABLE ROW LEVEL SECURITY;

-- Política para usuários gerenciarem apenas seus próprios tokens
CREATE POLICY "Users can manage their own session tokens"
  ON public.user_session_tokens FOR ALL
  USING (auth.uid() = user_id);

-- Criar função para limpeza automática de tokens expirados
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.user_session_tokens 
  WHERE expires_at < now() OR is_active = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar tabela user_security_settings para incluir mais campos de segurança
ALTER TABLE public.user_security_settings 
ADD COLUMN IF NOT EXISTS session_timeout_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS max_failed_attempts INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS auto_lock_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS require_pin_for_transactions BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS require_biometric_for_large_amounts BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS large_amount_threshold NUMERIC DEFAULT 1000;

-- Função para registrar eventos de segurança
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    event_type,
    event_details,
    ip_address,
    user_agent,
    session_id
  ) VALUES (
    p_user_id,
    p_event_type,
    p_event_details,
    p_ip_address,
    p_user_agent,
    p_session_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
