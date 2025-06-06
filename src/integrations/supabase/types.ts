export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      binance_credentials: {
        Row: {
          api_key_encrypted: string
          api_permissions: string
          api_secret_encrypted: string
          created_at: string
          id: string
          is_active: boolean
          label: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted: string
          api_permissions?: string
          api_secret_encrypted: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string
          api_permissions?: string
          api_secret_encrypted?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blockchain_networks: {
        Row: {
          chain_id: string | null
          created_at: string
          explorer_url: string | null
          id: string
          is_active: boolean
          name: string
          rpc_url: string | null
          symbol: string
        }
        Insert: {
          chain_id?: string | null
          created_at?: string
          explorer_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          rpc_url?: string | null
          symbol: string
        }
        Update: {
          chain_id?: string | null
          created_at?: string
          explorer_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rpc_url?: string | null
          symbol?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      crypto_wallets: {
        Row: {
          address: string
          address_type: string | null
          balance: number | null
          created_at: string | null
          id: string
          last_updated: string | null
          name: string
          native_token_balance: number | null
          network_id: string
          tokens_data: Json | null
          total_received: number | null
          total_sent: number | null
          transaction_count: number | null
          user_id: string | null
        }
        Insert: {
          address: string
          address_type?: string | null
          balance?: number | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          name: string
          native_token_balance?: number | null
          network_id: string
          tokens_data?: Json | null
          total_received?: number | null
          total_sent?: number | null
          transaction_count?: number | null
          user_id?: string | null
        }
        Update: {
          address?: string
          address_type?: string | null
          balance?: number | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          native_token_balance?: number | null
          network_id?: string
          tokens_data?: Json | null
          total_received?: number | null
          total_sent?: number | null
          transaction_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_wallets_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "blockchain_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      market_volatility: {
        Row: {
          id: string
          symbol: string
          updated_at: string | null
          volatility_score: number
        }
        Insert: {
          id?: string
          symbol: string
          updated_at?: string | null
          volatility_score: number
        }
        Update: {
          id?: string
          symbol?: string
          updated_at?: string | null
          volatility_score?: number
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          notification_type: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          notification_type: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          notification_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          created_at: string
          id: string
          snapshot_data: Json
          total_value_usdt: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          snapshot_data: Json
          total_value_usdt: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          snapshot_data?: Json
          total_value_usdt?: number
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          premium_expiry: string | null
          premium_status: string | null
          premium_until: string | null
          referral_code: string | null
          referral_count: number | null
          referred_by: string | null
          total_referrals: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          premium_expiry?: string | null
          premium_status?: string | null
          premium_until?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          total_referrals?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          premium_expiry?: string | null
          premium_status?: string | null
          premium_until?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          total_referrals?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_user_email: string
          referred_user_id: string
          referrer_user_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_user_email: string
          referred_user_id: string
          referrer_user_id: string
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_user_email?: string
          referred_user_id?: string
          referrer_user_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_user_id_fkey"
            columns: ["referrer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          status: string
          sync_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status: string
          sync_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status?: string
          sync_type?: string
          user_id?: string
        }
        Relationships: []
      }
      sync_settings: {
        Row: {
          created_at: string | null
          id: string
          last_sync: string | null
          mode: string
          next_sync: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_sync?: string | null
          mode?: string
          next_sync?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_sync?: string | null
          mode?: string
          next_sync?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          api_requests: number | null
          api_token: string | null
          created_at: string | null
          id: string
          plan_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_requests?: number | null
          api_token?: string | null
          created_at?: string | null
          id?: string
          plan_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_requests?: number | null
          api_token?: string | null
          created_at?: string | null
          id?: string
          plan_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          balance_alert_threshold: number | null
          created_at: string | null
          email_daily_summary: boolean | null
          email_weekly_summary: boolean | null
          id: string
          price_alert_threshold: number | null
          push_notifications_enabled: boolean | null
          telegram_chat_id: string | null
          telegram_notifications_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_alert_threshold?: number | null
          created_at?: string | null
          email_daily_summary?: boolean | null
          email_weekly_summary?: boolean | null
          id?: string
          price_alert_threshold?: number | null
          push_notifications_enabled?: boolean | null
          telegram_chat_id?: string | null
          telegram_notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_alert_threshold?: number | null
          created_at?: string | null
          email_daily_summary?: boolean | null
          email_weekly_summary?: boolean | null
          id?: string
          price_alert_threshold?: number | null
          push_notifications_enabled?: boolean | null
          telegram_chat_id?: string | null
          telegram_notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wallet_token_balances: {
        Row: {
          balance: number
          decimals: number
          id: string
          last_updated: string
          token_address: string
          token_name: string
          token_symbol: string
          usd_value: number | null
          wallet_id: string | null
        }
        Insert: {
          balance?: number
          decimals?: number
          id?: string
          last_updated?: string
          token_address: string
          token_name: string
          token_symbol: string
          usd_value?: number | null
          wallet_id?: string | null
        }
        Update: {
          balance?: number
          decimals?: number
          id?: string
          last_updated?: string
          token_address?: string
          token_name?: string
          token_symbol?: string
          usd_value?: number | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_token_balances_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "crypto_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          hash: string
          id: string
          transaction_date: string
          transaction_type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          hash: string
          id?: string
          transaction_date: string
          transaction_type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          hash?: string
          id?: string
          transaction_date?: string
          transaction_type?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "crypto_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_referral_code: {
        Args: { user_name: string; user_id: string }
        Returns: string
      }
      process_referral: {
        Args: { referrer_code: string; referred_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
