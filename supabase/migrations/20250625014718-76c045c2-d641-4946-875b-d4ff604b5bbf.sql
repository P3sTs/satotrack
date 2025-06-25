
-- Adicionar colunas em falta na tabela crypto_wallets
ALTER TABLE public.crypto_wallets 
ADD COLUMN IF NOT EXISTS private_key_encrypted TEXT,
ADD COLUMN IF NOT EXISTS xpub TEXT;

-- Atualizar a função de geração automática para incluir currency
CREATE OR REPLACE FUNCTION generate_user_crypto_wallets()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir placeholder para carteiras que serão geradas via Edge Function
  INSERT INTO public.crypto_wallets (user_id, name, address, network_id) VALUES
  (NEW.id, 'Bitcoin', 'pending_generation', 'BTC'),
  (NEW.id, 'Ethereum', 'pending_generation', 'ETH'),
  (NEW.id, 'Polygon', 'pending_generation', 'MATIC'),
  (NEW.id, 'Tether', 'pending_generation', 'USDT'),
  (NEW.id, 'Solana', 'pending_generation', 'SOL');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
