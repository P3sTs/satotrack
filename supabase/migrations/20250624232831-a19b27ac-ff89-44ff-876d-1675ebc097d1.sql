
-- Criar tabela crypto_wallets conforme especificação
CREATE TABLE IF NOT EXISTS public.crypto_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  address TEXT NOT NULL UNIQUE,
  xpub TEXT,
  private_key_encrypted TEXT, -- Para funcionalidade de envio
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Garantir que cada usuário tenha apenas 1 endereço por moeda
  UNIQUE(user_id, currency)
);

-- Habilitar RLS
ALTER TABLE public.crypto_wallets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários só veem suas próprias carteiras
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

-- Função para gerar carteiras automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION generate_user_crypto_wallets()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir placeholder para carteiras que serão geradas via Edge Function
  INSERT INTO public.crypto_wallets (user_id, currency, address, xpub) VALUES
  (NEW.id, 'BTC', 'pending_generation', NULL),
  (NEW.id, 'ETH', 'pending_generation', NULL),
  (NEW.id, 'MATIC', 'pending_generation', NULL),
  (NEW.id, 'USDT', 'pending_generation', NULL),
  (NEW.id, 'SOL', 'pending_generation', NULL);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para gerar carteiras automaticamente
CREATE TRIGGER auto_generate_crypto_wallets
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION generate_user_crypto_wallets();

-- Tabela para histórico de transações
CREATE TABLE IF NOT EXISTS public.crypto_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.crypto_wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_hash TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('send', 'receive')),
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  gas_fee DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- RLS para transações
ALTER TABLE public.crypto_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" 
  ON public.crypto_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
  ON public.crypto_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
