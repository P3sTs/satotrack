
-- Remover a constraint muito restritiva de Bitcoin
ALTER TABLE crypto_wallets DROP CONSTRAINT IF EXISTS valid_bitcoin_address;

-- Criar uma constraint mais flexível que aceita endereços de várias criptomoedas
ALTER TABLE crypto_wallets ADD CONSTRAINT valid_crypto_address 
CHECK (
  -- Bitcoin addresses (Legacy, SegWit, Bech32, Taproot)
  address ~ '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$' OR
  address ~ '^3[a-km-zA-HJ-NP-Z1-9]{25,34}$' OR
  address ~ '^(bc1|tb1)[a-zA-HJ-NP-Z0-9]{25,87}$' OR
  address ~ '^(bc1p|tb1p)[a-zA-HJ-NP-Z0-9]{58}$' OR
  -- Ethereum and EVM compatible addresses
  address ~ '^0x[a-fA-F0-9]{40}$' OR
  -- Solana addresses
  address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$' OR
  -- Litecoin addresses
  address ~ '^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$' OR
  address ~ '^ltc1[a-zA-HJ-NP-Z0-9]{25,87}$' OR
  -- Dogecoin addresses
  address ~ '^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$'
);
