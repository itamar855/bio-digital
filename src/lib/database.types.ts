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
      global_metrics: {
        Row: {
          id: number
          monthly_revenue: number | null
          support_tickets_count: number | null
          total_mpes: number | null
          total_partners: number | null
          updated_at: string | null
          urgent_tickets_count: number | null
        }
        Insert: {
          id?: number
          monthly_revenue?: number | null
          support_tickets_count?: number | null
          total_mpes?: number | null
          total_partners?: number | null
          updated_at?: string | null
          urgent_tickets_count?: number | null
        }
        Update: {
          id?: number
          monthly_revenue?: number | null
          support_tickets_count?: number | null
          total_mpes?: number | null
          total_partners?: number | null
          updated_at?: string | null
          urgent_tickets_count?: number | null
        }
        Relationships: []
      }
      mpe_details: {
        Row: {
          active_services_count: number | null
          company_name: string
          created_at: string | null
          journey_progress: number | null
          new_leads: number | null
          site_preview_url: string | null
          site_visits: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_services_count?: number | null
          company_name: string
          created_at?: string | null
          journey_progress?: number | null
          new_leads?: number | null
          site_preview_url?: string | null
          site_visits?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_services_count?: number | null
          company_name?: string
          created_at?: string | null
          journey_progress?: number | null
          new_leads?: number | null
          site_preview_url?: string | null
          site_visits?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mpe_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          company_name: string
          created_at: string | null
          creator_id: string | null
          duration: string
          id: string
          location: string
          price: number
          requirement: string
          title: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          creator_id?: string | null
          duration: string
          id?: string
          location: string
          price: number
          requirement: string
          title: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          creator_id?: string | null
          duration?: string
          id?: string
          location?: string
          price?: number
          requirement?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_details: {
        Row: {
          active_projects: number | null
          approval_status: string | null
          available_balance: number | null
          created_at: string | null
          journey_progress: number | null
          monthly_earnings: number | null
          opportunities_count: number | null
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_projects?: number | null
          approval_status?: string | null
          available_balance?: number | null
          created_at?: string | null
          journey_progress?: number | null
          monthly_earnings?: number | null
          opportunities_count?: number | null
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_projects?: number | null
          approval_status?: string | null
          available_balance?: number | null
          created_at?: string | null
          journey_progress?: number | null
          monthly_earnings?: number | null
          opportunities_count?: number | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: string
          priority: string | null
          status: string | null
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          commission: number
          created_at: string | null
          id: string
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          commission: number
          created_at?: string | null
          id?: string
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          commission?: number
          created_at?: string | null
          id?: string
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "mpe" | "partner" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
