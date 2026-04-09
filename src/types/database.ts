export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  // Requerido por @supabase/supabase-js >= 2.101
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      barber_profiles: {
        Row: {
          id: string
          display_name: string
          role: 'admin' | 'barber'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: 'admin' | 'barber'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: 'admin' | 'barber'
          avatar_url?: string | null
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
