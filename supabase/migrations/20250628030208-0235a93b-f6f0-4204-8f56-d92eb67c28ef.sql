
-- Verificar e corrigir as políticas RLS para crypto_wallets
-- Primeiro, vamos garantir que RLS está habilitado
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver conflitos
DROP POLICY IF EXISTS "Users can view their own crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Users can insert their own crypto wallets" ON public.crypto_wallets;
DROP POLICY IF EXISTS "Users can update their own crypto wallets" ON public.crypto_wallets;

-- Criar políticas RLS corretas
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crypto wallets" 
  ON public.crypto_wallets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Verificar se a coluna user_id permite NULL (deve ser NOT NULL para RLS funcionar)
-- Se necessário, corrigir a coluna user_id
ALTER TABLE public.crypto_wallets 
ALTER COLUMN user_id SET NOT NULL;

-- Garantir que o default seja auth.uid() para inserções automáticas
ALTER TABLE public.crypto_wallets 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Verificar se existe constraint única correta
-- Remover constraint existente se houver
ALTER TABLE public.crypto_wallets DROP CONSTRAINT IF EXISTS crypto_wallets_user_id_currency_key;
ALTER TABLE public.crypto_wallets DROP CONSTRAINT IF EXISTS crypto_wallets_address_key;

-- Recriar constraints necessárias
ALTER TABLE public.crypto_wallets 
ADD CONSTRAINT crypto_wallets_user_id_currency_key UNIQUE(user_id, currency);

-- Verificar se a função trigger ainda funciona corretamente
-- Atualizar função generate_user_crypto_wallets para ser mais robusta
CREATE OR REPLACE FUNCTION generate_user_crypto_wallets()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir placeholder para carteiras que serão geradas via Edge Function
  INSERT INTO public.crypto_wallets (user_id, currency, address, xpub) VALUES
  (NEW.id, 'BTC', 'pending_generation', NULL),
  (NEW.id, 'ETH', 'pending_generation', NULL),
  (NEW.id, 'MATIC', 'pending_generation', NULL),
  (NEW.id, 'USDT', 'pending_generation', NULL),
  (NEW.id, 'SOL', 'pending_generation', NULL)
  ON CONFLICT (user_id, currency) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log erro mas não falha o registro do usuário
    RAISE WARNING 'Failed to create crypto wallets for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
