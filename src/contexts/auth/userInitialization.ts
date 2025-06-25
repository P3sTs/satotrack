
import { supabase } from '../../integrations/supabase/client';

export const initializeUserData = async (userId: string) => {
  try {
    console.log('Inicializando dados do usuário:', userId);

    // Add more detailed logging for debugging
    console.log('Step 1: Verificando se o usuário existe no banco...');
    
    // Check if user profile was created
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Erro ao verificar perfil do usuário:', profileError);
    } else {
      console.log('Perfil do usuário encontrado:', profile);
    }

    console.log('Step 2: Criando configurações padrão do usuário...');

    // Criar configurações padrão do usuário
    const { error: settingsError } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        email_daily_summary: false,
        email_weekly_summary: false,
        push_notifications_enabled: true,
        telegram_notifications_enabled: false,
        price_alert_threshold: 5,
        balance_alert_threshold: 0
      });

    if (settingsError && !settingsError.message.includes('duplicate')) {
      console.warn('Erro ao criar configurações do usuário:', settingsError);
    } else {
      console.log('Configurações do usuário criadas com sucesso');
    }

    console.log('Step 3: Criando plano padrão do usuário...');

    // Criar plano padrão do usuário
    const { error: planError } = await supabase
      .from('user_plans')
      .insert({
        user_id: userId,
        plan_type: 'free',
        api_requests: 1000
      });

    if (planError && !planError.message.includes('duplicate')) {
      console.warn('Erro ao criar plano do usuário:', planError);
    } else {
      console.log('Plano do usuário criado com sucesso');
    }

    console.log('Step 4: Verificando carteiras crypto criadas...');

    // Check if crypto wallets were created by the trigger
    const { data: wallets, error: walletsError } = await supabase
      .from('crypto_wallets')
      .select('*')
      .eq('user_id', userId);

    if (walletsError) {
      console.error('Erro ao verificar carteiras crypto:', walletsError);
    } else {
      console.log('Carteiras crypto encontradas:', wallets?.length || 0);
    }

    console.log('Dados do usuário inicializados com sucesso');
    
  } catch (error) {
    console.error('Erro ao inicializar dados do usuário:', error);
    // Não falhar o processo de registro por causa disso
  }
};
