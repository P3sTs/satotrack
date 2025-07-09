-- Create user_security_settings table
CREATE TABLE public.user_security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pin_hash TEXT,
  pin_salt TEXT,
  biometric_enabled BOOLEAN NOT NULL DEFAULT false,
  pin_enabled BOOLEAN NOT NULL DEFAULT false,
  security_setup_completed BOOLEAN NOT NULL DEFAULT false,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_successful_auth TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own security settings"
  ON public.user_security_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings"
  ON public.user_security_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
  ON public.user_security_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_security_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_security_settings_updated_at();