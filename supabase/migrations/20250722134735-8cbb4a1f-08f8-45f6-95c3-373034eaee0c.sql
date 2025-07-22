-- Criar tabela para histórico de swaps
CREATE TABLE public.swap_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  from_amount NUMERIC NOT NULL,
  to_amount NUMERIC NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  swap_rate NUMERIC NOT NULL,
  network_fee TEXT NOT NULL,
  platform_fee_amount NUMERIC NOT NULL,
  platform_fee_type TEXT NOT NULL CHECK (platform_fee_type IN ('fixed', 'percentage')),
  platform_fee_currency TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.swap_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own swap transactions" 
  ON public.swap_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swap transactions" 
  ON public.swap_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all swap transactions" 
  ON public.swap_transactions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_swap_transactions_user_id ON public.swap_transactions(user_id);
CREATE INDEX idx_swap_transactions_status ON public.swap_transactions(status);
CREATE INDEX idx_swap_transactions_created_at ON public.swap_transactions(created_at DESC);

-- Configurações da plataforma (carteira para receber taxas)
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS para configurações (somente service role)
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage platform settings" 
  ON public.platform_settings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Inserir configurações padrão
INSERT INTO public.platform_settings (setting_key, setting_value) VALUES
('swap_fees', '{
  "fixed": {
    "BTC": "0.00001",
    "ETH": "0.001",
    "USDT": "1.0",
    "MATIC": "0.1"
  },
  "percentage": {
    "rate": "0.5",
    "min_fee_usd": "0.5"
  },
  "platform_wallet": {
    "BTC": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    "ETH": "0x742d35Cc6639C0532fCf2B2d8B3FafA3C4e0d6d6",
    "USDT": "0x742d35Cc6639C0532fCf2B2d8B3FafA3C4e0d6d6",
    "MATIC": "0x742d35Cc6639C0532fCf2B2d8B3FafA3C4e0d6d6"
  }
}'),
('swap_enabled', '{"enabled": true, "maintenance_mode": false}');