
import { supabase } from '../../integrations/supabase/client';

export const initializeUserData = async (userId: string) => {
  try {
    console.log('Inicializando dados do usuário:', userId);

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
    }

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
    }

    console.log('Dados do usuário inicializados com sucesso');
    
  } catch (error) {
    console.error('Erro ao inicializar dados do usuário:', error);
    // Não falhar o processo de registro por causa disso
  }
};
