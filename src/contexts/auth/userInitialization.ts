
import { supabase } from '../../integrations/supabase/client';

export const initializeUserData = async (userId: string) => {
  try {
    console.log('Inicializando dados do usuário:', userId);

    console.log('Step 1: Verificando se o usuário existe no banco...');
    
    // Check if user profile was created
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil do usuário:', profileError);
    } else {
      console.log('Perfil do usuário encontrado:', !!profile);
    }

    console.log('Step 2: Criando configurações padrão do usuário...');

    // Criar configurações padrão do usuário - não falhar se já existir
    try {
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
    } catch (settingsError) {
      console.warn('Erro na criação de configurações:', settingsError);
    }

    console.log('Step 3: Criando plano padrão do usuário...');

    // Criar plano padrão do usuário - não falhar se já existir
    try {
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
    } catch (planError) {
      console.warn('Erro na criação do plano:', planError);
    }

    console.log('Dados básicos do usuário inicializados');
    
  } catch (error) {
    console.error('Erro ao inicializar dados do usuário:', error);
    // Não falhar o processo de registro por causa disso
    throw new Error('Falha na inicialização de dados básicos');
  }
};
