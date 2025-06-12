
-- Create user_goals table for financial goal tracking
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC(20, 8) NOT NULL,
  current_amount NUMERIC(20, 8) NOT NULL DEFAULT 0,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('btc', 'usd', 'brl')),
  target_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own goals
CREATE POLICY "Users can view their own goals" 
  ON public.user_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own goals
CREATE POLICY "Users can create their own goals" 
  ON public.user_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own goals
CREATE POLICY "Users can update their own goals" 
  ON public.user_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own goals
CREATE POLICY "Users can delete their own goals" 
  ON public.user_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX idx_user_goals_status ON public.user_goals(status);
