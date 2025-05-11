
-- Add missing columns to bitcoin_wallets table
ALTER TABLE bitcoin_wallets
ADD COLUMN IF NOT EXISTS last_update_attempt TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_successful_update TIMESTAMP WITH TIME ZONE;

-- Set default values for existing records
UPDATE bitcoin_wallets
SET last_update_attempt = last_updated,
    last_successful_update = last_updated;
