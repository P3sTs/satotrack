
-- Primeiro, vamos corrigir a estrutura da tabela crypto_wallets
-- Tornar network_id nullable para evitar erros
ALTER TABLE public.crypto_wallets ALTER COLUMN network_id DROP NOT NULL;

-- Habilitar RLS na tabela crypto_wallets se ainda não estiver habilitado
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para recriar corretamente
DROP POLICY IF EXISTS "Users can view their own crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Users can insert their own crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Users can update their own crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Users can delete their own crypto wallets" ON public.crypto_wallets;

-- Criar políticas RLS seguras para crypto_wallets
CREATE POLICY "Users can view their own crypto wallets" 
  ON public.crypto_wallets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crypto wallets" 
  ON public.crypto_wallets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crypto wallets" 
  ON public.crypto_wallets 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crypto wallets" 
  ON public.crypto_wallets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Política para permitir que o serviço (SERVICE ROLE) acesse as carteiras
CREATE POLICY "Service role can manage all crypto wallets"
  ON public.crypto_wallets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Habilitar RLS e criar políticas para wallet_transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can insert their wallet transactions" ON public.wallet_transactions;

CREATE POLICY "Users can view their wallet transactions"
  ON public.wallet_transactions
  FOR SELECT
  USING (
    wallet_id IN (
      SELECT id FROM public.crypto_wallets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their wallet transactions"
  ON public.wallet_transactions
  FOR INSERT
  WITH CHECK (
    wallet_id IN (
      SELECT id FROM public.crypto_wallets WHERE user_id = auth.uid()
    )
  );

-- Política para permitir que o serviço acesse transações
CREATE POLICY "Service role can manage all wallet transactions"
  ON public.wallet_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Criar tabela de logs de segurança se não existir
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own security logs"
  ON public.security_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all security logs"
  ON public.security_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
