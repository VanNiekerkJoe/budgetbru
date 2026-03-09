export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bill_reminders: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          frequency: string | null
          id: string
          is_paid: boolean
          is_recurring: boolean
          notification_days: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          frequency?: string | null
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          frequency?: string | null
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      couple_achievements: {
        Row: {
          badge_type: string
          couple_link_id: string
          created_at: string
          details: Json
          earned_date: string
          id: string
        }
        Insert: {
          badge_type: string
          couple_link_id: string
          created_at?: string
          details?: Json
          earned_date?: string
          id?: string
        }
        Update: {
          badge_type?: string
          couple_link_id?: string
          created_at?: string
          details?: Json
          earned_date?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_achievements_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_bill_reminders: {
        Row: {
          amount: number
          assigned_to: string | null
          couple_link_id: string
          created_at: string
          created_by: string
          due_date: string
          frequency: string | null
          id: string
          is_paid: boolean
          is_recurring: boolean
          notification_days: string
          split_percentage: number
          split_type: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          assigned_to?: string | null
          couple_link_id: string
          created_at?: string
          created_by: string
          due_date: string
          frequency?: string | null
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string
          split_percentage?: number
          split_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          assigned_to?: string | null
          couple_link_id?: string
          created_at?: string
          created_by?: string
          due_date?: string
          frequency?: string | null
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string
          split_percentage?: number
          split_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_bill_reminders_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_challenges: {
        Row: {
          couple_link_id: string
          created_at: string
          current_progress: number
          description: string
          end_date: string
          id: string
          reward: string | null
          start_date: string
          status: string
          target_value: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          couple_link_id: string
          created_at?: string
          current_progress?: number
          description: string
          end_date: string
          id?: string
          reward?: string | null
          start_date?: string
          status?: string
          target_value: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          couple_link_id?: string
          created_at?: string
          current_progress?: number
          description?: string
          end_date?: string
          id?: string
          reward?: string | null
          start_date?: string
          status?: string
          target_value?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_challenges_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_date_night_items: {
        Row: {
          actual_cost: number
          category: string
          created_at: string
          date_night_id: string
          description: string
          estimated_cost: number
          id: string
          is_completed: boolean
        }
        Insert: {
          actual_cost?: number
          category?: string
          created_at?: string
          date_night_id: string
          description: string
          estimated_cost?: number
          id?: string
          is_completed?: boolean
        }
        Update: {
          actual_cost?: number
          category?: string
          created_at?: string
          date_night_id?: string
          description?: string
          estimated_cost?: number
          id?: string
          is_completed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "couple_date_night_items_date_night_id_fkey"
            columns: ["date_night_id"]
            isOneToOne: false
            referencedRelation: "couple_date_nights"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_date_nights: {
        Row: {
          actual_spent: number
          budget_amount: number
          couple_link_id: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          planned_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          actual_spent?: number
          budget_amount?: number
          couple_link_id: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          planned_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          actual_spent?: number
          budget_amount?: number
          couple_link_id?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          planned_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_date_nights_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_goal_contributions: {
        Row: {
          amount: number
          contribution_date: string
          contributor_id: string
          created_at: string
          goal_id: string
          id: string
        }
        Insert: {
          amount: number
          contribution_date?: string
          contributor_id: string
          created_at?: string
          goal_id: string
          id?: string
        }
        Update: {
          amount?: number
          contribution_date?: string
          contributor_id?: string
          created_at?: string
          goal_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "couple_shared_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_links: {
        Row: {
          created_at: string
          id: string
          invite_code: string
          status: string
          updated_at: string
          user_id_1: string
          user_id_2: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          invite_code?: string
          status?: string
          updated_at?: string
          user_id_1: string
          user_id_2?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          invite_code?: string
          status?: string
          updated_at?: string
          user_id_1?: string
          user_id_2?: string | null
        }
        Relationships: []
      }
      couple_messages: {
        Row: {
          couple_link_id: string
          created_at: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          couple_link_id: string
          created_at?: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          couple_link_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_messages_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_monthly_budgets: {
        Row: {
          category_budgets: Json
          couple_link_id: string
          created_at: string
          id: string
          month_year: string
          spent_amount: number
          total_budget: number
          updated_at: string
        }
        Insert: {
          category_budgets?: Json
          couple_link_id: string
          created_at?: string
          id?: string
          month_year: string
          spent_amount?: number
          total_budget?: number
          updated_at?: string
        }
        Update: {
          category_budgets?: Json
          couple_link_id?: string
          created_at?: string
          id?: string
          month_year?: string
          spent_amount?: number
          total_budget?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_monthly_budgets_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_preferences: {
        Row: {
          bill_reminder_notifications: boolean
          challenge_notifications: boolean
          couple_link_id: string
          created_at: string
          id: string
          notifications_enabled: boolean
          transparency_mode: string
          updated_at: string
        }
        Insert: {
          bill_reminder_notifications?: boolean
          challenge_notifications?: boolean
          couple_link_id: string
          created_at?: string
          id?: string
          notifications_enabled?: boolean
          transparency_mode?: string
          updated_at?: string
        }
        Update: {
          bill_reminder_notifications?: boolean
          challenge_notifications?: boolean
          couple_link_id?: string
          created_at?: string
          id?: string
          notifications_enabled?: boolean
          transparency_mode?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_preferences_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: true
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_shared_expenses: {
        Row: {
          added_by: string
          amount: number
          category: string
          couple_link_id: string
          created_at: string
          date: string
          description: string
          id: string
          split_percentage: number
          split_type: string
        }
        Insert: {
          added_by: string
          amount: number
          category?: string
          couple_link_id: string
          created_at?: string
          date?: string
          description: string
          id?: string
          split_percentage?: number
          split_type?: string
        }
        Update: {
          added_by?: string
          amount?: number
          category?: string
          couple_link_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          split_percentage?: number
          split_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_shared_expenses_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_shared_goals: {
        Row: {
          couple_link_id: string
          created_at: string
          current_amount: number
          deadline: string | null
          icon: string
          id: string
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          couple_link_id: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string
          id?: string
          target_amount?: number
          title: string
          updated_at?: string
        }
        Update: {
          couple_link_id?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string
          id?: string
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_shared_goals_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_wishlists: {
        Row: {
          added_by: string
          couple_link_id: string
          created_at: string
          estimated_cost: number
          id: string
          is_purchased: boolean
          priority: string
          title: string
          url: string | null
        }
        Insert: {
          added_by: string
          couple_link_id: string
          created_at?: string
          estimated_cost?: number
          id?: string
          is_purchased?: boolean
          priority?: string
          title: string
          url?: string | null
        }
        Update: {
          added_by?: string
          couple_link_id?: string
          created_at?: string
          estimated_cost?: number
          id?: string
          is_purchased?: boolean
          priority?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "couple_wishlists_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      iou_splits: {
        Row: {
          created_at: string
          date: string
          id: string
          participants: Json
          title: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          participants?: Json
          title: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          participants?: Json
          title?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      ious: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          due_date: string | null
          id: string
          is_owed_to_me: boolean
          notes: string[]
          paid_amount: number
          person: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          date?: string
          description: string
          due_date?: string | null
          id?: string
          is_owed_to_me?: boolean
          notes?: string[]
          paid_amount?: number
          person: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          due_date?: string | null
          id?: string
          is_owed_to_me?: boolean
          notes?: string[]
          paid_amount?: number
          person?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          icon_type: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_type?: string
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_type?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_blocked: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_blocked?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_blocked?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roommate_bill_reminders: {
        Row: {
          amount: number
          assigned_to: string | null
          created_at: string
          created_by: string
          due_date: string
          frequency: string | null
          group_id: string
          id: string
          is_paid: boolean
          is_recurring: boolean
          notification_days: string
          split_details: Json
          split_type: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          assigned_to?: string | null
          created_at?: string
          created_by: string
          due_date: string
          frequency?: string | null
          group_id: string
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string
          split_details?: Json
          split_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          due_date?: string
          frequency?: string | null
          group_id?: string
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string
          split_details?: Json
          split_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_bill_reminders_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_group_members: {
        Row: {
          group_id: string
          id: string
          is_active: boolean
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          invite_code: string
          max_members: number
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          invite_code?: string
          max_members?: number
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          invite_code?: string
          max_members?: number
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      roommate_messages: {
        Row: {
          created_at: string
          group_id: string
          id: string
          message: string
          message_type: string
          metadata: Json
          sender_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          message: string
          message_type?: string
          metadata?: Json
          sender_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          message?: string
          message_type?: string
          metadata?: Json
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_monthly_budgets: {
        Row: {
          category_budgets: Json
          created_at: string
          group_id: string
          id: string
          individual_contributions: Json
          month_year: string
          spent_amount: number
          total_budget: number
          updated_at: string
        }
        Insert: {
          category_budgets?: Json
          created_at?: string
          group_id: string
          id?: string
          individual_contributions?: Json
          month_year: string
          spent_amount?: number
          total_budget?: number
          updated_at?: string
        }
        Update: {
          category_budgets?: Json
          created_at?: string
          group_id?: string
          id?: string
          individual_contributions?: Json
          month_year?: string
          spent_amount?: number
          total_budget?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_monthly_budgets_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_preferences: {
        Row: {
          auto_split_expenses: boolean
          bill_reminder_notifications: boolean
          created_at: string
          currency: string
          expense_approval_required: boolean
          expense_notifications: boolean
          group_id: string
          id: string
          notifications_enabled: boolean
          updated_at: string
        }
        Insert: {
          auto_split_expenses?: boolean
          bill_reminder_notifications?: boolean
          created_at?: string
          currency?: string
          expense_approval_required?: boolean
          expense_notifications?: boolean
          group_id: string
          id?: string
          notifications_enabled?: boolean
          updated_at?: string
        }
        Update: {
          auto_split_expenses?: boolean
          bill_reminder_notifications?: boolean
          created_at?: string
          currency?: string
          expense_approval_required?: boolean
          expense_notifications?: boolean
          group_id?: string
          id?: string
          notifications_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_preferences_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_shared_expenses: {
        Row: {
          added_by: string
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          group_id: string
          id: string
          receipt_url: string | null
          split_details: Json
          split_type: string
        }
        Insert: {
          added_by: string
          amount: number
          category?: string
          created_at?: string
          date?: string
          description: string
          group_id: string
          id?: string
          receipt_url?: string | null
          split_details?: Json
          split_type?: string
        }
        Update: {
          added_by?: string
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          group_id?: string
          id?: string
          receipt_url?: string | null
          split_details?: Json
          split_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_shared_expenses_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_shared_goals: {
        Row: {
          created_at: string
          created_by: string
          current_amount: number
          deadline: string | null
          description: string | null
          group_id: string
          icon: string
          id: string
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_amount?: number
          deadline?: string | null
          description?: string | null
          group_id: string
          icon?: string
          id?: string
          target_amount?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_amount?: number
          deadline?: string | null
          description?: string | null
          group_id?: string
          icon?: string
          id?: string
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roommate_shared_goals_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      roommate_wishlists: {
        Row: {
          added_by: string
          category: string
          created_at: string
          estimated_cost: number
          group_id: string
          id: string
          is_purchased: boolean
          notes: string | null
          priority: string
          purchased_by: string | null
          purchased_date: string | null
          title: string
          url: string | null
        }
        Insert: {
          added_by: string
          category?: string
          created_at?: string
          estimated_cost?: number
          group_id: string
          id?: string
          is_purchased?: boolean
          notes?: string | null
          priority?: string
          purchased_by?: string | null
          purchased_date?: string | null
          title: string
          url?: string | null
        }
        Update: {
          added_by?: string
          category?: string
          created_at?: string
          estimated_cost?: number
          group_id?: string
          id?: string
          is_purchased?: boolean
          notes?: string | null
          priority?: string
          purchased_by?: string | null
          purchased_date?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roommate_wishlists_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "roommate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_blocked: { Args: { _user_id: string }; Returns: boolean }
      is_couple_member: {
        Args: { _couple_link_id: string; _user_id: string }
        Returns: boolean
      }
      is_roommate_admin: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      is_roommate_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
