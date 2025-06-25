
-- First, let's fix the crypto wallets generation function
-- The issue is that network_id expects a UUID but we're passing strings like 'BTC'

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS auto_generate_crypto_wallets ON auth.users;
DROP FUNCTION IF EXISTS public.generate_user_crypto_wallets();

-- Create a corrected function that doesn't use the problematic network_id field
CREATE OR REPLACE FUNCTION public.generate_user_crypto_wallets()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert placeholder for carteiras que serão geradas via Edge Function
  -- Using currency field instead of network_id to avoid UUID issues
  INSERT INTO public.crypto_wallets (user_id, name, address, currency) VALUES
  (NEW.id, 'Bitcoin', 'pending_generation', 'BTC'),
  (NEW.id, 'Ethereum', 'pending_generation', 'ETH'),
  (NEW.id, 'Polygon', 'pending_generation', 'MATIC'),
  (NEW.id, 'Tether', 'pending_generation', 'USDT'),
  (NEW.id, 'Solana', 'pending_generation', 'SOL');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER auto_generate_crypto_wallets
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_user_crypto_wallets();

-- Also, let's make sure the handle_new_user function is working correctly
-- and won't fail the user creation process
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create user profile
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
$$;
