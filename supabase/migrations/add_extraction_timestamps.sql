
-- Add columns to track extraction timestamps
ALTER TABLE IF NOT EXISTS public.bitcoin_wallets 
  ADD COLUMN IF NOT EXISTS last_update_attempt timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS last_successful_update timestamptz;
