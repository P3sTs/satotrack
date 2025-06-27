
-- Adicionar a coluna currency na tabela crypto_wallets que está faltando
ALTER TABLE public.crypto_wallets 
ADD COLUMN IF NOT EXISTS currency text;

-- Atualizar registros existentes que podem não ter currency definido
UPDATE public.crypto_wallets 
SET currency = CASE 
  WHEN name ILIKE '%bitcoin%' THEN 'BTC'
  WHEN name ILIKE '%ethereum%' THEN 'ETH'  
  WHEN name ILIKE '%polygon%' THEN 'MATIC'
  WHEN name ILIKE '%tether%' THEN 'USDT'
  WHEN name ILIKE '%solana%' THEN 'SOL'
  ELSE 'UNKNOWN'
END
WHERE currency IS NULL;

-- Corrigir a função de trigger para usar currency em vez de network_id
CREATE OR REPLACE FUNCTION public.generate_user_crypto_wallets()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Insert placeholder carteiras que serão geradas via Edge Function
  INSERT INTO public.crypto_wallets (user_id, name, address, currency) VALUES
  (NEW.id, 'Bitcoin', 'pending_generation', 'BTC'),
  (NEW.id, 'Ethereum', 'pending_generation', 'ETH'),
  (NEW.id, 'Polygon', 'pending_generation', 'MATIC'),
  (NEW.id, 'Tether', 'pending_generation', 'USDT'),
  (NEW.id, 'Solana', 'pending_generation', 'SOL');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log erro mas não falha o registro do usuário
    RAISE WARNING 'Failed to create crypto wallets for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Recriar o trigger de criação de usuário para ser mais robusto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create user profile primeiro
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro mas não falha o registro
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;
