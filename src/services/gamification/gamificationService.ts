
import { supabase } from '@/integrations/supabase/client';

export interface UserStats {
  id: string;
  user_id: string;
  total_likes: number;
  level: number;
  xp: number;
  streak: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
}

export interface WidgetLike {
  id: string;
  user_id: string;
  widget_id: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export const gamificationService = {
  // Obter estatísticas do usuário
  async getUserStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user stats:', error);
      return null;
    }

    return data;
  },

  // Obter conquistas do usuário
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  },

  // Obter curtidas dos widgets do usuário
  async getUserWidgetLikes(userId: string): Promise<WidgetLike[]> {
    const { data, error } = await supabase
      .from('widget_likes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching widget likes:', error);
      return [];
    }

    return data || [];
  },

  // Curtir um widget
  async likeWidget(userId: string, widgetId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from('widget_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('widget_id', widgetId)
      .single();

    if (existing) {
      // Incrementar curtida existente
      const { error } = await supabase
        .from('widget_likes')
        .update({
          likes_count: existing.likes_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating widget like:', error);
        return false;
      }
    } else {
      // Criar nova curtida
      const { error } = await supabase
        .from('widget_likes')
        .insert({
          user_id: userId,
          widget_id: widgetId,
          likes_count: 1
        });

      if (error) {
        console.error('Error creating widget like:', error);
        return false;
      }
    }

    // Atualizar estatísticas do usuário (via trigger)
    await this.updateUserStats(userId, 10);
    return true;
  },

  // Remover curtida de um widget
  async unlikeWidget(userId: string, widgetId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from('widget_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('widget_id', widgetId)
      .single();

    if (!existing) return false;

    if (existing.likes_count > 1) {
      // Decrementar curtida
      const { error } = await supabase
        .from('widget_likes')
        .update({
          likes_count: existing.likes_count - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating widget like:', error);
        return false;
      }
    } else {
      // Remover curtida completamente
      const { error } = await supabase
        .from('widget_likes')
        .delete()
        .eq('id', existing.id);

      if (error) {
        console.error('Error deleting widget like:', error);
        return false;
      }
    }

    return true;
  },

  // Atualizar estatísticas do usuário
  async updateUserStats(userId: string, xpChange: number = 0): Promise<void> {
    const { error } = await supabase.rpc('update_user_stats', {
      p_user_id: userId,
      p_xp_change: xpChange
    });

    if (error) {
      console.error('Error updating user stats:', error);
    }
  },

  // Verificar e desbloquear conquistas
  async checkAchievements(userId: string): Promise<void> {
    const { error } = await supabase.rpc('check_and_unlock_achievements', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error checking achievements:', error);
    }
  },

  // Verificar se widget foi curtido
  async isWidgetLiked(userId: string, widgetId: string): Promise<boolean> {
    const { data } = await supabase
      .from('widget_likes')
      .select('likes_count')
      .eq('user_id', userId)
      .eq('widget_id', widgetId)
      .single();

    return data ? data.likes_count > 0 : false;
  },

  // Obter contagem de curtidas de um widget
  async getWidgetLikeCount(userId: string, widgetId: string): Promise<number> {
    const { data } = await supabase
      .from('widget_likes')
      .select('likes_count')
      .eq('user_id', userId)
      .eq('widget_id', widgetId)
      .single();

    return data ? data.likes_count : 0;
  }
};
