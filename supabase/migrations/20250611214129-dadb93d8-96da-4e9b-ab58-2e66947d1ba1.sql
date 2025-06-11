
-- Create user_alerts table for the personalized alerts system
CREATE TABLE public.user_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('balance', 'transaction', 'price', 'volume')),
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below', 'equals')),
  threshold NUMERIC NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('BTC', 'BRL', 'USD')),
  wallet_id UUID REFERENCES crypto_wallets(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notification_methods TEXT[] NOT NULL DEFAULT ARRAY['push'],
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own alerts
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for user_alerts
CREATE POLICY "Users can view their own alerts" 
  ON public.user_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts" 
  ON public.user_alerts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
  ON public.user_alerts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" 
  ON public.user_alerts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_alerts_user_id ON public.user_alerts(user_id);
CREATE INDEX idx_user_alerts_active ON public.user_alerts(is_active) WHERE is_active = true;
