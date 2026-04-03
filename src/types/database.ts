export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos de conveniencia
export type BarberProfile = Database['public']['Tables']['barber_profiles']['Row']
export type AppConfig = Database['public']['Tables']['app_config']['Row']
