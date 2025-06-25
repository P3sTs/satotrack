
-- Primeiro, vamos criar as políticas RLS necessárias para a tabela profiles
-- Permitir que usuários vejam seus próprios perfis
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Permitir que usuários criem seus próprios perfis
CREATE POLICY "Users can create own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Permitir que usuários atualizem seus próprios perfis
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Habilitar RLS na tabela profiles se não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verificar se a função handle_new_user existe e criar/atualizar se necessário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
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

-- Criar trigger para criar perfil automaticamente quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Garantir que as tabelas relacionadas também tenham as políticas corretas
-- Remover políticas existentes e criar novas para user_settings
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Para user_plans  
DROP POLICY IF EXISTS "Users can view own plans" ON public.user_plans;
CREATE POLICY "Users can view own plans" ON public.user_plans
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own plans" ON public.user_plans;
CREATE POLICY "Users can create own plans" ON public.user_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Habilitar RLS nas tabelas se não estiver habilitado
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
