export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      crypto_transactions: {
        Row: {
          amount: number
          block_number: number | null
          confirmed_at: string | null
          created_at: string
          currency: string
          from_address: string
          gas_fee: number | null
          id: string
          status: string
          to_address: string
          transaction_hash: string
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          block_number?: number | null
          confirmed_at?: string | null
          created_at?: string
          currency: string
          from_address: string
          gas_fee?: number | null
          id?: string
          status?: string
          to_address: string
          transaction_hash: string
          transaction_type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          block_number?: number | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          from_address?: string
          gas_fee?: number | null
          id?: string
          status?: string
          to_address?: string
          transaction_hash?: string
          transaction_type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crypto_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "crypto_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_wallets: {
        Row: {
          address: string
          address_type: string | null
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          last_updated: string | null
          name: string
          native_token_balance: number | null
          network_id: string | null
          private_key_encrypted: string | null
          tokens_data: Json | null
          total_received: number | null
          total_sent: number | null
          transaction_count: number | null
          user_id: string
          xpub: string | null
        }
        Insert: {
          address: string
          address_type?: string | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          last_updated?: string | null
          name: string
          native_token_balance?: number | null
          network_id?: string | null
          private_key_encrypted?: string | null
          tokens_data?: Json | null
          total_received?: number | null
          total_sent?: number | null
          transaction_count?: number | null
          user_id?: string
          xpub?: string | null
        }
        Update: {
          address?: string
          address_type?: string | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          native_token_balance?: number | null
          network_id?: string | null
          private_key_encrypted?: string | null
          tokens_data?: Json | null
          total_received?: number | null
          total_sent?: number | null
          transaction_count?: number | null
          user_id?: string
          xpub?: string | null
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
      diary_security_settings: {
        Row: {
          created_at: string
          id: string
          is_setup: boolean
          last_access: string | null
          password_hash: string
          salt: string
          updated_at: string
          user_phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_setup?: boolean
          last_access?: string | null
          password_hash: string
          salt: string
          updated_at?: string
          user_phone: string
        }
        Update: {
          created_at?: string
          id?: string
          is_setup?: boolean
          last_access?: string | null
          password_hash?: string
          salt?: string
          updated_at?: string
          user_phone?: string
        }
        Relationships: []
      }
      love_memories: {
        Row: {
          category: string
          created_at: string
          date: string | null
          description: string | null
          id: string
          image_size: number | null
          image_url: string
          location: string | null
          time: string | null
          title: string
          updated_at: string
          user_phone: string
        }
        Insert: {
          category?: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_size?: number | null
          image_url: string
          location?: string | null
          time?: string | null
          title: string
          updated_at?: string
          user_phone: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_size?: number | null
          image_url?: string
          location?: string | null
          time?: string | null
          title?: string
          updated_at?: string
          user_phone?: string
        }
        Relationships: []
      }
      love_messages: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          media_size: number | null
          media_url: string | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          sender_name: string
          sender_number: string
          text: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          media_size?: number | null
          media_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          sender_name: string
          sender_number: string
          text: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          media_size?: number | null
          media_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          sender_name?: string
          sender_number?: string
          text?: string
        }
        Relationships: []
      }
      love_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_phone: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_phone: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_phone?: string
        }
        Relationships: []
      }
      love_photos: {
        Row: {
          category: string
          created_at: string
          id: string
          location: string | null
          owner_number: string
          title: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          location?: string | null
          owner_number: string
          title: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          location?: string | null
          owner_number?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      love_plans: {
        Row: {
          created_at: string
          id: string
          status: string
          title: string
          updated_at: string
          user_phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_phone: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_phone?: string
        }
        Relationships: []
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
      menstrual_cycles: {
        Row: {
          created_at: string
          cycle_end: string | null
          cycle_length: number | null
          cycle_start: string
          id: string
          mood: string | null
          notes: string | null
          symptoms: string[] | null
          updated_at: string
          user_phone: string
        }
        Insert: {
          created_at?: string
          cycle_end?: string | null
          cycle_length?: number | null
          cycle_start: string
          id?: string
          mood?: string | null
          notes?: string | null
          symptoms?: string[] | null
          updated_at?: string
          user_phone: string
        }
        Update: {
          created_at?: string
          cycle_end?: string | null
          cycle_length?: number | null
          cycle_start?: string
          id?: string
          mood?: string | null
          notes?: string | null
          symptoms?: string[] | null
          updated_at?: string
          user_phone?: string
        }
        Relationships: []
      }
      menstrual_settings: {
        Row: {
          average_cycle_length: number | null
          average_period_length: number | null
          created_at: string
          email_notifications: boolean | null
          id: string
          notifications_enabled: boolean | null
          partner_access_enabled: boolean | null
          telegram_notifications: boolean | null
          updated_at: string
          user_phone: string
        }
        Insert: {
          average_cycle_length?: number | null
          average_period_length?: number | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          partner_access_enabled?: boolean | null
          telegram_notifications?: boolean | null
          updated_at?: string
          user_phone: string
        }
        Update: {
          average_cycle_length?: number | null
          average_period_length?: number | null
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          notifications_enabled?: boolean | null
          partner_access_enabled?: boolean | null
          telegram_notifications?: boolean | null
          updated_at?: string
          user_phone?: string
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
      platform_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
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
      private_diary_entries: {
        Row: {
          content_encrypted: string
          created_at: string
          id: string
          is_menstrual_entry: boolean
          iv: string
          menstrual_cycle_data_encrypted: string | null
          title_encrypted: string
          updated_at: string
          user_phone: string
        }
        Insert: {
          content_encrypted: string
          created_at?: string
          id?: string
          is_menstrual_entry?: boolean
          iv: string
          menstrual_cycle_data_encrypted?: string | null
          title_encrypted: string
          updated_at?: string
          user_phone: string
        }
        Update: {
          content_encrypted?: string
          created_at?: string
          id?: string
          is_menstrual_entry?: boolean
          iv?: string
          menstrual_cycle_data_encrypted?: string | null
          title_encrypted?: string
          updated_at?: string
          user_phone?: string
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
      security_audit_logs: {
        Row: {
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      staking_positions: {
        Row: {
          created_at: string
          id: string
          protocol_id: string
          rewards_earned: number | null
          staked_amount: number
          status: string
          transaction_hash: string
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          protocol_id: string
          rewards_earned?: number | null
          staked_amount: number
          status?: string
          transaction_hash: string
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          protocol_id?: string
          rewards_earned?: number | null
          staked_amount?: number
          status?: string
          transaction_hash?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "staking_positions_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "staking_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_protocols: {
        Row: {
          abi: Json
          apy: number
          contract_address: string
          created_at: string
          id: string
          is_active: boolean
          min_amount: number
          name: string
          network: string
          platform_fee_percentage: number | null
          token: string
          updated_at: string
        }
        Insert: {
          abi: Json
          apy: number
          contract_address: string
          created_at?: string
          id?: string
          is_active?: boolean
          min_amount: number
          name: string
          network: string
          platform_fee_percentage?: number | null
          token: string
          updated_at?: string
        }
        Update: {
          abi?: Json
          apy?: number
          contract_address?: string
          created_at?: string
          id?: string
          is_active?: boolean
          min_amount?: number
          name?: string
          network?: string
          platform_fee_percentage?: number | null
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      staking_rewards: {
        Row: {
          amount: number
          claimed: boolean
          id: string
          position_id: string
          timestamp: string
          transaction_hash: string | null
        }
        Insert: {
          amount: number
          claimed?: boolean
          id?: string
          position_id: string
          timestamp?: string
          transaction_hash?: string | null
        }
        Update: {
          amount?: number
          claimed?: boolean
          id?: string
          position_id?: string
          timestamp?: string
          transaction_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staking_rewards_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "staking_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_transactions: {
        Row: {
          amount: number
          created_at: string
          gas_fee: string | null
          gas_used: string | null
          hash: string
          id: string
          position_id: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          gas_fee?: string | null
          gas_used?: string | null
          hash: string
          id?: string
          position_id?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          gas_fee?: string | null
          gas_used?: string | null
          hash?: string
          id?: string
          position_id?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staking_transactions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "staking_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      swap_transactions: {
        Row: {
          completed_at: string | null
          created_at: string
          from_address: string
          from_amount: number
          from_currency: string
          id: string
          network_fee: string
          platform_fee_amount: number
          platform_fee_currency: string
          platform_fee_type: string
          status: string
          swap_rate: number
          to_address: string
          to_amount: number
          to_currency: string
          transaction_hash: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          from_address: string
          from_amount: number
          from_currency: string
          id?: string
          network_fee: string
          platform_fee_amount: number
          platform_fee_currency: string
          platform_fee_type: string
          status?: string
          swap_rate: number
          to_address: string
          to_amount: number
          to_currency: string
          transaction_hash?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          from_address?: string
          from_amount?: number
          from_currency?: string
          id?: string
          network_fee?: string
          platform_fee_amount?: number
          platform_fee_currency?: string
          platform_fee_type?: string
          status?: string
          swap_rate?: number
          to_address?: string
          to_amount?: number
          to_currency?: string
          transaction_hash?: string | null
          user_id?: string
        }
        Relationships: []
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
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          alert_type: string
          condition: string
          created_at: string
          currency: string
          id: string
          is_active: boolean
          notification_methods: string[]
          threshold: number
          title: string
          updated_at: string
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          alert_type: string
          condition: string
          created_at?: string
          currency: string
          id?: string
          is_active?: boolean
          notification_methods?: string[]
          threshold: number
          title: string
          updated_at?: string
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          alert_type?: string
          condition?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          notification_methods?: string[]
          threshold?: number
          title?: string
          updated_at?: string
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_alerts_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "crypto_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          current_amount: number
          goal_type: string
          id: string
          status: string
          target_amount: number
          target_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          goal_type: string
          id?: string
          status?: string
          target_amount: number
          target_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          goal_type?: string
          id?: string
          status?: string
          target_amount?: number
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_music: {
        Row: {
          album: string | null
          artist: string | null
          created_at: string | null
          duration: number | null
          file_size: number
          file_url: string
          id: string
          title: string
          updated_at: string | null
          user_phone: string
        }
        Insert: {
          album?: string | null
          artist?: string | null
          created_at?: string | null
          duration?: number | null
          file_size: number
          file_url: string
          id?: string
          title: string
          updated_at?: string | null
          user_phone: string
        }
        Update: {
          album?: string | null
          artist?: string | null
          created_at?: string | null
          duration?: number | null
          file_size?: number
          file_url?: string
          id?: string
          title?: string
          updated_at?: string | null
          user_phone?: string
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
      user_security_settings: {
        Row: {
          auto_lock_enabled: boolean | null
          biometric_enabled: boolean
          created_at: string
          failed_attempts: number
          id: string
          large_amount_threshold: number | null
          last_successful_auth: string | null
          locked_until: string | null
          max_failed_attempts: number | null
          pin_enabled: boolean
          pin_hash: string | null
          pin_salt: string | null
          require_biometric_for_large_amounts: boolean | null
          require_pin_for_transactions: boolean | null
          security_setup_completed: boolean
          session_timeout_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_lock_enabled?: boolean | null
          biometric_enabled?: boolean
          created_at?: string
          failed_attempts?: number
          id?: string
          large_amount_threshold?: number | null
          last_successful_auth?: string | null
          locked_until?: string | null
          max_failed_attempts?: number | null
          pin_enabled?: boolean
          pin_hash?: string | null
          pin_salt?: string | null
          require_biometric_for_large_amounts?: boolean | null
          require_pin_for_transactions?: boolean | null
          security_setup_completed?: boolean
          session_timeout_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_lock_enabled?: boolean | null
          biometric_enabled?: boolean
          created_at?: string
          failed_attempts?: number
          id?: string
          large_amount_threshold?: number | null
          last_successful_auth?: string | null
          locked_until?: string | null
          max_failed_attempts?: number | null
          pin_enabled?: boolean
          pin_hash?: string | null
          pin_salt?: string | null
          require_biometric_for_large_amounts?: boolean | null
          require_pin_for_transactions?: boolean | null
          security_setup_completed?: boolean
          session_timeout_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_session_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          token_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean
          token_hash: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          token_hash?: string
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
      user_stats: {
        Row: {
          created_at: string
          id: string
          last_activity: string
          level: number
          streak: number
          total_likes: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity?: string
          level?: number
          streak?: number
          total_likes?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_activity?: string
          level?: number
          streak?: number
          total_likes?: number
          updated_at?: string
          user_id?: string
          xp?: number
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
      widget_likes: {
        Row: {
          created_at: string
          id: string
          likes_count: number
          updated_at: string
          user_id: string
          widget_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          likes_count?: number
          updated_at?: string
          user_id: string
          widget_id: string
        }
        Update: {
          created_at?: string
          id?: string
          likes_count?: number
          updated_at?: string
          user_id?: string
          widget_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_next_cycle_prediction: {
        Args: { p_user_phone: string }
        Returns: {
          next_period_start: string
          next_period_end: string
          fertile_window_start: string
          fertile_window_end: string
          pms_start: string
        }[]
      }
      check_and_unlock_achievements: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      cleanup_expired_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_unique_referral_code: {
        Args: { user_name: string; user_id: string }
        Returns: string
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_event_details?: Json
          p_ip_address?: string
          p_user_agent?: string
          p_session_id?: string
        }
        Returns: undefined
      }
      process_referral: {
        Args: { referrer_code: string; referred_user_id: string }
        Returns: undefined
      }
      update_user_stats: {
        Args: { p_user_id: string; p_xp_change?: number }
        Returns: undefined
      }
      upsert_user_settings: {
        Args: {
          p_user_id: string
          p_telegram_notifications_enabled?: boolean
          p_email_daily_summary?: boolean
          p_email_weekly_summary?: boolean
          p_push_notifications_enabled?: boolean
          p_price_alert_threshold?: number
          p_balance_alert_threshold?: number
          p_telegram_chat_id?: string
        }
        Returns: {
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
      }
    }
    Enums: {
      message_type: "text" | "audio" | "image" | "video"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      message_type: ["text", "audio", "image", "video"],
    },
  },
} as const
