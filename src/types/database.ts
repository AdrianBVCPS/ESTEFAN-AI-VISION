export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Tipos de dominio para suscripción y roles
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'pending'
export type UserRole = 'superadmin' | 'barber'
export type UsageMode = 'mode_a' | 'mode_b'

export interface Database {
  // Requerido por @supabase/supabase-js >= 2.101
  // Versión 11 para compatibilidad con @supabase/ssr@0.10 (v12 rompe inferencia de columnas)
  __InternalSupabase: {
    PostgrestVersion: '11'
  }
  public: {
    Tables: {
      barber_profiles: {
        Row: {
          id: string
          display_name: string
          role: UserRole
          avatar_url: string | null
          subscription_status: SubscriptionStatus
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          last_payment_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: UserRole
          avatar_url?: string | null
          subscription_status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          last_payment_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: UserRole
          avatar_url?: string | null
          subscription_status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          last_payment_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      app_config: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          mode: UsageMode
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mode: UsageMode
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mode?: UsageMode
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_gemini_usage: {
        Args: { p_key: string; p_limit: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos de conveniencia
export type BarberProfile = Database['public']['Tables']['barber_profiles']['Row']
export type AppConfig = Database['public']['Tables']['app_config']['Row']
export type UsageLog = Database['public']['Tables']['usage_logs']['Row']
