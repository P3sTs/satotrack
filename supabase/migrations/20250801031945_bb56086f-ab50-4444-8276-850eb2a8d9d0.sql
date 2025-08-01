
-- Create staking protocols table
CREATE TABLE public.staking_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  network TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  abi JSONB NOT NULL,
  token TEXT NOT NULL,
  apy NUMERIC NOT NULL,
  min_amount NUMERIC NOT NULL,
  platform_fee_percentage NUMERIC DEFAULT 0.5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staking positions table
CREATE TABLE public.staking_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  protocol_id UUID NOT NULL REFERENCES public.staking_protocols(id),
  wallet_address TEXT NOT NULL,
  staked_amount NUMERIC NOT NULL,
  rewards_earned NUMERIC DEFAULT 0,
  transaction_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unstaking', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staking rewards table
CREATE TABLE public.staking_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id UUID NOT NULL REFERENCES public.staking_positions(id),
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed BOOLEAN NOT NULL DEFAULT false,
  transaction_hash TEXT
);

-- Create staking transactions table
CREATE TABLE public.staking_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  position_id UUID REFERENCES public.staking_positions(id),
  hash TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stake', 'unstake', 'claim')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  gas_used TEXT,
  gas_fee TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.staking_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for staking_protocols (public read, admin write)
CREATE POLICY "Anyone can view active staking protocols" 
ON public.staking_protocols 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Service role can manage staking protocols" 
ON public.staking_protocols 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for staking_positions
CREATE POLICY "Users can view their own staking positions" 
ON public.staking_positions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own staking positions" 
ON public.staking_positions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own staking positions" 
ON public.staking_positions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all staking positions" 
ON public.staking_positions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for staking_rewards
CREATE POLICY "Users can view rewards for their positions" 
ON public.staking_rewards 
FOR SELECT 
USING (
  position_id IN (
    SELECT id FROM public.staking_positions 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Service role can manage all staking rewards" 
ON public.staking_rewards 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for staking_transactions
CREATE POLICY "Users can view their own staking transactions" 
ON public.staking_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own staking transactions" 
ON public.staking_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all staking transactions" 
ON public.staking_transactions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_staking_positions_user_id ON public.staking_positions(user_id);
CREATE INDEX idx_staking_positions_protocol_id ON public.staking_positions(protocol_id);
CREATE INDEX idx_staking_positions_status ON public.staking_positions(status);
CREATE INDEX idx_staking_rewards_position_id ON public.staking_rewards(position_id);
CREATE INDEX idx_staking_rewards_claimed ON public.staking_rewards(claimed);
CREATE INDEX idx_staking_transactions_user_id ON public.staking_transactions(user_id);
CREATE INDEX idx_staking_transactions_position_id ON public.staking_transactions(position_id);

-- Insert default staking protocols
INSERT INTO public.staking_protocols (name, network, contract_address, abi, token, apy, min_amount, platform_fee_percentage) VALUES
('Lido Staked Ether', 'ethereum', '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', '[]', 'ETH', 3.8, 0.01, 0.5),
('Polygon Staking', 'polygon', '0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908', '[]', 'MATIC', 7.2, 1.0, 0.5),
('Rocket Pool', 'ethereum', '0xDD3f50F8A6CafbE9b31a427582963f465E745AF8', '[]', 'ETH', 4.1, 0.01, 0.5);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_staking_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_staking_protocols_updated_at
  BEFORE UPDATE ON public.staking_protocols
  FOR EACH ROW
  EXECUTE FUNCTION public.update_staking_updated_at_column();

CREATE TRIGGER update_staking_positions_updated_at
  BEFORE UPDATE ON public.staking_positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_staking_updated_at_column();
